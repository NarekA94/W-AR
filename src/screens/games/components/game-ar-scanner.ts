import {
  WebXRFeatureName,
  WebXRImageTracking,
  IWebXRTrackedImage,
  WebXRDefaultExperience,
} from '@babylonjs/core';
import '@babylonjs/loaders/glTF';
import {IScannerListener} from '../interfaces/i-scanner-listener';
import {IArScanner} from '../interfaces/i-ar-scanner';
import {ScannerMarker} from '../data/scanner-marker';

export class ArGameScanner implements IArScanner {
  xr?: WebXRDefaultExperience;
  markers?: ScannerMarker[];

  constructor() {}

  setMarkers(markers: ScannerMarker[]): void {
    this.markers = markers;
  }

  disableScanner(): void {
    if (this.xr) {
      this.xr.baseExperience.featuresManager.detachFeature(
        WebXRFeatureName.IMAGE_TRACKING,
      );
    }
  }
  enableScanner(): void {
    if (this.xr) {
      this.xr.baseExperience.featuresManager.attachFeature(
        WebXRFeatureName.IMAGE_TRACKING,
      );
    }
  }
  init(
    xr: WebXRDefaultExperience,
    markersData: ScannerMarker[],
    listener: IScannerListener,
  ) {
    this.xr = xr;
    this.markers = markersData;
    let markers = markersData?.map(marker => {
      return {src: marker.markerUri, estimatedRealWorldWidth: marker.realSize};
    });

    const webXRImageTrackingModule =
      xr.baseExperience.featuresManager.enableFeature(
        WebXRFeatureName.IMAGE_TRACKING,
        'latest',
        {
          images: markers,
        },
      ) as WebXRImageTracking;
    webXRImageTrackingModule.onTrackableImageFoundObservable.add(() => {
      //console.log('IMAGE TRACKABLE ' + event.id);
    });
    webXRImageTrackingModule.onUntrackableImageFoundObservable.add(() => {
      //console.log('IMAGE UNTRACKABLE ' + event);
    });

    webXRImageTrackingModule.onTrackedImageUpdatedObservable.add(
      (imageObject: IWebXRTrackedImage) => {
        //imageObject.transformationMatrix.decompose(root.scaling, root.rotationQuaternion!!, root.position);
        let index = imageObject.xrTrackingResult?.index;
        if (
          imageObject.xrTrackingResult?.trackingState === 'tracked' &&
          this.markers!![index!!].isCurrentTarget
        ) {
          // console.log('tracked marker', this.markers!![index!!]);

          this.markers!![index!!].isCurrentTarget = false;
          if (index!! + 1 < this.markers!!.length!!) {
            this.markers!![index!! + 1].isCurrentTarget = true;
          }

          listener?.onMarkerFound(this.markers!![index!!]);
        }
      },
    );
    xr.baseExperience.camera.onTrackingStateChanged.add(() => {
      //console.log('onTrackingStateChanged', newTrackingState);
    });
  }
}

export const arGameScanner = new ArGameScanner();
