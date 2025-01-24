import {StorageKeys} from '../entities';
import {MMKVStorage} from '../mmkv';

export class AuthenticModel {
  setAuthenticTokenAndStatus = (token: string, redeemed: boolean = false) => {
    MMKVStorage.setString(StorageKeys.AUTHENTIC_TOKEN, token);
    MMKVStorage.setBool(StorageKeys.AUTHENTIC_TOKEN_REDEEMED, redeemed);
  };

  getAuthenticToken = () => {
    return MMKVStorage.getString(StorageKeys.AUTHENTIC_TOKEN);
  };
  getIsAuthenticTokenRedeemed = () => {
    return MMKVStorage.getBool(StorageKeys.AUTHENTIC_TOKEN_REDEEMED);
  };

  removeAuthenticTokenAndStatus = () => {
    MMKVStorage.removeItem(StorageKeys.AUTHENTIC_TOKEN);
    MMKVStorage.removeItem(StorageKeys.AUTHENTIC_TOKEN_REDEEMED);
  };
}

export const authenticModel = new AuthenticModel();
