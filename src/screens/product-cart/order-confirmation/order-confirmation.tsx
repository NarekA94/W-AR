import React, {FC, useCallback, useEffect} from 'react';
import {FlatList, StyleSheet, View} from 'react-native';
import {
  AppText,
  Button,
  CartProductItem,
  HR,
  RewardTab,
  ScreenWrapper,
} from '~/components';
import {UserStackParamProps, UserStackRoutes} from '~/navigation';
import {
  CartOrderInfoItem,
  OrderCollectibleType,
  useLazyCartOrderInfoQuery,
  useSetOrderFromCartMutation,
} from '~/store/query/rewards';
import {
  ButtonVariant,
  FontWeight,
  GLOBAL_STYLES,
  TextColors,
  TextVariant,
} from '~/theme';
import LocationIcon from '~/assets/images/zip/location.svg';
import AlarmIcon from '~/assets/images/alarm.svg';
import {useIntl} from 'react-intl';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useGetAuthUser} from '~/hooks/useGetAuthUser';
import {v2CartApi} from '~/store/query/v2-cart';
import {useAppDispatch} from '~/store/hooks';
import {WIDTH} from '~/constants/layout';
import {QueryStatus} from '@reduxjs/toolkit/dist/query';
const pageHorizontalInset = vp(60);

export const CartOrderConfirmationScreen: FC<
  UserStackParamProps<UserStackRoutes.CartOrderConfirmation>
