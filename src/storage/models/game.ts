import {StorageKeys} from '../entities';
import {MMKVStorage} from '../mmkv';

export class GameModel {
  setGameToken = (token: string) => {
    MMKVStorage.setString(StorageKeys.GAME_TOKEN, token);
  };

  getGameToken = () => {
    return MMKVStorage.getString(StorageKeys.GAME_TOKEN);
  };

  removeGameToken = () => {
    MMKVStorage.removeItem(StorageKeys.GAME_TOKEN);
  };
}

export const gameModel = new GameModel();
