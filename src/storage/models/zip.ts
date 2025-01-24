import {StorageKeys} from '../entities';
import {MMKVStorage} from '../mmkv';

interface Location {
  latitude: number;
  longitude: number;
}
export class ZipCodeModel {
  getRecentZipList = () => {
    return MMKVStorage.getMap<string[]>(StorageKeys.RECENT_ZIP_LIST);
  };

  setUserCachedZip = (zip: string) => {
    MMKVStorage.setString(StorageKeys.USER_CACHED_ZIP, zip);
  };

  getUserCachedZip = () => {
    return MMKVStorage.getString(StorageKeys.USER_CACHED_ZIP);
  };

  setUserCachedLocation = (location: Location) => {
    MMKVStorage.setMap(StorageKeys.USER_CACHED_LOCATION, location);
  };

  getUserCachedLocation = () => {
    return MMKVStorage.getMap<Location>(StorageKeys.USER_CACHED_LOCATION);
  };

  setUserSelectedZipCode = (zip: number) => {
    MMKVStorage.setInt(StorageKeys.USER_SELECTED_ZIP_CODE, zip);
  };

  getUserSelectedZipCode = () => {
    return MMKVStorage.getString(StorageKeys.USER_SELECTED_ZIP_CODE);
  };

  removeUserSelectedZipCode = () => {
    MMKVStorage.removeItem(StorageKeys.USER_SELECTED_ZIP_CODE);
  };
  setShowPermisionAlert = (value: boolean) => {
    MMKVStorage.setBool(StorageKeys.SHOW_PERMISSION_ALERT, value);
  };
  getShowPermisionAlert = () => {
    return MMKVStorage.getBool(StorageKeys.SHOW_PERMISSION_ALERT);
  };
}

export const zipCodeModel = new ZipCodeModel();
