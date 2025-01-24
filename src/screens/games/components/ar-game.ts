import {
  Scene,
  SceneLoader,
  Vector3,
  AbstractMesh,
  TransformNode,
  PBRMaterial,
  Texture,
  Animation,
  Animatable,
  Quaternion,
  Scalar,
  Material,
} from '@babylonjs/core';
import '@babylonjs/loaders/glTF';
var Sound = require('react-native-sound');
import {ArStickerGame, GameStep} from '~/store/query/games';
import {GameMode} from '../data/game-mode';
import {IGameListener} from '../interfaces/i-game-listener';
import {CancellablePromise} from '~/screens/games/components/cancelablePromise';
import {Vibration} from 'react-native';
import {resolveAssetUri} from '~/utils/utils';

const squareStickerUri = resolveAssetUri('sticker.glb');
const circleStickerUri = resolveAssetUri('sticker_roundl.glb');
const rectangleStickerUri = resolveAssetUri('sticker_rectangle.glb');

const animationFrameRate = 60;
const yAxisVector = new Vector3(0, 1, 0);
const xAxisVector = new Vector3(1, 0, 0);

const STICKER_START_POSITION = new Vector3(0, 0.08, 0.5);
const CIRCLE_STICKER_SCALE = 10;
const SQUARE_STICKER_SCALE = 20;
const REACTANGLE_STICKER_SCALE = 15;
const STICK_SOUND = 'sticker_sound.wav';
const CORRECT_ANSWER_SOUND = 'correct_answer.wav';
const WRONG_ANSWER_SOUND = 'wrong_answer.wav';
const MAX_ROTATION_X = 0.6981;
const MIN_ROTATION_X = -0.6981;

type LoadMeshPromise = CancellablePromise<AbstractMesh[]>;
type LoadTexturePromise = CancellablePromise<Texture>;

class EulerAngle {
  pitch: number = 0.0;
  roll: number = 0.0;
  yaw: number = 0.0;

  clone(): EulerAngle {
    const newAngle = new EulerAngle();
    newAngle.pitch = this.pitch;
    newAngle.roll = this.roll;
    newAngle.yaw = this.yaw;
    return newAngle;
  }
}

export class StickerGame {
  scene?: Scene;
  gameData?: ArStickerGame;
  _currentMode?: GameMode;
  stickerContainerNode?: TransformNode;
  parallaxNode?: TransformNode;
  currentAnimation?: Animatable;
  currentStickerMeshes?: AbstractMesh[];
  gameListener?: IGameListener;
  yRot?: Animation;
  stickAnimation?: Animation;
  scaleAnimation?: Animation;
  currentFrontMat?: PBRMaterial;
  currentBackMat?: PBRMaterial;
  scrollVelX?: number;
  dragging: boolean = false;
  rotationVelocity: number = 0.0;
  rotationDamping: number = 0.9;
  rotationVelocityY: number = 0.0;
  rotationDampingY: number = 0.9;
  rotationSpeed: number = 0.005;
  currentStep?: number;
  textureCache: Map<string, Texture> = new Map<string, Texture>();
  meshesCache: Map<number, AbstractMesh[]> = new Map<number, AbstractMesh[]>();
  materianCache: Map<number, Map<string, Material>> = new Map<
    number,
    Map<string, Material>
  >();
  orientations: Array<number> = [0, 0, 0];
  orientationsAngles: EulerAngle = new EulerAngle();
  enterOrientationsAngles: EulerAngle = new EulerAngle();
  lastDeltaTime: number = 0;
  activeStepData?: GameStep;
  prevGameMode?: GameMode;
  enterOrientations: Array<number> = [0, 0, 0];
  rejectMesh?: () => void;
  texturePromiseRejects: Array<() => void> = new Array<() => void>();

  pendingFoundAnimation: boolean = false;

