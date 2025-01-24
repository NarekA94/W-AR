import * as BABYLON from '@babylonjs/core';
import '@babylonjs/loaders/glTF';
import earcut from 'earcut';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Model3D} from '~/components/3d-element/3d-model';

class Product3DModel extends Model3D {
  xrSession: BABYLON.WebXRSessionManager | undefined;
  planeTexture: BABYLON.Texture | undefined;
  planeMat: BABYLON.StandardMaterial | undefined;
  modelPlaced: boolean = false;
  deviceSourceManager: BABYLON.DeviceSourceManager | undefined;
  earcut: any | undefined = earcut;
  placementIndicator: BABYLON.AbstractMesh | undefined;
  arMode: boolean = false;
  modelIsOpen: boolean = false;
  appliedScale: number = 1;
  targetScale: number = 1;

  currentTutorialStep: number = 0;

  placementIndicatorObserver?: BABYLON.Observer<BABYLON.Scene>;

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

  async initProductModel() {
    try {
      await this.initModel();
      this.createPlacementIndicator();
    } catch (error) {
      throw error;
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

      const session = await xr.baseExperience.enterXRAsync(
        'immersive-ar',
        'unbounded',
        xr.renderTarget,
      );
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

      xrHitTestModule.onHitTestResultObservable.add(results => {
        if (results.length && this.placementIndicator) {
          this.placementIndicator.position = results[0].position;
        }
      });

      this.model.setEnabled(false);
      this.modelPlaced = false;
      this.xrSession = session;
    }
  }

  public async stopAR() {
    this.model?.setEnabled(false);
    this.placementIndicator?.setEnabled(false);
    await this.xrSession?.exitXRAsync();
    this.xrSession = undefined;
    this.arMode = false;
    this.setShowTutorial(false);
    this.updateScale(1);
    if (this.model) {
      this.model.position = new BABYLON.Vector3(0, 0, 0);
      this.model?.setEnabled(true);
      this.model.rotationQuaternion?.set(0, 1, 0, 0);
    }

    if (this.scene && this.placementIndicatorObserver) {
      this.scene.onBeforeRenderObservable.remove(
        this.placementIndicatorObserver,
      );
    }
  }

  public reset2D = () => {
    if (this.model && this.scene && this.activeCamera) {
      this.model.setEnabled(true);
      this.model.position = this.activeCamera.position.add(
        this.activeCamera.getForwardRay().direction.scale(this.targetScale * 4),
      );
      this.model.position = BABYLON.Vector3.Zero();
      this.model.scalingDeterminant = 1;
      this.activeCamera.setTarget(this.model);
    }
  };

  createPlacementIndicator() {
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
  }

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

      this.getData().then(data => {
        if (data) {
          this.setShowTutorial(false);
        } else {
          this.setCurrentTutorialStep(1);
        }
      });

      let indicatorIsHidden: boolean = false;

      if (this.scene) {
        this.placementIndicatorObserver =
          this.scene.onBeforeRenderObservable.add(() => {
            if (this.placementIndicator && this.model) {
              const position = this.placementIndicator.position;
              const threshold = 0.2;
              if (
                this.isDeviated(position.x, this.model.position.x, threshold) ||
                this.isDeviated(position.y, this.model.position.y, threshold) ||
                this.isDeviated(position.z, this.model.position.z, threshold)
              ) {
                if (indicatorIsHidden) {
                  indicatorIsHidden = false;
                  this.placementIndicator.setEnabled(true);
                }
              } else {
                if (!indicatorIsHidden) {
                  indicatorIsHidden = true;
                  this.placementIndicator.setEnabled(false);
                }
              }
            }
          })!;
      }
    }
  };

  private isDeviated(
    positionValue: number,
    currentPositionValue: number,
    threshold: number,
  ): boolean {
    return Math.abs(positionValue - currentPositionValue) > threshold;
  }

  createInputHandling = () => {
    if (this.modelPlaced) {
      this.changeModelPosition();
    } else {
      this.placeModel();
    }
  };

  animateModel() {
    if (this.isAnimationPlaying) {
      this.setShowTutorial(false);
      this.storeData(true);
    } else {
      this.setCurrentTutorialStep(2);
    }
    this.animate(!this.xrSession);
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

export const product3DModel = new Product3DModel();
