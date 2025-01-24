import * as BABYLON from '@babylonjs/core';
import '@babylonjs/loaders/glTF';
import earcut from 'earcut';
import {logger} from '~/utils';
import AsyncStorage from '@react-native-async-storage/async-storage';

export class Model3d {
  private engine: BABYLON.Engine | undefined;
  scene: BABYLON.Scene | undefined;
  camera: BABYLON.ArcRotateCamera | undefined;
  model: BABYLON.AbstractMesh | undefined;
  modelNativeSize: BABYLON.AbstractMesh | undefined;
  placementIndicator: BABYLON.AbstractMesh | undefined;
  targetScale: number = 1;
  appliedScale: number = 1;
  xrSession: BABYLON.WebXRSessionManager | undefined;
  planeTexture: BABYLON.Texture | undefined;
  planeMat: BABYLON.StandardMaterial | undefined;
  modelPlaced: boolean = false;
  deviceSourceManager: BABYLON.DeviceSourceManager | undefined;
  earcut: any | undefined = earcut;
  modelUrl?: string;
  isAnimationPlaying: boolean;
  arMode: boolean = false;
  modelIsOpen: boolean = false;

  currentTutorialStep: number = 0;
  private _onChangeStepCallbacks: Array<(newStep: number) => void> = [];
  setCurrentTutorialStep(newStep: number) {
    this.currentTutorialStep = newStep;
    this._onChangeStepCallbacks.forEach(callback => callback(newStep));
  }
  addOnChangeStepCallback(callback: (newStep: number) => void) {
    this._onChangeStepCallbacks.push(callback);
  }
  removeOnChangeStepCallback(callback: (newStep: number) => void) {
    this._onChangeStepCallbacks = this._onChangeStepCallbacks.filter(
      cb => cb !== callback,
    );
  }

  showTutorial: boolean = false;
  private _onShowTutorialCallbacks: Array<(show: boolean) => void> = [];
  setShowTutorial(show: boolean) {
    this.showTutorial = show;
    this._onShowTutorialCallbacks.forEach(callback => callback(show));
  }
  addOnShowTutorialCallback(callback: (show: boolean) => void) {
    this._onShowTutorialCallbacks.push(callback);
  }
  removeOnShowTutorialCallback(callback: (show: boolean) => void) {
    this._onShowTutorialCallbacks = this._onShowTutorialCallbacks.filter(
      cb => cb !== callback,
    );
  }

  showSkipButton: boolean = false;
  private _onChangeSkipButtonCallbacks: Array<(newStep: boolean) => void> = [];
  setShowSkipButtonStep(newStep: boolean) {
    this.showSkipButton = newStep;
    this._onChangeSkipButtonCallbacks.forEach(callback => callback(newStep));
  }
  addOnChangeSkipButtonCallback(callback: (newStep: boolean) => void) {
    this._onChangeSkipButtonCallbacks.push(callback);
  }
  removeOnChangeSkipButtonCallback(callback: (newStep: boolean) => void) {
    this._onChangeSkipButtonCallbacks =
      this._onChangeSkipButtonCallbacks.filter(cb => cb !== callback);
  }

  tutorialSteps = [
    {
      text: 'Tap on the surface where\nyou want to place the product',
      image: require('src/assets/lottie/tutorial_tap.json'),
    },
    // {
    //   text: 'Swipe across the surface\nto move the product',
    //   image: require('src/assets/lottie/tutorial_swipe_to_side.json'),
    // },
    {
      text: 'Swipe up to open the product',
      image: require('src/assets/lottie/tutorial_swipe_up.json'),
    },
    {
      text: 'Swipe down to close the product',
      image: require('src/assets/lottie/tutorial_swipe_down.json'),
    },
  ];

  constructor() {
    this.isAnimationPlaying = false;
  }

