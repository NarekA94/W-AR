import React, {FC, useCallback, useEffect, useRef} from 'react';
import {RESULTS, request} from 'react-native-permissions';
import {Alert, Linking} from 'react-native';
import {DispensariesScreenComponent} from '~/components/dispensaries-screen/dispensaries-screen';
import {LocationPermission} from '~/hooks/useCheckLocationPermission';
import {UserStackParamProps, UserStackRoutes} from '~/navigation';
import {
  useLazyGetDispensariesWithDistanceQuery,
  nftDropApi,
} from '~/store/query/nft-drop';
import {logger} from '~/utils';
import {getUserCurrentLocation} from '~/utils/locations';
import {OrderCollectibleType} from '~/store/query/rewards';
import {useAppDispatch} from '~/store/hooks';
import {GeolocationResponse} from '@react-native-community/geolocation';

export const CollectibleDispensaryScreen: FC<
  UserStackParamProps<UserStackRoutes.CollectibleDispensary>
> = ({route, navigation}) => {
  const {productId, dropId} = route.params;
  let userLocationCachedData = useRef<GeolocationResponse | null>(null);

  const [getDispensaries, {data, isLoading}] =
    useLazyGetDispensariesWithDistanceQuery();
  const dispatch = useAppDispatch();
  const fetchDispensaries = useCallback(async () => {
    try {
      const locationPermision = await request(LocationPermission!);
      if (locationPermision === RESULTS.GRANTED) {
        const userCurrentLocation = await getUserCurrentLocation();
        getDispensaries({
          productId: productId,
          latitudeCoordinate: userCurrentLocation?.coords?.latitude || 0,
          longitudeCoordinate: userCurrentLocation?.coords?.longitude || 0,
        });
        userLocationCachedData.current = userCurrentLocation;
      } else {
        getDispensaries({
          productId: productId,
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
  }, [getDispensaries, productId]);

  useEffect(() => {
    fetchDispensaries();
  }, [fetchDispensaries]);

  const handlePressDispensaryItem = useCallback(
    (id: number) => {
      navigation.navigate(UserStackRoutes.CollectibleOrderConfirmation, {
        addressType: OrderCollectibleType.PICK_UP,
        dropId: dropId,
        dispensaryId: id,
        productId: productId,
      });
    },
    [dropId, navigation, productId],
  );

  const handleLikeSuccess = useCallback(
    async (dispensaryId: number, isFavorite: boolean) => {
      try {
        dispatch(
          nftDropApi.util.updateQueryData(
            'getDispensariesWithDistance',
            {
              productId: productId,
              latitudeCoordinate:
                userLocationCachedData?.current?.coords?.latitude || 0,
              longitudeCoordinate:
                userLocationCachedData?.current?.coords?.longitude || 0,
            },
            () => {
              return data?.map(dispensary => {
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
    [data, dispatch, productId],
  );

  return (
    <DispensariesScreenComponent
      onPressDispensaryItem={handlePressDispensaryItem}
      isLoading={isLoading}
      dispensaries={data}
      refetchDispensaries={fetchDispensaries}
      onLikeSuccess={handleLikeSuccess}
    />
  );
};
