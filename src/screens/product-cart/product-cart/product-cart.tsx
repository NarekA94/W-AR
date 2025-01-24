import React, {FC, useCallback, useRef} from 'react';
import {FlatList, StyleSheet} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {AppText, FullScreenModalRef, ScreenWrapper} from '~/components';
import {
  ShippingVariant,
  UserStackParamProps,
  UserStackRoutes,
} from '~/navigation';
import {ProductTabs} from '~/store/query/brand';
import {CartEntity, useGetCartQuery} from '~/store/query/v2-cart';
import {GLOBAL_STYLES, TextColors, TextVariant} from '~/theme';
import {CartItem, EmptyList} from './components';
import {DocCenterModal} from '~/screens/cart/order-details/components/document-center';

export const ProductCartScreen: FC<
  UserStackParamProps<UserStackRoutes.ProductCart>
> = ({navigation}) => {
  const modalDocsRef = useRef<FullScreenModalRef>(null);

  const {data: cart} = useGetCartQuery();
  const {bottom} = useSafeAreaInsets();
  const handlePressConfirmOrder = useCallback(
    (tab: ProductTabs, variant: ShippingVariant, brandId: number) => {
      navigation.navigate(UserStackRoutes.CollectiblesShippingMethod, {
        type: 'cart',
        tab,
        variant,
        brandId,
      });
    },
    [navigation],
  );

  const handlePressGoToCatalog = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const onPressShowDocumentManager = useCallback(() => {
    modalDocsRef.current?.open();
  }, []);
  const renderItem = useCallback(
    ({item}: FlatListItem<CartEntity>) => (
      <CartItem
        availableTypesOfReceipt={item.availableTypesOfReceipt}
        currentReceiptType={item.currentReceiptType}
        showReceiptTypeButtons={item.showReceiptTypeButtons}
        notification={item.notification}
        brandId={item.brandId}
        onPressConfirmOrder={handlePressConfirmOrder}
        totalPrice={item.totalCashFee}
        tabInfo={item.tabInfo}
        details={item.details}
        deliveryFee={item.deliveryFee}
        onPressGoToCatalog={handlePressGoToCatalog}
        priceCorresponds={item.priceCorresponds}
        onPressShowDocumentManager={onPressShowDocumentManager}
      />
    ),
    [
      handlePressConfirmOrder,
      handlePressGoToCatalog,
      onPressShowDocumentManager,
    ],
  );

  const ListHeaderComponent = useCallback(() => {
    if (cart?.length === 0) {
      return null;
    }
    return (
      <AppText
        style={styles.onlyCache}
        variant={TextVariant.S_R}
        color={TextColors.A100}>
        Only cash is accepted as a payment method
      </AppText>
    );
  }, [cart]);

  return (
    <ScreenWrapper
      withHeader
      withTopInsets
      headerProps={{
        title: 'Cart',
        headerMarginBottom: vp(25),
      }}>
      <FlatList
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={ListHeaderComponent}
        renderItem={renderItem}
        contentContainerStyle={[
          GLOBAL_STYLES.flexGrow_1,
          {paddingBottom: bottom + vp(25)},
        ]}
        ListEmptyComponent={EmptyList}
        data={cart}
      />
      <DocCenterModal ref={modalDocsRef} />
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  onlyCache: {
    marginBottom: vp(14),
  },
});
