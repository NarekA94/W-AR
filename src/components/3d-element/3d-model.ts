import {downloadAndSaveFileToCache} from '~/utils/caching';
import * as BABYLON from '@babylonjs/core';
import {ArcRotateCamera, Vector3} from '@babylonjs/core';
import {logger} from '~/utils';
import {resolveAssetUri} from '~/utils/utils';

const defaultScale = 1;
const minScale = 0.75;
export class Model3D {
  engine?: BABYLON.Engine;
  modelUrl?: string;
  scene?: BABYLON.Scene;
  activeCamera?: BABYLON.ArcRotateCamera;
  isAnimationPlaying: boolean;
  isInitialize: boolean;
  model: BABYLON.AbstractMesh | undefined;

  private onChangeLoading?: (isInitialize?: boolean) => void;

  addOnChangeLoading(callback: (isInitialize?: boolean) => void) {
    this.onChangeLoading = callback;
  }

  constructor() {
    this.isAnimationPlaying = false;
    this.isInitialize = false;
  }

  init(engine: BABYLON.Engine, modelUrl: string) {
    if (this.modelUrl !== modelUrl) {
      this.resetModel();
    }
    this.isInitialize = false;
    this.engine = engine;
    this.modelUrl = modelUrl;
  }

  async initModel() {
    if (!this.modelUrl) {
      throw new Error('Model URL is not set');
    }

    try {
      const cachedModelUrl = await downloadAndSaveFileToCache(this.modelUrl);
      if (!cachedModelUrl) {
        throw new Error('Cached model URL is not available');
      }

      this.engine?.stopRenderLoop();

      const loadedScene = await BABYLON.SceneLoader.LoadAsync(
        cachedModelUrl,
        undefined,
        this.engine,
      );
      this.scene = loadedScene;

      this.scene.createDefaultCameraOrLight(true, true, true);
      this.activeCamera = this.scene.activeCamera as ArcRotateCamera;
      this.model = this.scene.meshes[0];
      this.zoomCameraByModelHeight();
      this.normalizeCamera();
      this.scene.clearColor = new BABYLON.Color4(0, 0, 0, 0);
      this.scene.stopAllAnimations();
      this.onChangeLoading?.();
      this.engine?.runRenderLoop(() => {
        this.scene?.render();
      });
      this.isInitialize = true;
      this.scene.activeCamera?.storeState();
      const hdrTexture = BABYLON.CubeTexture.CreateFromPrefilteredData(
        resolveAssetUri('weedar.env'),
        loadedScene,
      );
      hdrTexture.level = 2.5;

      (loadedScene.materials[0] as BABYLON.PBRMaterial).reflectionTexture =
        hdrTexture;
      return loadedScene.activeCamera;
    } catch (error) {
      logger.warn(error);

      throw error;
    }
  }

  zoomCameraByModelHeight() {
    if (this.model && this.activeCamera) {
      const {min, max} = this.model.getHierarchyBoundingVectors(true, null);
      const modelHeight = max.y - min.y;
      this.activeCamera.setPosition(
        new Vector3(
          this.activeCamera.position.x,
          this.activeCamera.position.y,
          Math.abs(modelHeight - this.activeCamera.position.z - 0.1),
        ),
      );
    }
  }

  normalizeCamera() {
    if (this.activeCamera) {
      this.activeCamera.lowerBetaLimit = null;
      this.activeCamera.upperBetaLimit = null;
      this.activeCamera.lowerRadiusLimit = 0.3;
      this.activeCamera.upperRadiusLimit = 1.5;

      this.activeCamera.useNaturalPinchZoom = true;
      this.activeCamera.panningSensibility = 15000;
      this.activeCamera.panningAxis = new BABYLON.Vector3(1, 1, 0);
      this.activeCamera.panningDistanceLimit = 0.1;
      this.activeCamera.alpha = Math.PI / 2;
      this.activeCamera.minZ = 0;
      this.activeCamera.angularSensibilityX = 2000;
      this.activeCamera.angularSensibilityY = 2000;
    }
  }

