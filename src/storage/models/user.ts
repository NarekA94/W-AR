import {StorageKeys} from '../entities';
import {MMKVStorage} from '../mmkv';

export enum UserCachedRegisterStep {
  PHONE_NUMBER = 'phone_number',
}

export class UserModel {
  setUserCachedRegisterStep = (step: UserCachedRegisterStep) => {
    MMKVStorage.setString(StorageKeys.USER_CACHED_STATE, step);
  };

  removeUserCachedRegisterStep = () => {
    MMKVStorage.removeItem(StorageKeys.USER_CACHED_STATE);
  };

  getUserCachedRegisterStep = () => {
    return MMKVStorage.getString(StorageKeys.USER_CACHED_STATE) as
      | UserCachedRegisterStep
      | null
      | undefined;
  };

  clearUserModel = () => {
    this.removeUserCachedRegisterStep();
  };

  setUserRegionId = (regionId: number) => {
    MMKVStorage.setInt(StorageKeys.USER_REGION, regionId);
  };

  getUserRegionId = () => {
    return MMKVStorage.getInt(StorageKeys.USER_REGION);
  };

  removeUserRegionId = () => {
    MMKVStorage.removeItem(StorageKeys.USER_REGION);
  };

  setUserNameCacheDate = (userId: number, date: string) => {
    MMKVStorage.setString(
      `${StorageKeys.USER_NAME_CACHE_DATE}_${userId}`,
      date,
    );
  };

  getUserNameCacheDate = (userId: number) => {
    return MMKVStorage.getString(
      `${StorageKeys.USER_NAME_CACHE_DATE}_${userId}`,
    );
  };

  setPhoneVerificationCacheDate = (userId: number, date: string) => {
    MMKVStorage.setString(
      `${StorageKeys.USER_PHONE_NUMBER_CACHE_DATE}_${userId}`,
      date,
    );
  };

  getPhoneVerificationCacheDate = (userId: number) => {
    return MMKVStorage.getString(
      `${StorageKeys.USER_PHONE_NUMBER_CACHE_DATE}_${userId}`,
    );
  };

  removeUserNameCacheDate = () => {
    MMKVStorage.removeItem(StorageKeys.USER_NAME_CACHE_DATE);
  };
}

export const userModel = new UserModel();
