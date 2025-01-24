import {ScannerMarker} from '../data/scanner-marker';

export interface IScannerListener {
  onMarkerFound(marker: ScannerMarker): void;
}
