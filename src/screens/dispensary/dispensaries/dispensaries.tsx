import React, {FC, useCallback, useEffect, useRef} from 'react';
import {Linking, Alert} from 'react-native';
import {
  brandApi,
  useLazyGetDispensaryWithDistanceQuery,
} from '~/store/query/brand';
import {UserStackParamProps, UserStackRoutes} from '~/navigation';
import {LocationPermission} from '~/hooks/useCheckLocationPermission';
import {getUserCurrentLocation} from '~/utils/locations';
import {RESULTS, request} from 'react-native-permissions';
import {logger} from '~/utils';
import {
  DispensariesScreenComponent,
  DispensaryType,
} from '~/components/dispensaries-screen/dispensaries-screen';
import {useAppDispatch} from '~/store/hooks';
import {GeolocationResponse} from '@react-native-community/geolocation';

export const DispensariesScreen: FC<
  UserStackParamProps<UserStackRoutes.Dispensaries>
> = ({route, navigation}) => {
  const {brandId, productId, hasPoints, screenTitle} = route.params;
  let userLocationCachedData = useRef<GeolocationResponse | null>(null);
  const [getDispensaryWithDistance, {data: dispensaries, isFetching}] =
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
        });
        userLocationCachedData.current = userCurrentLocation;
      } else {
        getDispensaryWithDistance({
          brandId: brandId,
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
  }, [brandId, getDispensaryWithDistance]);

  useEffect(() => {
    fetchDispensaries();
  }, [fetchDispensaries]);

  const handlePressDispensaryItem = useCallback(
    (id: number) => {
      const dispensary = dispensaries?.find(item => item.id === id);

      if (productId && dispensary?.tabInfo) {
        navigation.navigate(UserStackRoutes.Dispensary, {
          id,
          productId,
          tabInfo: dispensary?.tabInfo,
        });
      }
    },
    [dispensaries, productId, navigation],
  );

  const handleLikeSuccess = useCallback(
    async (dispensaryId: number, isFavorite: boolean) => {
      try {
        if (userLocationCachedData) {
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
        }
      } catch (error) {
        logger.warn(error);
      }
    },
    [brandId, dispatch, dispensaries],
  );

  return (
    <DispensariesScreenComponent
      onPressDispensaryItem={handlePressDispensaryItem}
      isLoading={isFetching}
      dispensaries={dispensaries}
      type={DispensaryType.BRAND}
      screenTitle={screenTitle}
      disabled={!hasPoints}
      refetchDispensaries={fetchDispensaries}
      onLikeSuccess={handleLikeSuccess}
    />
  );
};
