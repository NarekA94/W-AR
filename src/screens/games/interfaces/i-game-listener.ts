import {GameStep} from '~/store/query/games';
import {GameMode} from '../data/game-mode';

export interface IGameListener {
  onGameModeChanged(gameMode: GameMode): void;
  onQuizAnswered(answer: boolean, correct: boolean): void;
  onNewStep(step: GameStep): void;
  onGameFinished(): void;
}
