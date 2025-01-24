import React, {FC, useCallback} from 'react';
import {useIntl} from 'react-intl';
import {StyleSheet, View} from 'react-native';
import {AppText, Button, OR, ScreenWrapper} from '~/components';
import {GLOBAL_STYLES, TextColors, TextVariant} from '~/theme';
import {DispensaryButton} from './components/dispensary-button';
import {
  ShippingVariant,
  UserStackParamProps,
  UserStackRoutes,
} from '~/navigation';
import {AddressField} from './components/address-field';
import {OrderCollectibleType} from '~/store/query/rewards';

const titleGradientLocations = [0.05, 0.3, 0.8];

export const CollectiblesShippingMethodScreen: FC<
  UserStackParamProps<UserStackRoutes.CollectiblesShippingMethod>
> = ({route, navigation}) => {
  const {params} = route;
  const intl = useIntl();

  const handlePressContinue = useCallback(() => {
    if (params.type === 'collectible') {
      navigation.navigate(UserStackRoutes.CollectibleOrderConfirmation, {
        addressType: OrderCollectibleType.DELIVERY,
        dropId: params.dropId,
        productId: params.productId,
        address: params.address,
      });
      return;
    }
    if (params.type === 'cart') {
      navigation.navigate(UserStackRoutes.CartOrderConfirmation, {
        brandId: params.brandId,
        addressType: OrderCollectibleType.DELIVERY,
        tab: params.tab,
        address: params.address,
      });
    }
  }, [params, navigation]);

  const handlePressAddress = useCallback(() => {
    navigation.navigate(UserStackRoutes.ShippingAddress, params);
  }, [params, navigation]);

  return (
    <ScreenWrapper
      withHeader
      horizontalPadding={0}
      withBottomInset
      headerProps={{paddingHorizontal: 20}}
      withStatusBar>
      <View style={GLOBAL_STYLES.horizontal_20}>
        <AppText
          locations={titleGradientLocations}
          variant={TextVariant.H_5}
          style={styles.title}>
          {intl.formatMessage({
            id: 'screens.shippingMethod.title',
            defaultMessage: 'Shipping method',
          })}
        </AppText>
        <AppText
          style={styles.info}
          variant={TextVariant.S_R}
          color={TextColors.G090}>
          Choose the most convenient method to get your order
        </AppText>
        {(params.variant === ShippingVariant.Address ||
          params.variant === ShippingVariant.Both) && (
          <AddressField
            address={params.address?.addressLine1}
            onPress={handlePressAddress}
          />
        )}
      </View>
      {params.variant === ShippingVariant.Both && (
        <OR containerStyle={styles.or} />
      )}
      <View style={[GLOBAL_STYLES.horizontal_20, GLOBAL_STYLES.flex_1]}>
        {(params.variant === ShippingVariant.Dispensary ||
          params.variant === ShippingVariant.Both) && (
          <>
            <AppText
              locations={titleGradientLocations}
              variant={TextVariant.H5_M}>
              {intl.formatMessage({
                id: 'screens.shippingMethod.choose',
                defaultMessage: 'Choose pickup at dispensary',
              })}
            </AppText>
            <DispensaryButton routeParams={params} />
          </>
        )}

        <View style={GLOBAL_STYLES.flex_1} />
        <Button
          disabled={!params.address}
          onPress={handlePressContinue}
          containerStyle={styles.button}
          withImageBackground
          title={intl.formatMessage({
            id: 'screens.shippingMethod.button',
            defaultMessage: 'Continue to Checkout',
          })}
        />
      </View>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 26,
    marginBottom: vp(11),
  },
  or: {
    marginTop: vp(46),
    marginBottom: vp(41),
  },
  button: {
    marginBottom: vp(32),
  },
  info: {
    marginBottom: vp(34),
  },
});