  public initializeSceneAsync = async (
    engine: BABYLON.Engine,
    modelUrl: string,
    onLoadEnd?: () => void,
  ) => {
    if (this.modelUrl !== modelUrl) {
      this.resetModel();
    }

    this.scene = new BABYLON.Scene(engine);
    this.scene.clearColor = new BABYLON.Color4(0, 0, 0, 0);

    this.engine = engine;
    this.modelUrl = modelUrl;
    this.scene.createDefaultCamera(true, false, true);
    this.camera = this.scene.activeCamera as BABYLON.ArcRotateCamera;

    this.camera.alpha = 1;
    this.camera.beta = 1;
    this.camera.radius = 1;
    this.camera.target = BABYLON.Vector3.Zero();
    this.camera.lowerBetaLimit = null;
    this.camera.lowerAlphaLimit = null;
    this.camera.minZ = 0;

    this.camera.lowerRadiusLimit = 0.5;
    this.camera.upperRadiusLimit = 1.5;

    this.camera.lowerBetaLimit = 0.5;
    this.camera.upperBetaLimit = Math.PI / 2;

    this.camera.useNaturalPinchZoom = true;
    this.camera.panningSensibility = 15000;

    this.camera.angularSensibilityX = 1000;
    this.camera.angularSensibilityY = 1000;

    this.camera.panningAxis = new BABYLON.Vector3(1, 1, 0);
    this.camera.panningDistanceLimit = 0.1;

    var light = new BABYLON.HemisphericLight(
      'light1',
      new BABYLON.Vector3(0, 5, 0),
      this.scene,
    );

    light.diffuse = BABYLON.Color3.White();
    light.intensity = 1;
    light.specular = new BABYLON.Color3(0, 0, 0);

    this.placementIndicator = BABYLON.Mesh.CreateTorus(
      'placementIndicator',
      0.5,
      0.005,
      64,
    );
    var indicatorMat = new BABYLON.StandardMaterial('noLight', this.scene);
    indicatorMat.disableLighting = true;
    indicatorMat.emissiveColor = BABYLON.Color3.White();
    this.placementIndicator.material = indicatorMat;
    this.placementIndicator.scaling = new BABYLON.Vector3(1, 0.01, 1);
    this.placementIndicator.setEnabled(false);

    const newModel = await BABYLON.SceneLoader.ImportMeshAsync(
      '',
      this.modelUrl,
    );
    onLoadEnd?.();
    this.model = newModel.meshes?.[0];
    this.model.position._y = -0.1;
    this.scene.stopAllAnimations();
    this.scene.activeCamera?.storeState();

    // this.animate();

    // Position the model in front of the camera.
    const {min, max} = this.model.getHierarchyBoundingVectors(true, null);
    // Set the target scale to cap the size of the model to targetScale meters tall.
    this.appliedScale = this.targetScale / (max.y - min.y);
    // this.model.position = this.camera.position.add(
    //   this.camera.getForwardRay().direction.scale(this.targetScale * 4),
    // );
    this.model.scalingDeterminant = this.appliedScale;
    // this.model.normalizeToUnitCube(true);
    // this.model.lookAt(this.camera.position);
    // this.camera.setTarget(this.model);
    // this.camera.beta -= Math.PI / 8;

    // Set up an animation loop to show the cube spinning.
    // const startTime = Date.now();
    // this.scene.beforeRender = () => {
    //   if (this.model && this.scene) {
    //     if (this.model.scalingDeterminant < this.targetScale) {
    //       const newScale = (this.targetScale * (Date.now() - startTime)) / 500;
    //       this.model.scalingDeterminant =
    //         newScale > this.appliedScale ? this.appliedScale : newScale;
    //     }
    //     this.model.rotate(
    //       BABYLON.Vector3.Up(),
    //       0.005 * this.scene.getAnimationRatio(),
    //     );
    //   }
    // };

    this.planeTexture = new BABYLON.Texture(
      'https://i.imgur.com/z7s3C5B.png',
      this.scene,
    );
    this.planeTexture.hasAlpha = true;
    this.planeTexture.uScale = 3;
    this.planeTexture.vScale = 3;
    this.planeTexture.coordinatesMode = BABYLON.Texture.PROJECTION_MODE;

    this.planeMat = new BABYLON.StandardMaterial('noLight', this.scene);
    this.planeMat.diffuseTexture = this.planeTexture;
  };

  public resetClick = () => {
    if (this.model && this.camera && this.scene && this.placementIndicator) {
      if (this.xrSession) {
        this.modelPlaced = false;
        this.model.setEnabled(false);
        this.placementIndicator.setEnabled(true);
      } else {
        this.placementIndicator?.setEnabled(false);
        this.reset2D();
      }
    }
  };

  // Function that resets the 2D screen state to its original position.
  public reset2D = () => {
    if (this.model && this.scene && this.camera) {
      this.model.setEnabled(true);
      this.model.position = this.camera.position.add(
        this.camera.getForwardRay().direction.scale(this.targetScale * 4),
      );
      this.model.scalingDeterminant = 2;
      this.camera.setTarget(this.model);
      //   const startTime = Date.now();
      //   this.scene.beforeRender = () => {
      //     if (this.model && this.scene) {
      //       if (this.model.scalingDeterminant < this.appliedScale) {
      //         // const newScale =
      //         //   (this.appliedScale * (Date.now() - startTime)) / 500;
      //         this.model.scalingDeterminant = this.appliedScale;
      //         //   newScale > this.appliedScale ? this.appliedScale : newScale;
      //       }

      //       //   this.model.rotate(
      //       //     BABYLON.Vector3.Up(),
      //       //     0.005 * this.scene.getAnimationRatio(),
      //       //   );
      //     }
      //   };
    }
  };

