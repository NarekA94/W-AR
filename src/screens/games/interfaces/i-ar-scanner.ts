import {WebXRDefaultExperience} from '@babylonjs/core';
import {IScannerListener} from './i-scanner-listener';
import {ScannerMarker} from '../data/scanner-marker';
export interface IArScanner {
  init(
    xr: WebXRDefaultExperience,
    markers: ScannerMarker[],
    listener?: IScannerListener,
  ): void;

  disableScanner(): void;
  enableScanner(): void;
  setMarkers(markers: ScannerMarker[]): void;
}
