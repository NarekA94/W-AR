import {
  Scene,
  Camera,
  Vector3,
  HemisphericLight,
  ArcRotateCamera,
  Color4,
  AbstractMesh,
  PointerEventTypes,
  Engine,
  WebXRSessionManager,
} from '@babylonjs/core';
import '@babylonjs/loaders/glTF';
import {IScannerListener} from '~/screens/games/interfaces/i-scanner-listener';
import {IArScanner} from '~/screens/games/interfaces/i-ar-scanner';
import {ScannerMarker} from '../data/scanner-marker';
import {ISceneTouchListener} from '../interfaces/scene-touch-listener';
import {ISceneListener} from '../interfaces/i-scene-listener';

export class ArScene {
  activeCamera?: Camera;
  isAnimationPlaying: boolean;
  modelUrl?: string;
  loadedScene?: Scene;
  engine?: Engine;
  xrSession?: WebXRSessionManager;
  touchListener?: ISceneTouchListener;
  sceneListener?: ISceneListener;

  constructor() {
    this.activeCamera;
    this.isAnimationPlaying = false;
    this.modelUrl;
    this.loadedScene;
    this.engine;
    this.xrSession;
    this.touchListener;
    this.sceneListener;
  }

  init(
    engine: Engine,
    scanner?: IArScanner,
    scannerData?: ScannerMarker[],
    scannerListener?: IScannerListener,
    touchListener?: ISceneTouchListener,
    sceneListener?: ISceneListener,
  ) {
    this.resetModel();
    const scene = new Scene(engine, {});
    scene.clearColor = new Color4(0, 0, 0, 0);
    this.engine = engine;
    this.initCamera(scene);
    this.initLight(scene);
    this.loadedScene = scene;
    this.touchListener = touchListener;
    this.sceneListener = sceneListener;
    scene.useRightHandedSystem = true;
    this.initAR(scanner, scannerData, scannerListener);
    scene.onBeforeRenderObservable.add(() => {
      this.activeCamera?.inputs.checkInputs();
      sceneListener?.onSceneFrame(this.loadedScene!!.deltaTime);
    });
    return scene;
  }

  initLight(scene: Scene) {
    const light3 = new HemisphericLight(
      'HemiLight',
      new Vector3(0, 1, 0),
      scene,
    );
    scene.addLight(light3);
  }
  initCamera(scene: Scene): ArcRotateCamera {
    const arcCamera = new ArcRotateCamera(
      'ArcRotateCamera',
      1.2,
      1.2,
      1.3,
      Vector3.Zero(),
      scene,
    );
    arcCamera.lowerBetaLimit = null;
    arcCamera.upperBetaLimit = null;
    arcCamera.minZ = 0;
    arcCamera.angularSensibilityX = 2000;
    arcCamera.angularSensibilityY = 2000;
    if (scene.activeCamera) {
      this.activeCamera = scene.activeCamera;
    }

    const canvas = this.engine!.getRenderingCanvas();
    arcCamera.attachControl(canvas, true);
    return arcCamera;
  }

  async initAR(
    scanner?: IArScanner,
    scannerData?: ScannerMarker[],
    scannerListener?: IScannerListener,
  ) {
    if (this.loadedScene) {
      const xr = await this.loadedScene.createDefaultXRExperienceAsync({
        disableDefaultUI: true,
        disableTeleportation: true,
      });

      if (scanner && scannerData) {
        scanner?.init(xr, scannerData, scannerListener);
      }
      await xr.baseExperience.enterXRAsync(
        'immersive-ar',
        'unbounded',
        xr.renderTarget,
      );
      this.sceneListener?.onSceneReady(this.loadedScene);

      this.loadedScene.onPointerObservable.add(pointerInfo => {
        switch (pointerInfo.type) {
          case PointerEventTypes.POINTERDOWN:
            this.touchListener?.onStartDrag();
            break;
          case PointerEventTypes.POINTERUP:
            this.touchListener?.onEndDrag();
            break;
          case PointerEventTypes.POINTERMOVE:
            //console.log('pointer move', pointerInfo.event.movementX);
            if (
              Math.abs(pointerInfo.event.movementX) >
              Math.abs(pointerInfo.event.movementY)
            ) {
              this.touchListener?.onScrollHorizontal(
                pointerInfo.event.movementX,
              );
            } else {
              this.touchListener?.onScrollVertical(pointerInfo.event.movementY);
            }
            break;
          case PointerEventTypes.POINTERWHEEL:
            break;
          case PointerEventTypes.POINTERPICK:
            break;
          case PointerEventTypes.POINTERTAP:
            break;
          case PointerEventTypes.POINTERDOUBLETAP:
            break;
          default:
            break;
        }
      });
    }
  }

  async stopAR() {
    if (this.xrSession) {
      await this.xrSession.exitXRAsync();
      this.loadedScene?.meshes.forEach((mesh: AbstractMesh) => {
        if (mesh.name === '__root__') {
          mesh.scaling.set(2.5, 2.5, -2.5);
        }
      });
    }
  }

  clearScene() {
    this.loadedScene?.dispose();
  }

  resetModel() {
    this.activeCamera = undefined;
    this.isAnimationPlaying = false;
    this.modelUrl = undefined;
    this.loadedScene = undefined;
    this.engine = undefined;
    this.xrSession = undefined;
  }
}

export const arScene = new ArScene();
