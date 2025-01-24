import {useEffect, useMemo, useRef, useState} from 'react';
import {
  request,
  check,
  RESULTS,
  PermissionStatus,
  PERMISSIONS,
} from 'react-native-permissions';
import {logger} from '~/utils';
import Geolocation from '@react-native-community/geolocation';
import Geocoder from 'react-native-geocoding';
import {Platform, AppState, Alert, Linking} from 'react-native';
import config from '~/config/services';
import {zipCodeModel} from '~/storage';

Geolocation.setRNConfiguration({skipPermissionRequests: true});
Geocoder.init(config.Google_Places_Key);

const LocationPermission = Platform.select({
  ios: PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
  android: PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
});

const UserLocationRadius = 500; // 500 meters

const distanceBetweenCoordinates = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
) => {
  const R = 6371000; // radius of the earth in meters
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c;
  return d;
};

export const useGetUserZipCode = (showPermissionAlert?: boolean) => {
  const [userZipCode, setUserZipCode] = useState<string>('');
  const [permissionResult, setPermissionResult] = useState<PermissionStatus>();
  const appState = useRef(AppState.currentState);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        if (LocationPermission) {
          check(LocationPermission)
            .then(result => {
              setPermissionResult(result);

              if (result === RESULTS.GRANTED) {
                getZipCode();
              }
            })
            .catch(e => logger.warn(e));
        }
      }
      appState.current = nextAppState;
    });

    return () => {
      subscription.remove();
    };
  }, []);

  const handlePressNotRightNow = () => {
    zipCodeModel.setShowPermisionAlert(false);
  };

  useEffect(() => {
    if (LocationPermission) {
      request(LocationPermission)
        .then(result => {
          setPermissionResult(result);
          if (result === RESULTS.GRANTED) {
            getZipCode();
          } else {
            const showAlert = zipCodeModel.getShowPermisionAlert();
            if (showAlert === false) {
              return;
            }
            if (showPermissionAlert) {
              Alert.alert(
                'Location services are off',
                'To use your current location, please enable location services in Settings.',
                [
                  {
                    text: 'Not right now',
                    onPress: handlePressNotRightNow,
                  },
                  {text: 'Go to Settings', onPress: Linking.openSettings},
                ],
                {
                  cancelable: true,
                },
              );
            }
          }
        })
        .catch(error => {
          logger.warn(error);
        });
    }
  }, []);

  const getZipCode = () => {
    Geolocation.getCurrentPosition(
      async success => {
        const userCachedLocation = zipCodeModel.getUserCachedLocation();
        const userCachedZipCode = zipCodeModel.getUserCachedZip();
        if (userCachedLocation !== null) {
          const distance = distanceBetweenCoordinates(
            userCachedLocation.latitude,
            userCachedLocation.longitude,
            success.coords.latitude,
            success.coords.longitude,
          );
          if (distance < UserLocationRadius) {
            if (userCachedZipCode) {
              setUserZipCode(userCachedZipCode);
            }
            return;
          }
        }
        Geocoder.from({
          latitude: success.coords.latitude,
          longitude: success.coords.longitude,
        })
          .then(res => {
            const addressComponent = res.results[0].address_components.find(
              component => component.types.includes('postal_code'),
            );
            if (addressComponent) {
              setUserZipCode(addressComponent.long_name);
              zipCodeModel.setUserCachedZip(addressComponent.long_name);
              zipCodeModel.setUserCachedLocation({
                latitude: success.coords.latitude,
                longitude: success.coords.longitude,
              });
            } else {
              logger.warn('No zip code found');
            }
          })
          .catch(error => {
            logger.warn(error);
          });
      },
      error => {
        logger.warn(error);
      },
    );
  };

  return useMemo(
    () => ({
      userZipCode,
      permissionResult,
    }),
    [userZipCode, permissionResult],
  );
};
