import {useEffect, useMemo, useState} from 'react';
import {
  request,
  RESULTS,
  PERMISSIONS,
  PermissionStatus,
} from 'react-native-permissions';
import {logger} from '~/utils';
import Geolocation, {
  GeolocationResponse,
} from '@react-native-community/geolocation';
import {Alert, Platform, Linking} from 'react-native';

Geolocation.setRNConfiguration({skipPermissionRequests: true});

const LocationPermission = Platform.select({
  ios: PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
  android: PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
});

export const useGetUserLocation = () => {
  const [permissionResult, setPermissionResult] = useState<PermissionStatus>();
  const [userLocation, setUserLocation] = useState<GeolocationResponse>();
  useEffect(() => {
    (() => {
      if (LocationPermission) {
        request(LocationPermission)
          .then(result => {
            setPermissionResult(result);
            if (result === RESULTS.GRANTED) {
              Geolocation.getCurrentPosition(
                async success => {
                  setUserLocation(success);
                },
                error => {
                  logger.warn(error);
                },
              );
            } else {
              Alert.alert(
                'Location services are off',
                'To use your current location, please enable location services in Settings.',
                [
                  {text: 'Not right now'},
                  {text: 'Go to Settings', onPress: Linking.openSettings},
                ],
                {
                  cancelable: true,
                },
              );
            }
          })
          .catch(error => {
            logger.warn(error);
          });
      }
    })();
  }, []);

  return useMemo(
    () => ({
      permissionResult,
      userLocation,
    }),
    [permissionResult, userLocation],
  );
};
