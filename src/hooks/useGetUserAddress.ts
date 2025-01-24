import {useCallback, useMemo, useState} from 'react';
import {
  request,
  RESULTS,
  PERMISSIONS,
  PermissionStatus,
} from 'react-native-permissions';
import {logger} from '~/utils';
import Geolocation from '@react-native-community/geolocation';
import Geocoder from 'react-native-geocoding';
import {Alert, Platform, Linking} from 'react-native';
import config from '~/config/services';
import {AddressComponent} from '~/components/autocomplete/types';

Geolocation.setRNConfiguration({skipPermissionRequests: true});
Geocoder.init(config.Google_Places_Key);

const LocationPermission = Platform.select({
  ios: PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
  android: PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
});

export interface UserAddress {
  zipCode?: Nullable<string>;
  addressLine1: string;
  city: string;
  street: string;
  houseNumber: string;
  latitudeCoordinate: number;
  longitudeCoordinate: number;
  state?: string;
  country?: string;
  addressId?: number;
}

export const getAddressComponent = (
  address_components: AddressComponent[],
  key: string,
): AddressComponent | undefined => {
  return address_components.find(item => item.types.includes(key));
};

export const useGetUserAddress = () => {
  const [permissionResult, setPermissionResult] = useState<PermissionStatus>();

  const getAddress = useCallback(async (): Promise<UserAddress> => {
    return new Promise((resolve, reject) => {
      if (LocationPermission) {
        request(LocationPermission)
          .then(result => {
            setPermissionResult(result);
            // testing USA location  36.74978306781308, -119.76837297135167
            if (result === RESULTS.GRANTED) {
              Geolocation.getCurrentPosition(
                async success => {
                  Geocoder.from({
                    latitude: success.coords.latitude,
                    longitude: success.coords.longitude,
                  })
                    .then(res => {
                      const zipAddress = res.results[0].address_components.find(
                        component => component.types.includes('postal_code'),
                      );
                      const address = res.results[0];
                      const city = address?.address_components.find(item =>
                        item.types.includes('locality'),
                      );
                      resolve({
                        street:
                          getAddressComponent(
                            address.address_components,
                            'route',
                          )?.long_name || '',
                        houseNumber:
                          getAddressComponent(
                            address.address_components,
                            'street_number',
                          )?.long_name || '',
                        addressLine1:
                          address?.formatted_address ||
                          res.results[0].formatted_address,
                        zipCode: zipAddress?.long_name,
                        city: city?.long_name || '',
                        latitudeCoordinate: address?.geometry.location.lat || 0,
                        longitudeCoordinate:
                          address?.geometry.location.lng || 0,
                        state: getAddressComponent(
                          address.address_components,
                          'administrative_area_level_1',
                        )?.long_name,
                        country: getAddressComponent(
                          address.address_components,
                          'country',
                        )?.short_name,
                      });
                    })
                    .catch(error => {
                      logger.warn(error);
                      reject(error);
                    });
                },
                error => {
                  logger.warn(error);
                  reject(error);
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
              reject(result);
            }
          })
          .catch(error => {
            reject(error);
            logger.warn(error);
          });
      }
    });
  }, []);

  return useMemo(
    () => ({
      getAddress,
      permissionResult,
    }),
    [getAddress, permissionResult],
  );
};