  set currentMode(gameMode: GameMode) {
    this.prevGameMode = this._currentMode;
    this._currentMode = gameMode;
    this.gameListener?.onGameModeChanged(gameMode);
  }
  constructor() {}
  setData(game: ArStickerGame) {
    this.currentStep = game.currentStep;
    this.gameData = game;
  }
  answerQuiz(step: number, answer: boolean) {
    let stepData = this.gameData?.steps?.find(s => s.order === step);

    let correct = stepData?.rightAnswer === Number(answer);

    this.playSound(correct ? CORRECT_ANSWER_SOUND : WRONG_ANSWER_SOUND);
    Vibration.vibrate();

    this.gameListener?.onQuizAnswered(answer, correct);
  }
  private preloadTextures() {
    this.gameData?.steps?.forEach(step => {
      this.loadAndCacheTexture(step.frontSide.url, _ => {});
      this.loadAndCacheTexture(step.backSide.url, _ => {});
      this.loadAndCacheTexture(step.rightAnswerTexture.url, _ => {});
    });
  }
  private loadAndCacheTexture(
    url: string,
    onTextureReady: (texture: Texture) => void,
  ) {
    new Texture(url, this.scene, false, false).onLoadObservable.addOnce(
      texture => {
        this.textureCache.set(url, texture);
        onTextureReady(texture);
      },
    );
  }
  private getOrLoadTexture(url: string): LoadTexturePromise {
    return new Promise((resolve, rej) => {
      this.texturePromiseRejects.push(rej);
      if (this.textureCache.has(url)) {
        resolve(this.textureCache.get(url)!!);
      } else {
        this.loadAndCacheTexture(url, texture => {
          resolve(texture);
        });
      }
    }) as LoadTexturePromise;
  }
  private addCachedToSceneOrGetMaterial(
    shape: number,
    name: string,
    scene: Scene,
  ): PBRMaterial {
    let material: PBRMaterial;
    if (this.materianCache.get(shape)?.has(name)) {
      material = this.materianCache.get(shape)?.get(name) as PBRMaterial;
      scene.addMaterial(material!!);
    } else {
      material = scene.getMaterialByName(name, true) as PBRMaterial;

      let shapeMap = this.materianCache.get(shape);
      if (shapeMap) {
        shapeMap.set(name, material);
      } else {
        this.materianCache.set(
          shape,
          new Map<string, Material>([[name, material]]),
        );
      }
    }
    return material!!;
  }
  private getOrLoadMesh(shape: number, scene: Scene): LoadMeshPromise {
    let uri =
      shape === 0
        ? squareStickerUri
        : shape === 1
        ? circleStickerUri
        : rectangleStickerUri;

    let prom = new Promise<AbstractMesh[]>((resolve, reject) => {
      this.rejectMesh = reject;
      if (this.meshesCache.has(shape)) {
        resolve(this.meshesCache.get(shape)!!);
      } else {
        SceneLoader.ImportMesh(
          null,
          uri,
          null,
          scene,
          result => {
            this.meshesCache.set(shape, result);
            resolve(result);
          },
          null,
          () => {
            reject();
          },
        );
      }
    }) as LoadMeshPromise;
    prom.cancel = () => {
      if (this.rejectMesh) {
        this.rejectMesh();
      }
    };

    return prom;
  }

  prepareStep(step: number, doOnReady: () => void = () => {}) {
    let stepData = this.gameData?.steps?.find(s => s.order === step);

    if (stepData) {
      this.stickerContainerNode!!.setEnabled(false);
      if (this.currentStickerMeshes) {
        this.currentStickerMeshes[0].parent = null;
      }
      this.currentStickerMeshes?.forEach(mesh => {
        mesh.setEnabled(false);
      });
      if (this.currentFrontMat) {
        this.scene?.removeMaterial(this.currentFrontMat);
      }
      if (this.currentBackMat) {
        this.scene?.removeMaterial(this.currentBackMat);
      }

      if (this.rejectMesh) {
        this.rejectMesh();
      }
      this.texturePromiseRejects.forEach(item => item());

      this.getOrLoadMesh(stepData.shape, this.scene!!)
        .then(result => {
          result[0].parent = this.stickerContainerNode!!;

          this.enterOrientations = this.orientations.map(item => item);
          this.parallaxNode!!.parent = this.scene!!.activeCamera!!;

          let mat = this.addCachedToSceneOrGetMaterial(
            stepData!!.shape,
            'front_mt',
            this.scene!!,
          );
          let backMat = this.addCachedToSceneOrGetMaterial(
            stepData!!.shape,
            'back_mt',
            this.scene!!,
          );
          this.currentFrontMat = mat;
          this.currentBackMat = backMat;

          this.getOrLoadTexture(stepData!!.frontSide.url)
            .then(frontTexture => {
              this.currentFrontMat!!.albedoTexture = frontTexture;
            })
            .catch(_ => {});

          this.getOrLoadTexture(
            step < this.currentStep!!
              ? stepData!!.rightAnswerTexture.url
              : stepData!!.backSide.url,
          )
            .then(backTexture => {
              this.currentBackMat!!.albedoTexture = backTexture;
            })
            .catch(_ => {});

          this.currentStickerMeshes = result;

          result[0].parent = this.stickerContainerNode!!;
          result[0].position = new Vector3();

          let scale =
            stepData!!.shape === 0
              ? SQUARE_STICKER_SCALE
              : stepData!!.shape === 1
              ? CIRCLE_STICKER_SCALE
              : REACTANGLE_STICKER_SCALE;
          this.currentStickerMeshes[0].scaling = new Vector3(
            scale,
            scale,
            scale,
          );

          this.currentStickerMeshes[0].rotationQuaternion =
            Quaternion.RotationAxis(yAxisVector, Math.PI);
          this.stickerContainerNode!!.rotationQuaternion = new Quaternion();
          this.parallaxNode!!.rotationQuaternion = new Quaternion();

          this.currentStickerMeshes?.forEach(mesh => {
            mesh.setEnabled(true);
          });
          this.activeStepData = stepData;
          if (this.pendingFoundAnimation) {
            this.pendingFoundAnimation = false;
            this.markerFound();
          }
          doOnReady();
        })
        .catch(_ => {});
    }
  }

