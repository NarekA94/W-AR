import React, {FC, useCallback, useEffect, useRef} from 'react';
import {RESULTS, request} from 'react-native-permissions';
import {Alert, Linking} from 'react-native';
import {
  DispensariesScreenComponent,
  DispensaryType,
} from '~/components/dispensaries-screen/dispensaries-screen';
import {LocationPermission} from '~/hooks/useCheckLocationPermission';
import {UserStackParamProps, UserStackRoutes} from '~/navigation';
import {logger} from '~/utils';
import {getUserCurrentLocation} from '~/utils/locations';
import {
  useLazyGetDispensaryWithDistanceQuery,
  brandApi,
} from '~/store/query/brand';
import {OrderCollectibleType} from '~/store/query/rewards';
import {useAppDispatch} from '~/store/hooks';
import {GeolocationResponse} from '@react-native-community/geolocation';

export const CartDispensaryScreen: FC<
  UserStackParamProps<UserStackRoutes.CartDispensary>
> = ({route, navigation}) => {
  const {brandId, tab} = route.params;
  let userLocationCachedData = useRef<GeolocationResponse | null>(null);
  const [getDispensaryWithDistance, {data: dispensaries, isLoading}] =
    useLazyGetDispensaryWithDistanceQuery();
  const dispatch = useAppDispatch();

  const fetchDispensaries = useCallback(async () => {
    try {
      const locationPermision = await request(LocationPermission!);
      if (locationPermision === RESULTS.GRANTED) {
        const userCurrentLocation = await getUserCurrentLocation();
        getDispensaryWithDistance({
          brandId: brandId,
          latitudeCoordinate: userCurrentLocation?.coords?.latitude || 0,
          longitudeCoordinate: userCurrentLocation?.coords?.longitude || 0,
          tab,
        });
        userLocationCachedData.current = userCurrentLocation;
      } else {
        getDispensaryWithDistance({
          brandId: brandId,
          tab: tab,
        });
      }
      if (locationPermision === RESULTS.BLOCKED) {
        Alert.alert(
          'Location services are off',
          'To use your current location, please enable location services in Settings.',
          [
            {
              text: 'Not right now',
            },
            {text: 'Go to Settings', onPress: Linking.openSettings},
          ],
          {
            cancelable: true,
          },
        );
      }
    } catch (error) {
      logger.warn(error);
    }
  }, [brandId, getDispensaryWithDistance, tab]);

  useEffect(() => {
    fetchDispensaries();
  }, [fetchDispensaries]);

  const handlePressDispensaryItem = useCallback(
    (id: number) => {
      navigation.navigate(UserStackRoutes.CartOrderConfirmation, {
        brandId,
        dispensaryId: id,
        addressType: OrderCollectibleType.PICK_UP,
        tab: tab,
      });
    },
    [navigation, brandId, tab],
  );

  const handleLikeSuccess = useCallback(
    async (dispensaryId: number, isFavorite: boolean) => {
      try {
        dispatch(
          brandApi.util.updateQueryData(
            'getDispensaryWithDistance',
            {
              brandId: brandId,
              latitudeCoordinate:
                userLocationCachedData?.current?.coords?.latitude || 0,
              longitudeCoordinate:
                userLocationCachedData?.current?.coords?.longitude || 0,
            },
            () => {
              return dispensaries?.map(dispensary => {
                if (dispensary.id === dispensaryId) {
                  return {
                    ...dispensary,
                    isFavourite: isFavorite,
                  };
                }
                return dispensary;
              });
            },
          ),
        );
      } catch (error) {
        logger.warn(error);
      }
    },
    [brandId, dispatch, dispensaries],
  );

  return (
    <DispensariesScreenComponent
      onPressDispensaryItem={handlePressDispensaryItem}
      isLoading={isLoading}
      dispensaries={dispensaries}
      type={DispensaryType.BRAND}
      refetchDispensaries={fetchDispensaries}
      onLikeSuccess={handleLikeSuccess}
    />
  );
};
