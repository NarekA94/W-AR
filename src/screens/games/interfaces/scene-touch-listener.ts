export interface ISceneTouchListener {
  onScrollHorizontal(offsetX: number): void;
  onScrollVertical(offsetY: number): void;
  onStartDrag(): void;
  onEndDrag(): void;
  onPinchStart(): void;
  onPinch(scale: number): void;
  onPinchEnd(): void;
}