  quaternionToAngles(q: Quaternion): EulerAngle {
    let data = q;

    let ysqr = data.y * data.y;
    let t0 = -2.0 * (ysqr + data.z * data.z) + 1.0;
    let t1 = +2.0 * (data.x * data.y + data.w * data.z);
    let t2 = -2.0 * (data.x * data.z - data.w * data.y);
    let t3 = +2.0 * (data.y * data.z + data.w * data.x);
    let t4 = -2.0 * (data.x * data.x + ysqr) + 1.0;

    t2 = t2 > 1.0 ? 1.0 : t2;
    t2 = t2 < -1.0 ? -1.0 : t2;

    //const toDeg = 180 / Math.PI;

    const euler = new EulerAngle();
    euler.pitch = Math.asin(t2);
    euler.roll = Math.atan2(t3, t4);
    euler.yaw = Math.atan2(t1, t0);

    return euler;
  }
  update(deltaTime: number) {
    this.lastDeltaTime = deltaTime;
    if (
      this._currentMode === GameMode.QUIZ ||
      this._currentMode === GameMode.VIEW
    ) {
      if (
        !this.dragging &&
        (this.rotationVelocity > 0.005 || this.rotationVelocity < -0.005)
      ) {
        let deltaVelocity = Math.min(
          Math.sign(this.rotationVelocity) * deltaTime * this.rotationDamping,
          Math.sign(this.rotationVelocity) * this.rotationVelocity,
        );
        this.rotationVelocity -= deltaVelocity;
        if (this.currentStickerMeshes && this.currentStickerMeshes.length > 0) {
          this.currentStickerMeshes[0].rotate(
            yAxisVector,
            this.rotationVelocity,
          );
        }
      }
      if (
        !this.dragging &&
        (this.rotationVelocityY > 0.005 || this.rotationVelocityY < -0.005)
      ) {
        let deltaVelocityY = Math.min(
          Math.sign(this.rotationVelocityY) * deltaTime * this.rotationDampingY,
          Math.sign(this.rotationVelocityY) * this.rotationVelocityY,
        );
        this.rotationVelocityY -= deltaVelocityY;
        if (this.stickerContainerNode) {
          let newRotationAngles = this.stickerContainerNode.rotationQuaternion
            ?.multiply(
              Quaternion.RotationAxis(xAxisVector, this.rotationVelocityY),
            )
            .toEulerAngles();
          newRotationAngles!!.x = Scalar.Clamp(
            newRotationAngles!!.x,
            MIN_ROTATION_X,
            MAX_ROTATION_X,
          );

          this.stickerContainerNode.rotationQuaternion =
            Quaternion.FromEulerAngles(
              newRotationAngles!!.x,
              newRotationAngles!!.y,
              newRotationAngles!!.z,
            );
        }
      }
      if (this.parallaxNode) {
        this.parallaxNode.rotationQuaternion = Quaternion.Slerp(
          this.parallaxNode.rotationQuaternion!!,
          Quaternion.RotationAxis(
            new Vector3(1.0, 0, 0),
            this.orientationsAngles.roll - this.enterOrientationsAngles.roll,
          ).multiply(
            Quaternion.RotationAxis(
              new Vector3(0, -1.0, 0),
              this.orientationsAngles.yaw - this.enterOrientationsAngles.yaw,
            ),
          ),
          10 * deltaTime,
        );
      }
    }
  }

