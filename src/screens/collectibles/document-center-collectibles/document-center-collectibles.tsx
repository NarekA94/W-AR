import React, {FC, useCallback} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {DocumentCenter} from '~/components';
import {UserStackParamProps, UserStackRoutes} from '~/navigation';
import {
  OrderCollectibleType,
  useSetCollectibleRewardMutation,
} from '~/store/query/rewards';
import {GLOBAL_STYLES} from '~/theme';
import {logger} from '~/utils';

export const DocumentCenterForCollectiblesScreen: FC<
  UserStackParamProps<UserStackRoutes.DocumentCenterForCollectibles>
> = ({route, navigation}) => {
  const {productId, dispensaryId, addressType, address} = route.params;
  const [setCollectibleRewards] = useSetCollectibleRewardMutation();

  const onSaveFilesSuccess = useCallback(async () => {
    try {
      if (addressType === OrderCollectibleType.DELIVERY && address?.zipCode) {
        await setCollectibleRewards({
          productId: productId,
          type: addressType,
          street: address?.street,
          houseNumber: address?.houseNumber,
          city: address?.city,
          zipCode: address?.zipCode,
          addressLine1: address.addressLine1,
          addressId: address.addressId,
        });
      }
      if (addressType === OrderCollectibleType.PICK_UP) {
        await setCollectibleRewards({
          productId: productId,
          dispensary: dispensaryId,
          type: addressType,
        });
      }
      navigation.reset({
        index: 0,
        routes: [
          {name: UserStackRoutes.TabNavigator},
          {
            name: UserStackRoutes.RewardSuccess,
            params: {
              isThirdParty: true,
              infoI18nKey:
                addressType === OrderCollectibleType.PICK_UP
                  ? 'screens.shippingMethod.success.dispensaryInfo'
                  : 'screens.shippingMethod.success.info',
            },
          },
        ],
      });
    } catch (error) {
      logger.warn(error);
    }
  }, [
    dispensaryId,
    productId,
    navigation,
    setCollectibleRewards,
    address,
    addressType,
  ]);

  return (
    <SafeAreaView style={GLOBAL_STYLES.flex_1}>
      <DocumentCenter onSaveFilesSuccess={onSaveFilesSuccess} />
    </SafeAreaView>
  );
};
