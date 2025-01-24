import {
  Scene,
  Camera,
  SceneLoader,
  Vector3,
  HemisphericLight,
  ArcRotateCamera,
  Color4,
  AbstractMesh,
  ActionManager,
  PointerEventTypes,
  Engine,
  WebXRSessionManager,
} from '@babylonjs/core';
import '@babylonjs/loaders/glTF';
import {logger} from '~/utils';

export class Model3d {
  activeCamera?: Camera;
  isAnimationPlaying: boolean;
  modelUrl?: string;
  loadedScene?: Scene;
  engine?: Engine;
  xrSession?: WebXRSessionManager;

  constructor() {
    this.activeCamera;
    this.isAnimationPlaying = false;
    this.modelUrl;
    this.loadedScene;
    this.engine;
    this.xrSession;
  }

  init(engine: Engine, modelUrl: string, onLoadEnd?: () => void) {
    this.resetModel();
    const scene = new Scene(engine, {});
    scene.clearColor = new Color4(0, 0, 0, 0);
    this.modelUrl = modelUrl;
    this.engine = engine;
    this.initModelUrl(scene, onLoadEnd);
    return scene.activeCamera;
  }

  initModelUrl(scene: Scene, onLoadEnd?: () => void) {
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

    const light3 = new HemisphericLight(
      'HemiLight',
      new Vector3(0, 1, 0),
      scene,
    );
    const canvas = this.engine!.getRenderingCanvas();
    arcCamera.attachControl(canvas, true);
    scene.addLight(light3);
    SceneLoader.AppendAsync('', this.modelUrl, scene)
      .then(async (response: Scene) => {
        onLoadEnd?.();
        this.loadedScene = response;
        response?.stopAllAnimations();
        response.actionManager = new ActionManager(response);
        response.activeCamera?.storeState();
        this.animate(scene);
        response.meshes?.forEach((mesh: AbstractMesh) => {
          if (mesh.name === '__root__') {
            mesh.normalizeToUnitCube(true);
            mesh?.scaling.set(2.5, 2.5, -2.5);
          }
          mesh?.position.set(0, -0.1, 0);
        });
      })
      .catch(error => {
        logger.warn(error);
      });
  }

  async startAR() {
    if (this.loadedScene) {
      this.loadedScene.meshes.forEach((mesh: AbstractMesh) => {
        if (mesh.name === '__root__') {
          mesh.scaling.set(1.5, 1.5, -1.5);
        }
      });
      const xr = await this.loadedScene.createDefaultXRExperienceAsync({
        disableDefaultUI: true,
        disableTeleportation: false,
      });
      xr.baseExperience
        .enterXRAsync('immersive-ar', 'unbounded', xr.renderTarget)
        .then(session => {
          this.xrSession = session;
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

  animate(scene: Scene) {
    scene.onPointerObservable.add(() => {
      scene.activeCamera?.restoreState();
      if (!this.isAnimationPlaying) {
        const start = scene.getAnimationGroupByName('start');
        start?.play();
        this.isAnimationPlaying = true;
      } else {
        const end = scene.getAnimationGroupByName('end');
        end?.play();
        this.isAnimationPlaying = false;
      }
    }, PointerEventTypes.POINTERTAP);
  }

  killModel() {
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

export const model3d = new Model3d();
