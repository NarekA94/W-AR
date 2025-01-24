import React, {FC, useCallback} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {DocumentCenter} from '~/components';
import {UserStackParamProps, UserStackRoutes} from '~/navigation';
import {useAppDispatch} from '~/store/hooks';
import {
  OrderCollectibleType,
  useSetOrderFromCartMutation,
} from '~/store/query/rewards';
import {v2CartApi} from '~/store/query/v2-cart';
import {GLOBAL_STYLES} from '~/theme';
import {logger} from '~/utils';

export const DocumentCenterForCartScreen: FC<
  UserStackParamProps<UserStackRoutes.DocumentCenterForCart>
> = ({route, navigation}) => {
  const {params} = route;
  const [setOrderFromCart] = useSetOrderFromCartMutation();
  const dispatch = useAppDispatch();

  const onSaveFilesSuccess = useCallback(async () => {
    try {
      let res = null;
      if (
        params.addressType === OrderCollectibleType.PICK_UP &&
        params.dispensaryId
      ) {
        res = await setOrderFromCart({
          dispensary: params.dispensaryId,
          tab: params.tab,
          type: OrderCollectibleType.PICK_UP,
        }).unwrap();
      } else {
        res = await setOrderFromCart({
          street: params.address?.street,
          houseNumber: params.address?.houseNumber,
          city: params.address?.city,
          zipCode: params.address?.zipCode!,
          tab: params.tab,
          type: OrderCollectibleType.DELIVERY,
          addressLine1: params.address?.addressLine1,
          addressId: params.address?.addressId,
        }).unwrap();
      }
      dispatch(
        v2CartApi.endpoints.getCart.initiate(undefined, {forceRefetch: true}),
      );
      dispatch(
        v2CartApi.endpoints.getCartCount.initiate(undefined, {
          forceRefetch: true,
        }),
      );
      navigation.reset({
        index: 0,
        routes: [
          {name: UserStackRoutes.TabNavigator},
          {
            name: UserStackRoutes.CartOrderSuccess,
            params: {
              title: res.title,
              info: res.text,
            },
          },
        ],
      });
    } catch (error) {
      logger.warn(error);
    }
  }, [dispatch, navigation, params, setOrderFromCart]);

  return (
    <SafeAreaView style={GLOBAL_STYLES.flex_1}>
      <DocumentCenter onSaveFilesSuccess={onSaveFilesSuccess} />
    </SafeAreaView>
  );
};
