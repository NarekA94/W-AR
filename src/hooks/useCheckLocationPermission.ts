import {useEffect, useState} from 'react';
import {request, PermissionStatus, PERMISSIONS} from 'react-native-permissions';
import {Platform} from 'react-native';
import {logger} from '~/utils';
export const LocationPermission = Platform.select({
  ios: PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
  android: PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
});

export const useCheckLocationPermission = () => {
  const [permissionResult, setPermissionResult] = useState<PermissionStatus>();

  useEffect(() => {
    if (LocationPermission) {
      request(LocationPermission)
        .then(result => {
          setPermissionResult(result);
        })
        .catch(e => logger.warn(e));
    }
  }, []);
  return {permissionResult};
};
