export class ScannerMarker {
  id: number;
  markerUri: string;
  realSize: number;
  isCurrentTarget: boolean;

  constructor(
    id: number,
    markerUri: string,
    isCurrentTarget: boolean,
    realSize: number = 0.2,
  ) {
    this.id = id;
    this.markerUri = markerUri;
    this.realSize = realSize;
    this.isCurrentTarget = isCurrentTarget;
  }
}
