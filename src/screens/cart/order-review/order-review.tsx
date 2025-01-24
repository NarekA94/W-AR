import React, {FC, useCallback} from 'react';
import {Image, StyleSheet, View} from 'react-native';
import {AppText, Button, Table, Wrapper} from '~/components';
import {UserStackParamProps, UserStackRoutes} from '~/navigation';
import {
  CartOrderProduct,
  useConfirmOrderMutation,
  useCreateOrderMutation,
} from '~/store/query/order';
import {GLOBAL_STYLES, TextColors, TextVariant, useTheme} from '~/theme';
import {logger} from '~/utils';
import {ToFixNumber} from '~/utils/utils';
import {DeliveryDetails} from './components/delivery-details';
import {TotalInfo} from './components/total-info';

const ItemHeight = vp(80);

export const OrderReviewScreen: FC<
  UserStackParamProps<UserStackRoutes.OrderReview>
> = ({navigation}) => {
  const [, {data: order}] = useCreateOrderMutation({
    fixedCacheKey: 'create_order',
  });
  const [confirmOrder, {isLoading}] = useConfirmOrderMutation();
  const {theme} = useTheme();

  const handlePressPlaceOrder = useCallback(async () => {
    if (order?.id) {
      try {
        await confirmOrder({id: order?.id}).unwrap();
        navigation.navigate(UserStackRoutes.OrderSuccess);
      } catch (error) {
        logger.warn(error);
      }
    }
  }, []);

  const renderItem = useCallback((item: CartOrderProduct, index: number) => {
    const showSeparator =
      !!order?.orderDetails.length && index < order?.orderDetails.length - 1;
    return (
      <View
        style={[
          styles.item,
          showSeparator && styles.separator,
          {borderColor: theme.colors.border.E01},
        ]}
        key={item.product.id}>
        <View style={GLOBAL_STYLES.row_vertical_center}>
          <Image
            style={styles.image}
            source={{uri: item?.product?.images?.[0]?.file?.url}}
          />
          <View style={styles.itemInfo}>
            <AppText variant={TextVariant.M_R}>{item.product.name}</AppText>
            <AppText variant={TextVariant.R} color={TextColors.B040}>
              {ToFixNumber(item.product.gramWeight)}g
            </AppText>
          </View>
        </View>
        <View style={styles.priceBox}>
          <AppText variant={TextVariant.M_B}>
            ${ToFixNumber(item.product.price)}
          </AppText>
          <AppText
            variant={TextVariant.R}
            style={styles.quantity}
            color={TextColors.B040}>
            x{item.quantity}
          </AppText>
        </View>
      </View>
    );
  }, []);

  return (
    <>
      <Wrapper
        animtedHeaderProps={{
          title: 'Order review',
        }}
        scrollProps={{
          contentContainerStyle: styles.contentContainerStyle,
        }}
        withTabBottomInset
        withAnimatedHeader
        horizontalPadding={24}
        withScroll
        withStatusBar>
        <AppText variant={TextVariant.H2_B}>Order review</AppText>
        <AppText
          variant={TextVariant.S_B}
          color={TextColors.B040}
          style={styles.tableLable}>
          List of items
        </AppText>
        <Table
          data={order?.orderDetails || []}
          rowHeight={ItemHeight}
          renderItem={renderItem}
        />
        <TotalInfo order={order} />
        <DeliveryDetails
          name={order?.name}
          address={order?.addressLine1}
          phone={order?.phone}
        />
      </Wrapper>
      <View style={styles.buttonBox}>
        <Button
          isLoading={isLoading}
          onPress={handlePressPlaceOrder}
          title="Place order"
          width={'100%'}
        />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  contentContainerStyle: {
    flexGrow: 1,
    paddingBottom: vp(50),
  },
  buttonBox: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 24,
    paddingBottom: 8,
  },
  quantity: {
    alignSelf: 'flex-end',
  },
  item: {
    height: ItemHeight,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  tableLable: {
    marginLeft: 12,
    marginBottom: 8,
    marginTop: 25,
  },
  separator: {
    borderBottomWidth: 1,
  },
  image: {
    height: vp(32),
    width: vp(32),
  },
  itemInfo: {
    width: '70%',
    marginLeft: vp(12),
  },
  priceBox: {
    height: vp(38),
    justifyContent: 'space-between',
  },
});