  startDragMode() {
    this.dragging = true;
  }
  endDragMode() {
    this.dragging = false;
  }
  rotateSticker(offsetX?: number, offsetY?: number) {
    if (
      this._currentMode === GameMode.QUIZ ||
      this._currentMode === GameMode.VIEW
    ) {
      if (this.currentStickerMeshes) {
        if (offsetX) {
          this.rotationVelocity = offsetX * this.rotationSpeed;
          this.currentStickerMeshes[0].rotate(
            new Vector3(0, 1, 0),
            this.rotationVelocity,
          );
        } else if (offsetY && this.stickerContainerNode) {
          this.rotationVelocityY = Scalar.Clamp(
            offsetY * this.rotationSpeed,
            MIN_ROTATION_X,
            MAX_ROTATION_X,
          );

          let angle = this.stickerContainerNode.rotationQuaternion
            ?.multiply(
              Quaternion.RotationAxis(
                new Vector3(1, 0, 0),
                this.rotationVelocityY,
              ),
            )
            .toEulerAngles();
          angle!!.x = Scalar.Clamp(angle!!.x, MIN_ROTATION_X, MAX_ROTATION_X);

          this.stickerContainerNode.rotationQuaternion =
            Quaternion.FromEulerAngles(angle!!.x, angle!!.y, angle!!.z);
        }
      }
    }
  }

  init(scene: Scene, gameData: ArStickerGame, gameListener?: IGameListener) {
    this.textureCache = new Map<string, Texture>();
    this.meshesCache = new Map<number, AbstractMesh[]>();
    this.materianCache = new Map<number, Map<string, Material>>();
    this.texturePromiseRejects = new Array<() => void>();
    this.gameListener = gameListener;

    this.scene = scene;
    this.gameData = gameData;
    this.currentMode = GameMode.SCANNER;
    this.stickerContainerNode = new TransformNode('container', scene);
    this.parallaxNode = new TransformNode('parallax', scene);
    this.stickerContainerNode.rotationQuaternion = new Quaternion();
    this.parallaxNode.rotationQuaternion = new Quaternion();
    this.parallaxNode.position = STICKER_START_POSITION;
    this.stickerContainerNode.parent = this.parallaxNode;

    this.currentStep = gameData.currentStep!!;
    this.initStaticAnimations();
    this.preloadTextures();
    this.prepareStep(gameData.currentStep!!);
  }