  placeModel = () => {
    if (
      this.xrSession &&
      this.placementIndicator?.isEnabled() &&
      this.scene &&
      this.model
    ) {
      this.modelPlaced = true;
      this.model.rotationQuaternion = BABYLON.Quaternion.Identity();
      this.model.setEnabled(true);
      this.model.position = this.placementIndicator.position.clone();
      this.model.scalingDeterminant = 1.5;

      this.getData().then(data => {
        if (data) {
          this.setShowTutorial(false);
        } else {
          this.setCurrentTutorialStep(1);
        }
      });

      // const startTime = Date.now();
      // this.scene.beforeRender = () => {
      //   if (this.model && this.model.scalingDeterminant < this.appliedScale) {
      //     const newScale = (this.appliedScale * (Date.now() - startTime)) / 500;
      //     this.model.scalingDeterminant =
      //       newScale > this.appliedScale ? this.appliedScale : newScale;
      //     this.model.markAsDirty('scaling');
      //   }
      // };
    }
  };

  changeModelPosition = () => {
    if (
      this.xrSession &&
      this.placementIndicator?.isEnabled() &&
      this.scene &&
      this.model
    ) {
      this.model.position = this.placementIndicator.position.clone();
    }
  };

  createInputHandling = () => {
    if (this.modelPlaced) {
      this.changeModelPosition();
    } else {
      this.placeModel();
    }
  };

  animate() {
    this.scene?.activeCamera?.restoreState();

    if (this.modelIsOpen) {
      this.setShowTutorial(false);
      this.storeData(true);
    } else {
      this.setCurrentTutorialStep(2);
    }

    if (!this.isAnimationPlaying) {
      const start = this.scene?.getAnimationGroupByName('start');
      start?.play();
      this.isAnimationPlaying = true;
      this.modelIsOpen = true;
    } else {
      const end = this.scene?.getAnimationGroupByName('end');
      end?.play();
      this.modelIsOpen = false;
      this.isAnimationPlaying = false;
    }
  }

  public async stopAR() {
    this.arMode = false;
    this.setShowTutorial(false);
    if (this.xrSession) {
      this.model?.setEnabled(false);
      this.placementIndicator?.setEnabled(false);

      await this.xrSession.exitXRAsync();

      this.xrSession = undefined;
      this.modelPlaced = true;
      this.model?.position.set(0, -0.04, 0);
      //   if (this.model) {
      //     this.model.scalingDeterminant = this.appliedScale;
      //   }
      //   this.model.scalingDeterminant = this.appliedScale;
      //   this.model?.scaling.set();
      //   if (this.model && this.camera) {
      //     this.model.position = this.camera.position.add(
      //       this.camera.getForwardRay().direction.scale(this.targetScale * 4),
      //     );
      //   }

      this.reset2D();
    }
  }

