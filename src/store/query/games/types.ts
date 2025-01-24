import {File} from '~/store/types';
import {Brand} from '~/store/query/brand';

export interface ArStickerGame {
  id: string;
  name: string;
  gamePassed: boolean;
  currentStep: number;
  points: number;
  steps: Nullable<GameStep[]>;
  type: number;
  startScreen: GameScreen;
  finishScreen: GameScreen;
  alreadyPlayedScreen: GameScreen;
  status: number;
  background: File;
  image: File;
  description: string;
  brandPointsText: string;
  scanScreenText: string;
  title: string;
  brand: Brand;
  description_started: string;
  description_paused: string;
  description_completed: string;
  canReplay: boolean;
  gamePassedAndReplay: boolean;
}
export interface GameScreen {
  id: string;
  title: string;
  buttonText: string;
  image: File;
  background: File;
  description: string;
  playAgainText: string;
}

export interface GameStep {
  passed: boolean;
  answeredCorrect: boolean;
  rightAnswer: number;
  description: string;
  order: number;
  image: File;
  frontSide: File;
  backSide: File;
  rightAnswerTexture: File;
  triggerName: string;
  shape: number;
  leftButtonText: string;
  rightButtonText: string;
  hintText: string;
}