  initStaticAnimations() {
    this.yRot = new Animation(
      'yRot',
      'rotationQuaternion',
      animationFrameRate,
      Animation.ANIMATIONTYPE_QUATERNION,
      Animation.ANIMATIONLOOPMODE_CONSTANT,
    );

    let keyFramesR = [];
    for (let i = 0; i < 6; i++) {
      keyFramesR.push({
        frame: i * animationFrameRate,
        value: Quaternion.RotationAxis(yAxisVector, 180 - 90 * i),
      });
    }

    this.stickAnimation = new Animation(
      'stick',
      'position.y',
      animationFrameRate,
      Animation.ANIMATIONTYPE_FLOAT,
      Animation.ANIMATIONLOOPMODE_CONSTANT,
    );

    let keyFramesStick = [];

    keyFramesStick.push({
      frame: 0,
      value: STICKER_START_POSITION.y,
    });
    keyFramesStick.push({
      frame: 0.3 * animationFrameRate,
      value: -0.35,
    });

    this.yRot.setKeys(keyFramesR);
    this.stickAnimation.setKeys(keyFramesStick);
  }
  initScaleAnimation(from: Vector3, to: Vector3) {
    this.scaleAnimation = new Animation(
      'scale',
      'scaling',
      animationFrameRate,
      Animation.ANIMATIONTYPE_VECTOR3,
      Animation.ANIMATIONLOOPMODE_CONSTANT,
    );

    let keyFramesScale = [];

    keyFramesScale.push({
      frame: 0,
      value: from,
    });
    keyFramesScale.push({
      frame: 0.3 * animationFrameRate,
      value: to,
    });

    this.scaleAnimation.setKeys(keyFramesScale);
  }
  goToStep(step: number) {
    this.enterOrientationsAngles = this.orientationsAngles.clone();

    if (step < this.currentStep!!) {
      this.prepareStep(step, () => {
        this.currentMode = GameMode.VIEW;
        this.stickerContainerNode?.setEnabled(true);
      });
    } else if (step === this.currentStep) {
      this.currentMode = GameMode.SCANNER;
      this.prepareStep(step);
    }
  }
  scaleSticker(scale: number) {
    if (
      this.currentStickerMeshes &&
      this.activeStepData &&
      (this._currentMode === GameMode.VIEW ||
        this._currentMode === GameMode.QUIZ ||
        this._currentMode === GameMode.ZOOM)
    ) {
      if (this._currentMode !== GameMode.ZOOM) {
        this.currentMode = GameMode.ZOOM;
      }

      this.currentStickerMeshes[0].scaling = this.getScaleByShape(
        this.activeStepData.shape,
      ).scale(scale);
    }
  }
  //triggers with start scroll too :(
  startScale() {
    if (this.currentStickerMeshes) {
      //this.currentMode = GameMode.ZOOM;
      this.scene?.stopAnimation(this.currentStickerMeshes[0], 'scale');
    }
  }
  endScale() {
    if (
      this.currentStickerMeshes &&
      this.activeStepData &&
      this._currentMode === GameMode.ZOOM
    ) {
      this.currentMode = this.prevGameMode!!;
      this.playScaleAnimation(
        this.currentStickerMeshes[0].scaling,
        this.getScaleByShape(this.activeStepData.shape),
      );
    }
  }
  getScaleByShape(shape: number): Vector3 {
    let scale =
      shape === 0
        ? SQUARE_STICKER_SCALE
        : shape === 1
        ? CIRCLE_STICKER_SCALE
        : REACTANGLE_STICKER_SCALE;
    return new Vector3(scale, scale, scale);
  }
  playScaleAnimation(from: Vector3, to: Vector3) {
    this.initScaleAnimation(from, to);
    this.currentAnimation = this?.scene?.beginDirectAnimation(
      this.currentStickerMeshes!![0],
      [this.scaleAnimation!!],
      0,
      2 * animationFrameRate,
      false,
    );
  }
  loadNextStep() {
    this.initScaleAnimation(
      this.currentStickerMeshes!![0].scaling,
      new Vector3(0.001, 0.001, 0.001),
    );
    this.currentMode = GameMode.ANIMATION;
    let isLastStep =
      this.gameData!!.currentStep === this.gameData!!.steps!!.length - 1;
    this.currentAnimation = this?.scene?.beginDirectAnimation(
      this.currentStickerMeshes!![0],
      [this.stickAnimation!!, this.scaleAnimation!!],
      0,
      2 * animationFrameRate,
      false,
    );
    let currentStep = this.gameData!!.currentStep;
    this.currentAnimation!!.onAnimationEnd = () => {
      Vibration.vibrate();
      this.playSound(STICK_SOUND);
      if (!isLastStep) {
        this.currentMode = GameMode.SCANNER;
        this.gameListener?.onNewStep(
          this.gameData!!.steps!!.find(
            item => item.order === currentStep + 1,
          )!!,
        );
        this.currentStep = currentStep + 1;
        this.prepareStep(currentStep + 1, () => {});
      } else {
        this.gameListener?.onGameFinished();
      }
    };
  }

  setListener(listener: IGameListener) {
    this.gameListener = listener;
  }
  setOrientations(x: number, y: number, z: number) {
    this.orientations[0] = x;
    this.orientations[1] = y;
    this.orientations[2] = z;
  }
  setOrientationQuaternion(qx: number, qy: number, qz: number, qw: number) {
    this.orientationsAngles = this.quaternionToAngles(
      new Quaternion(qx, qy, qz, qw),
    );
  }
  playSound(soundPath: string) {
    let sound = new Sound(soundPath, Sound.MAIN_BUNDLE, (error: any) => {
      if (error) {
        return;
      }

      sound.play((_: any) => {});
    });
  }
  markerFound() {
    if (this._currentMode === GameMode.SCANNER && this.currentStickerMeshes) {
      this.enterOrientationsAngles = this.orientationsAngles.clone();
      this.stickerContainerNode?.setEnabled(true);
      Vibration.vibrate();

      this.currentMode = GameMode.ANIMATION;
      this.currentAnimation = this?.scene?.beginDirectAnimation(
        this.currentStickerMeshes!![0],
        [this.yRot!!],
        0,
        6 * animationFrameRate,
        false,
      );
      this.currentAnimation!!.onAnimationEnd = () => {
        this.currentMode = GameMode.QUIZ;
      };
    } else if (!this.currentStickerMeshes) {
      this.pendingFoundAnimation = true;
    }
  }
}
export const stickerGame = new StickerGame();
