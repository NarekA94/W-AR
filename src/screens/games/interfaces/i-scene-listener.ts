import {Scene} from '@babylonjs/core';

export interface ISceneListener {
  onSceneFrame(deltaTime: number): void;
  onSceneReady(scene: Scene): void;
}