  animateToPoint(
    mesh: BABYLON.AbstractMesh,
    targetProp: string,
    startValue: number | string,
    endValue: number | string,
  ) {
    // Step 2: Create a new Animation object with the specified parameters
    let anim = new BABYLON.Animation(
      'animateToPoint', // Animation name
      targetProp, // Target property to animate (e.g., scalingDeterminant, position._y)
      50, // Animation frame rate (50 frames per second in this case)
      BABYLON.Animation.ANIMATIONTYPE_FLOAT,
      BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE,
    );

    // Step 3: Define the keyframes for the animation
    let keys = [];
    keys.push({
      frame: 0, // Start frame (frame number 0)
      value: startValue, // Start value of the target property
    });
    keys.push({
      frame: 50, // End frame (frame number 50)
      value: endValue, // End value of the target property
    });
    anim.setKeys(keys); // Set the keyframes for the animation

    // Step 4: Add the animation to the mesh's animations array
    mesh.animations.push(anim);

    // Step 5: Begin the animation on the mesh from frame 0 to frame 50 (with a duration of 50 frames)
    this.scene?.beginAnimation(mesh, 0, 50, false);
  }

  animate(adaptiveScale: boolean = true) {
    if (this.scene && this.isInitialize) {
      this.scene.activeCamera?.restoreState();

      // Step 9: Check if an animation is already playing
      if (this.isAnimationPlaying) {
        // Get the second animation group (assuming there are at least two animation groups)
        const animation = this.scene.animationGroups[1];
        // Play the animation
        animation?.play();
        if (adaptiveScale) {
          // Add a one-time event handler for when the animation ends
          animation?.onAnimationEndObservable.addOnce(() => {
            this.animateToScale();
          });
        }

        // Set isAnimationPlaying to false to indicate the animation is no longer playing
        this.isAnimationPlaying = false;
      } else {
        if (adaptiveScale) {
          this.updateScale(minScale);
        }

        // Step 10: Play the first animation group in the scene
        this.scene?.animationGroups[0].play(false);

        // Step 11: Set isAnimationPlaying to true to indicate the animation is playing
        this.isAnimationPlaying = true;
      }
    }
  }

  updateScale(scale: number) {
    if (this.scene) {
      this.scene.meshes[0].scaling = new BABYLON.Vector3(scale, scale, -scale);
    }
  }

  animateToScale() {
    if (this.scene) {
      const mesh = this.scene.meshes[0];
      this.animateToPoint(mesh, 'scaling.x', minScale, defaultScale);
      this.animateToPoint(mesh, 'scaling.y', minScale, defaultScale);
      this.animateToPoint(mesh, 'scaling.z', -minScale, -defaultScale);
    }
  }

  resetModel() {
    this.activeCamera = undefined;
    this.isAnimationPlaying = false;
    this.modelUrl = undefined;
    this.scene = undefined;
    this.engine = undefined;
  }

  disposeObjectArray(
    objects: (
      | BABYLON.AbstractMesh
      | BABYLON.AnimationGroup
      | BABYLON.IParticleSystem
      | BABYLON.Skeleton
      | BABYLON.TransformNode
      | BABYLON.Geometry
      | BABYLON.Light
    )[],
  ) {
    objects.forEach(obj => {
      obj.dispose();
    });
  }

  killScene() {
    if (this.scene) {
      this.disposeObjectArray([
        ...this.scene?.meshes,
        ...this.scene?.animationGroups,
        ...this.scene?.particleSystems,
        ...this.scene?.skeletons,
        ...this.scene?.transformNodes,
        ...this.scene?.geometries,
        ...this.scene?.lights,
      ]);
    }
  }

  killModel() {
    this.killScene();
    requestAnimationFrame(() => {
      this.scene?.dispose();
      this.engine?.stopRenderLoop();
      this.engine?.clearInternalTexturesCache();
      this.engine?.releaseEffects();
      this.engine?.releaseComputeEffects();
      this.engine?.unbindAllTextures();
      this.engine?.unbindAllAttributes();
      this.engine?.unbindInstanceAttributes();
    });
  }
}

export const model3d = new Model3D();