> = ({route, navigation}) => {
  const {params} = route;
  const {authUser} = useGetAuthUser();
  const [setOrderFromCart, {isLoading, status}] = useSetOrderFromCartMutation();
  const dispatch = useAppDispatch();
  const {bottom} = useSafeAreaInsets();
  const intl = useIntl();
  const [getCartInfo, {data}] = useLazyCartOrderInfoQuery();

  useEffect(() => {
    (() => {
      if (
        params.addressType === OrderCollectibleType.PICK_UP &&
        params.dispensaryId
      ) {
        getCartInfo({
          dispensary: params.dispensaryId,
          tab: params.tab,
          type: OrderCollectibleType.PICK_UP,
        });

        return;
      }
      if (
        params.addressType === OrderCollectibleType.DELIVERY &&
        params.address &&
        params.address.zipCode
      ) {
        getCartInfo({
          street: params.address?.street,
          houseNumber: params.address?.houseNumber,
          city: params.address?.city,
          zipCode: params.address?.zipCode,
          tab: params.tab,
          type: OrderCollectibleType.DELIVERY,
          addressLine1: params.address.addressLine1,
          addressId: params.address.addressId,
        });

        return;
      }
    })();
  }, []);

  const handlePressBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const handlePressConfirm = useCallback(async () => {
    if (!authUser?.name || !authUser.passportPhotoLink) {
      navigation.navigate(UserStackRoutes.DocumentCenterForCart, params);
      return;
    }
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
  }, [
    authUser?.name,
    authUser?.passportPhotoLink,
    dispatch,
    navigation,
    params,
    setOrderFromCart,
  ]);

  const ListHeaderComponent = useCallback(() => {
    return (
      <>
        <AppText variant={TextVariant.H_5} style={styles.title}>
          Order confirmation
        </AppText>
        <AppText
          style={styles.info}
          variant={TextVariant.S_R}
          color={TextColors.G090}>
          Only cash is accepted as a payment method
        </AppText>
      </>
    );
  }, []);

  const renderItem = useCallback(({item}: FlatListItem<CartOrderInfoItem>) => {
    const product = item.product;
    return (
      <CartProductItem
        name={product.name}
        thc={product.thc}
        gramWeight={product.gramWeight}
        ounceWeight={product.ounceWeight}
        imageUri={product.images?.[0]?.file?.url}
        quantity={item.quantity}
      />
    );
  }, []);

  const keyExtractor = (item: CartOrderInfoItem) => item.product.id.toString();

  const ListFooterComponent = useCallback(() => {
    return (
      <View style={[GLOBAL_STYLES.flex_1, {paddingBottom: bottom}]}>
        <HR />
        <AppText
          style={styles.dis_info}
          variant={TextVariant.S_L}
          color={TextColors.G090}>
          {params.addressType === OrderCollectibleType.DELIVERY
            ? 'Delivery details'
            : 'Dispensary information'}
        </AppText>
        {params.addressType === OrderCollectibleType.PICK_UP && (
          <AppText
            style={styles.dispensaryName}
            variant={TextVariant.H4_B}
            fontWeight={FontWeight.W500}
            color={TextColors.A100}>
            {data?.dispensary?.name}
          </AppText>
        )}
        <View style={styles.location}>
          <LocationIcon
            width={vp(24)}
            height={vp(24)}
            style={styles.icon_space}
          />
          <AppText
            style={styles.location_text}
            variant={TextVariant.M_R}
            color={TextColors.A100}>
            {data?.deliveryAddress || data?.dispensary.address}
          </AppText>
        </View>
        <AppText
          style={styles.infoText}
          variant={TextVariant.S_R}
          color={TextColors.G090}>
          {data?.infoText}
        </AppText>
        <RewardTab
          timeTypeText={data?.typeInfo?.timeTypeText}
          typeText={data?.typeInfo?.typeText}
          iconSize={24}
          containerStyles={styles.rewardTab}
          textSize={15}
          textStyles={styles.rewardTabText}
        />
        <View style={styles.location}>
          <AlarmIcon width={vp(24)} height={vp(24)} style={styles.icon_space} />
          <AppText
            style={styles.location_text}
            variant={TextVariant.M_R}
            color={TextColors.A100}>
            {data?.waitingTime}
          </AppText>
        </View>

        <View style={styles.priceBox}>
          <AppText variant={TextVariant.S_L} color={TextColors.G090}>
            {intl.formatMessage({
              id: 'phrases.total_quantity',
              defaultMessage: 'Total quantity',
            })}
          </AppText>
          <AppText size={18} variant={TextVariant.H2_A}>
            {data?.details.reduce((n, {quantity}) => n + quantity, 0)}
          </AppText>
        </View>
        <View style={styles.priceBox}>
          <AppText variant={TextVariant.S_L} color={TextColors.G090}>
            {intl.formatMessage({
              id: 'phrases.product_price',
              defaultMessage: 'Product price',
            })}
          </AppText>
          <AppText size={18} variant={TextVariant.H2_A}>
            ${data?.productSumDollar}
          </AppText>
        </View>
        {!!data?.deliveryFee && (
          <View style={styles.priceBox}>
            <AppText variant={TextVariant.S_L} color={TextColors.G090}>
              {intl.formatMessage({
                id: 'phrases.delivery_fee',
                defaultMessage: 'Delivery fee',
              })}
            </AppText>
            <AppText size={18} variant={TextVariant.H2_A}>
              ${data?.deliveryFee}
            </AppText>
          </View>
        )}
        <HR style={styles.hr} />
        <View style={GLOBAL_STYLES.row_between}>
          <AppText variant={TextVariant.S_L} color={TextColors.G090}>
            Total amount
          </AppText>
          <AppText variant={TextVariant.H2_A}>${data?.totalCashFee}</AppText>
        </View>
        <View style={GLOBAL_STYLES.flex_1} />
        <View style={styles.buttons}>
          <Button
            width={(WIDTH - pageHorizontalInset) / 2}
            onPress={handlePressBack}
            variant={ButtonVariant.GRAY}
            title="Back"
          />
          <Button
            isLoading={isLoading}
            disabled={status === QueryStatus.fulfilled}
            withImageBackground
            title={intl.formatMessage({
              id: 'buttons.confirm',
              defaultMessage: 'Confirm',
            })}
            width={(WIDTH - pageHorizontalInset) / 2}
            onPress={handlePressConfirm}
          />
        </View>
      </View>
    );
  }, [data, handlePressBack, intl, isLoading, status]);

  return (
    <ScreenWrapper withTopInsets withHeader>
      <FlatList
        contentContainerStyle={GLOBAL_STYLES.flexGrow_1}
        ListHeaderComponent={ListHeaderComponent}
        ListFooterComponent={ListFooterComponent}
        ListFooterComponentStyle={GLOBAL_STYLES.flex_1}
        data={data?.details}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        showsVerticalScrollIndicator={false}
      />
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
    marginTop: 0,
  },
  name: {
    lineHeight: 24,
  },
  buttons: {
    ...GLOBAL_STYLES.row_between,
    paddingBottom: vp(20),
    marginTop: vp(20),
  },
  icon_space: {
    marginRight: vp(18),
  },
  location: {
    flexDirection: 'row',
    marginBottom: vp(25),
    width: '100%',
    borderColor: '#E5E5E5',
  },
  dis_info: {
    marginTop: vp(22),
    marginBottom: vp(15),
  },
  location_text: {
    alignSelf: 'center',
    flexShrink: 1,
    lineHeight: 20,
  },
  infoText: {
    marginBottom: vp(30),
  },
  priceBox: {
    ...GLOBAL_STYLES.row_between,
    marginBottom: vp(20),
  },
  rewardTab: {
    marginBottom: vp(20),
  },
  rewardTabText: {
    marginLeft: vp(17),
  },
  dispensaryName: {
    marginBottom: vp(16),
  },
});