  async startAR() {
    if (this.model && this.scene && this.placementIndicator) {
      this.getData().then(data => {
        if (data) {
          this.setShowSkipButtonStep(false);
        } else {
          this.setShowSkipButtonStep(true);
        }
      });

      this.arMode = true;
      this.setCurrentTutorialStep(0);
      this.setShowTutorial(true);
      this.model.setEnabled(false);
      const xr = await this.scene.createDefaultXRExperienceAsync({
        disableDefaultUI: true,
        disableTeleportation: true,
        ignoreNativeCameraTransformation: true,
        pointerSelectionOptions: {
          enablePointerSelectionOnAllControllers: true,
        },
      });
      this.placementIndicator.setEnabled(true);
      // Set up the hit test.
      const xrHitTestModule = xr.baseExperience.featuresManager.enableFeature(
        BABYLON.WebXRFeatureName.HIT_TEST,
        'latest',
        {
          offsetRay: {
            origin: {x: 0, y: 0, z: 0},
            direction: {x: 0, y: 0, z: -1},
          },
        },
      ) as BABYLON.WebXRHitTest;

      // Do some plane shtuff.
      const xrPlanes = xr.baseExperience.featuresManager.enableFeature(
        BABYLON.WebXRFeatureName.PLANE_DETECTION,
        'latest',
      ) as BABYLON.WebXRPlaneDetector;
      const planes: any[] = [];

      xrPlanes.onPlaneAddedObservable.add(webXRPlane => {
        if (this.scene) {
          let plane: any = webXRPlane;
          webXRPlane.polygonDefinition.push(webXRPlane.polygonDefinition[0]);
          try {
            plane.mesh = BABYLON.MeshBuilder.CreatePolygon(
              'plane',
              {shape: plane.polygonDefinition},
              this.scene,
              this.earcut,
            );
            planes[plane.id] = plane.mesh;
            plane.mesh.material = this.planeMat;

            plane.mesh.rotationQuaternion = new BABYLON.Quaternion();
            plane.transformationMatrix.decompose(
              plane.mesh.scaling,
              plane.mesh.rotationQuaternion,
              plane.mesh.position,
            );
          } catch (ex) {
            logger.warn(ex);
          }
        }
      });

      xrPlanes.onPlaneUpdatedObservable.add(webXRPlane => {
        let plane: any = webXRPlane;
        if (plane.mesh) {
          plane.mesh.dispose(false, false);
        }

        const some = plane.polygonDefinition.some((p: any) => !p);
        if (some) {
          return;
        }

        plane.polygonDefinition.push(plane.polygonDefinition[0]);
        try {
          plane.mesh = BABYLON.MeshBuilder.CreatePolygon(
            'plane',
            {shape: plane.polygonDefinition},
            this.scene,
            this.earcut,
          );
          planes[plane.id] = plane.mesh;
          plane.mesh.material = this.planeMat;
          plane.mesh.rotationQuaternion = new BABYLON.Quaternion();
          plane.transformationMatrix.decompose(
            plane.mesh.scaling,
            plane.mesh.rotationQuaternion,
            plane.mesh.position,
          );
          plane.mesh.receiveShadows = true;
        } catch (e) {
          logger.warn(e);
        }
      });

      xrPlanes.onPlaneRemovedObservable.add(webXRPlane => {
        let plane: any = webXRPlane;
        if (plane && planes[plane.id]) {
          planes[plane.id].dispose();
        }
      });

      xrHitTestModule.onHitTestResultObservable.add(results => {
        if (results.length && this.placementIndicator) {
          this.placementIndicator.position = results[0].position;
        }
      });

      const session = await xr.baseExperience.enterXRAsync(
        'immersive-ar',
        'unbounded',
        xr.renderTarget,
      );
      this.model.setEnabled(false);
      this.modelPlaced = false;
      this.xrSession = session;
      // this.model.rotate(BABYLON.Vector3.Up(), 3.14159);
    }
  }

  resetModel() {
    this.camera = undefined;
    this.isAnimationPlaying = false;
    this.modelUrl = undefined;
    this.scene = undefined;
    this.engine = undefined;
    this.xrSession = undefined;
  }

  killScene() {
    this.scene?.meshes.forEach(mesh => {
      mesh.dispose();
    });
    this.scene?.animationGroups.forEach(animation => {
      animation.dispose();
    });
    this.scene?.particleSystems.forEach(system => {
      system.dispose();
    });
    this.scene?.skeletons.forEach(sk => {
      sk.dispose();
    });
    this.scene?.transformNodes.forEach(node => {
      node.dispose();
    });
    this.scene?.geometries.forEach(geo => {
      geo.dispose();
    });
    this.scene?.lights.forEach(light => {
      light.dispose();
    });
  }

  killModel() {
    this.killScene();
    this.model?.dispose();
    setTimeout(() => {
      this.scene?.dispose();
      this.engine?.stopRenderLoop();
      this.engine?.clearInternalTexturesCache();
      this.engine?.releaseEffects();
      this.engine?.releaseComputeEffects();
      this.engine?.unbindAllTextures();
      this.engine?.unbindAllAttributes();
      this.engine?.unbindInstanceAttributes();
    }, 100);
  }

  storeData = async (value: boolean): Promise<void> => {
    try {
      const stringValue = value ? 'true' : 'false';
      await AsyncStorage.setItem('@storage_Key', stringValue);
    } catch (e) {}
  };

  getData = async (): Promise<boolean | null> => {
    try {
      const stringValue = await AsyncStorage.getItem('@storage_Key');
      if (stringValue !== null) {
        return stringValue === 'true'; // Возвращает true или false
      }
      return null; // Возвращает null, если ключ не найден
    } catch (e) {
      return null;
    }
  };
}

export const product3DModel = new Model3d();
