import React, {FC, useCallback} from 'react';
import {StyleSheet, View} from 'react-native';
import {
  AppText,
  Button,
  CartProductItem,
  HR,
  ScreenWrapper,
} from '~/components';
import {ButtonVariant, GLOBAL_STYLES, TextColors, TextVariant} from '~/theme';
import {AddressDelivery} from './components/address-delivery';
import {DispensaryDelivery} from './components/dispensary-delivery';
import {useIntl} from 'react-intl';
import {UserStackParamProps, UserStackRoutes} from '~/navigation';
import {useGetNftDropQuery} from '~/store/query/nft-drop';
import {
  OrderCollectibleType,
  useSetCollectibleRewardMutation,
} from '~/store/query/rewards';
import {logger} from '~/utils';
import {useGetAuthUser} from '~/hooks/useGetAuthUser';

const titleGradientLocations = [0.05, 0.3, 0.8];

export const OrderConfirmationScreen: FC<
  UserStackParamProps<UserStackRoutes.CollectibleOrderConfirmation>
> = ({navigation, route}) => {
  const {addressType, dropId, dispensaryId, productId, address} = route.params;
  const {authUser} = useGetAuthUser();
  const [setCollectibleRewards, {isLoading}] =
    useSetCollectibleRewardMutation();
  const {data: drop} = useGetNftDropQuery({id: dropId});

  const intl = useIntl();

  const handlePressBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const handlePressConfirm = useCallback(async () => {
    if (!authUser?.name || !authUser.passportPhotoLink) {
      navigation.navigate(UserStackRoutes.DocumentCenterForCollectibles, {
        productId,
        dispensaryId,
        address,
        addressType,
      });
      return;
    }

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
    productId,
    dispensaryId,
    setCollectibleRewards,
    addressType,
    address,
    navigation,
    authUser,
  ]);
  return (
    <ScreenWrapper
      withHeader
      horizontalPadding={20}
      withBottomInset
      withStatusBar>
      <AppText
        locations={titleGradientLocations}
        withGradient
        variant={TextVariant.H_5}
        style={styles.title}>
        Order confirmation
      </AppText>
      <AppText
        style={styles.info}
        variant={TextVariant.S_R}
        color={TextColors.G090}>
        Only cash is accepted as a payment method
      </AppText>
      <CartProductItem
        name={drop?.product.name}
        imageUri={drop?.nftPreview.url}
        thc={drop?.product.thc}
        gramWeight={drop?.product.gramWeight}
        ounceWeight={drop?.product.ounceWeight}
        quantity={1}
      />
      <HR style={styles.hr} />
      {addressType === OrderCollectibleType.DELIVERY ? (
        <AddressDelivery />
      ) : (
        <DispensaryDelivery dispensaryId={dispensaryId!} />
      )}

      <HR style={styles.hr} />
      <View style={GLOBAL_STYLES.row_between}>
        <AppText variant={TextVariant.S_L} color={TextColors.G090}>
          Total amount
        </AppText>
        <AppText variant={TextVariant.H2_A}>${drop?.product?.price}</AppText>
      </View>
      <View style={GLOBAL_STYLES.flex_1} />

      <View style={[GLOBAL_STYLES.row_between, styles.buttons]}>
        <Button
          width="48%"
          onPress={handlePressBack}
          variant={ButtonVariant.GRAY}
          title={intl.formatMessage({
            id: 'buttons.back',
            defaultMessage: 'Back',
          })}
        />
        <Button
          isLoading={isLoading}
          withImageBackground
          title={intl.formatMessage({
            id: 'buttons.confirm',
            defaultMessage: 'Confirm',
          })}
          width="48%"
          onPress={handlePressConfirm}
        />
      </View>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  info: {
    marginBottom: vp(34),
  },
  title: {
    fontSize: 26,
    marginBottom: vp(11),
  },
  img: {
    width: vp(60),
    height: vp(60),
    marginRight: vp(15),
  },
  hr: {
    width: '100%',
    marginLeft: 0,
    marginVertical: vp(22),
  },
  name: {
    lineHeight: 24,
  },
  buttons: {
    paddingBottom: vp(20),
  },
});
