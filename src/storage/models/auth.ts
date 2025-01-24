import {StorageKeys} from '../entities';
import {MMKVStorage} from '../mmkv';

export class AuthModel {
  setAccessToken = (token: string) => {
    MMKVStorage.setString(StorageKeys.ACCESS_TOKEN, token);
  };

  removeAccessToken = () => {
    MMKVStorage.removeItem(StorageKeys.ACCESS_TOKEN);
  };

  getAccessToken = () => {
    return MMKVStorage.getString(StorageKeys.ACCESS_TOKEN);
  };

  setRefreshToken = (token: string) => {
    MMKVStorage.setString(StorageKeys.REFRESH_TOKEN, token);
  };

  removeRefreshToken = () => {
    MMKVStorage.removeItem(StorageKeys.REFRESH_TOKEN);
  };

  getRefreshToken = () => {
    return MMKVStorage.getString(StorageKeys.REFRESH_TOKEN);
  };

  setFcmToken = (fcm: string) => {
    MMKVStorage.setString(StorageKeys.FCM_TOKEN, fcm);
  };

  getFcmToken = () => {
    return MMKVStorage.getString(StorageKeys.FCM_TOKEN);
  };

  removeFcmToken = () => {
    MMKVStorage.removeItem(StorageKeys.FCM_TOKEN);
  };

  setFcmSuccessfullySaved = (value: boolean) => {
    MMKVStorage.setBool(StorageKeys.FcmSuccessFullySaved, value);
  };

  getFcmSuccessfullySaved = () => {
    return MMKVStorage.getBool(StorageKeys.FcmSuccessFullySaved);
  };

  removeFcmSuccessfullySaved = () => {
    MMKVStorage.removeItem(StorageKeys.FcmSuccessFullySaved);
  };
}

export const authModel = new AuthModel();
