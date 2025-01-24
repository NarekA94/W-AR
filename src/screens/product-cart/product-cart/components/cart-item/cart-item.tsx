import React, {FC, memo, useCallback, useEffect, useMemo, useRef} from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {
  AppText,
  BottomSheet,
  BottomSheetRef,
  Button,
  OR,
  RewardTab,
} from '~/components';
import {
  CartEntity,
  CartItemDetail,
  SetCartRequest,
  useSetCartMutation,
} from '~/store/query/v2-cart';
import {FontWeight, GLOBAL_STYLES, TextColors, TextVariant} from '~/theme';
import {ProductItem, DeleteSheet, Notification, ShippingMethod} from '..';
import {ProductTabs} from '~/store/query/brand';
import {ShippingVariant} from '~/navigation';
import {useCartOrderReviewMutation} from '~/store/query/rewards';
import {OrderType} from '~/store/query/order';
import {useGetAuthUser} from '~/hooks/useGetAuthUser';
import {useIntl} from 'react-intl';
import DeleteItemIcon from '~/assets/images/cart/delete-item.png';

interface CartItemProps {
  tabInfo: CartEntity['tabInfo'];
  details: CartItemDetail[];
  totalPrice: number;
  brandId: number;
  notification?: string | null;
  deliveryFee: number;
  priceCorresponds?: boolean;
  showReceiptTypeButtons?: boolean;
  availableTypesOfReceipt?: OrderType[];
  currentReceiptType?: OrderType;
  onPressGoToCatalog?: () => void;
  onPressConfirmOrder: (
    tab: ProductTabs,
    variant: ShippingVariant,
    brandId: number,
  ) => void;
  onPressShowDocumentManager?: () => void;
}

const gradientColors = ['rgba(51, 51, 51, 1)', 'rgba(51, 51, 51, 0.1)'];

const getShippingVariant = (
  tab: ProductTabs,
  currentReceiptType?: OrderType,
) => {
  let variant: ShippingVariant = ShippingVariant.Both;

  if (tab === ProductTabs.SAME_DAY || tab === ProductTabs.SCHEDULED) {
    if (currentReceiptType === OrderType.delivery) {
      variant = ShippingVariant.Address;
    } else {
      variant = ShippingVariant.Dispensary;
    }
  }
  if (
    tab === ProductTabs.SAME_DAY_DELIVERY ||
    tab === ProductTabs.SCHEDULED_DELIVERY
  ) {
    variant = ShippingVariant.Address;
  }
  if (
    tab === ProductTabs.SAME_DAY_IN_STORE_PICK_UP ||
    tab === ProductTabs.SCHEDULED_IN_STORE_PICK_UP
  ) {
    variant = ShippingVariant.Dispensary;
  }
  return variant;
};

export const CartItem: FC<CartItemProps> = memo(
  ({
    tabInfo,
    details,
    totalPrice,
    onPressConfirmOrder,
    brandId,
    onPressGoToCatalog,
    notification,
    currentReceiptType,
    onPressShowDocumentManager,
    ...props
  }) => {
    const [reviewOrderRequest, {data: reviewOrder, reset}] =
      useCartOrderReviewMutation();
    const {authUser} = useGetAuthUser();
    const intl = useIntl();

    const bottomSheetModalRef = useRef<BottomSheetRef>(null);
    const productToDelete = useRef<SetCartRequest | null>(null);
    const snapPoints = useMemo(() => ['61%'], []);
    const [setCartProduct] = useSetCartMutation();
    const handlePrepareToDelete = useCallback((data: SetCartRequest) => {
      productToDelete.current = data;
    }, []);

    useEffect(() => {
      if (authUser?.physicianRecPhotoLink) {
        reset();
      }
    }, [authUser?.physicianRecPhotoLink]);
    const handleChangeQuantity = useCallback(
      (quantity: number, productId: number) => {
        if (quantity === 0) {
          bottomSheetModalRef.current?.open();
          handlePrepareToDelete({
            product: productId,
            quantity: 0,
            tab: tabInfo.tab,
          });
          return;
        }
        reset();
        setCartProduct({
          product: productId,
          quantity,
          tab: tabInfo.tab,
        });
      },
      [tabInfo, setCartProduct, handlePrepareToDelete, reset],
    );

    const handleDelete = useCallback(() => {
      if (productToDelete.current) {
        reset();
        bottomSheetModalRef.current?.close();
        setCartProduct(productToDelete.current);
      }
    }, [setCartProduct, reset]);

    const handlePressDeleteIcon = useCallback(
      (productId: number) => {
        handlePrepareToDelete({
          product: productId,
          quantity: 0,
          tab: tabInfo.tab,
        });
        bottomSheetModalRef.current?.open();
      },
      [handlePrepareToDelete, tabInfo.tab],
    );

    const handlePressConfirm = useCallback(() => {
      const variant = getShippingVariant(tabInfo.tab, currentReceiptType);
      reviewOrderRequest({
        tab: tabInfo.tab,
      })
        .unwrap()
        .then(res => {
          if (res.valid) {
            onPressConfirmOrder?.(tabInfo.tab, variant, brandId);
          }
        });
    }, [
      brandId,
      currentReceiptType,
      onPressConfirmOrder,
      reviewOrderRequest,
      tabInfo.tab,
    ]);

    const renderProducts = useCallback(
      (item: CartItemDetail, index: number) => (
        <ProductItem
          key={item.id}
          totalCashSum={item.totalCashSum}
          imageUri={item.product.images?.[0]?.file?.url}
          name={item.product.name}
          gramWeight={item.product.gramWeight}
          quantity={item.quantity}
          thc={item.product.thc}
          ounceWeight={item.product.ounceWeight}
          hr={details.length - 1 !== index}
          id={item.product.id}
          onChangeQuantity={handleChangeQuantity}
          tab={item.tab}
          onPressDelete={handlePressDeleteIcon}
        />
      ),
      [details, handleChangeQuantity, handlePressDeleteIcon],
    );
    const closeDeleteSheet = useCallback(() => {
      bottomSheetModalRef.current?.close();
    }, []);

    return (
      <>
        <LinearGradient style={styles.root} colors={gradientColors}>
          <View
            style={[GLOBAL_STYLES.row_vertical_center, styles.horizontal_24]}>
            <RewardTab
              fontWeight={FontWeight.W500}
              iconSize={20}
              textSize={15}
              tab={tabInfo.tab}
              textStyles={styles.tabTextStyle}
              timeTypeText={tabInfo.name}
            />
          </View>
          {details.map(renderProducts)}
          {props.showReceiptTypeButtons && (
            <ShippingMethod
              tab={tabInfo.tab}
              currentReceiptType={currentReceiptType}
              availableTypesOfReceipt={props.availableTypesOfReceipt}
            />
          )}
          {reviewOrder && !reviewOrder.valid && (
            <Notification
              errorActionText={intl.formatMessage({
                id: 'cart.add_recommendation',
                defaultMessage: "Add physician's recomendation",
              })}
              hasErrorAction={!authUser?.physicianRecPhotoLink}
              errorActionPressHandler={onPressShowDocumentManager}
              error={true}
              message={reviewOrder?.message}
            />
          )}
          {notification && (
            <>
              <Notification
                deliveryFee={props.deliveryFee}
                message={notification}
                error={!props.priceCorresponds}
              />
              <TouchableOpacity
                onPress={onPressGoToCatalog}
                style={styles.go_to_catalog}>
                <AppText variant={TextVariant.M_B} color={TextColors.A100}>
                  Go to catalog
                </AppText>
              </TouchableOpacity>
              <OR containerStyle={styles.or} />
            </>
          )}

          <View style={styles.horizontal_24}>
            <Button
              disabled={
                !props.priceCorresponds || (reviewOrder && !reviewOrder?.valid)
              }
              withImageBackground
              onPress={handlePressConfirm}
              title={
                <View style={[GLOBAL_STYLES.row_center]}>
                  <AppText variant={TextVariant.M_B}>Confirm order </AppText>
                  <View style={styles.dot} />
                  <AppText variant={TextVariant.M_B}> ${totalPrice}</AppText>
                </View>
              }
            />
          </View>
        </LinearGradient>
        <BottomSheet ref={bottomSheetModalRef} snapPoints={snapPoints}>
          <DeleteSheet
            icon={DeleteItemIcon}
            title={intl.formatMessage({
              id: 'global.are_you_sure',
              defaultMessage: 'Are you sure?',
            })}
            message={intl.formatMessage({
              id: 'cart.removeItemDescription',
              defaultMessage:
                'This action will delete choosen item(s) from your order',
            })}
            onPressDelete={handleDelete}
            close={closeDeleteSheet}
            confirmText={intl.formatMessage({
              id: 'global.delete',
              defaultMessage: 'Delete',
            })}
            cancelText={intl.formatMessage({
              id: 'global.back_to_cart',
              defaultMessage: 'Back to cart',
            })}
          />
        </BottomSheet>
      </>
    );
  },
);

const styles = StyleSheet.create({
  root: {
    width: '100%',
    borderRadius: 25,
    paddingTop: vp(20),
    paddingBottom: vp(32),
  },
  horizontal_24: {
    paddingHorizontal: 24,
  },
  status: {
    textTransform: 'uppercase',
    marginLeft: vp(8),
    marginTop: vp(2),
  },
  go_to_catalog: {
    borderBottomWidth: 1,
    borderColor: '#fff',
    alignSelf: 'center',
    paddingBottom: 1,
  },
  or: {
    marginTop: vp(27),
    marginBottom: vp(31),
  },
  dot: {
    width: vp(5),
    height: vp(5),
    borderRadius: 10,
    backgroundColor: 'black',
  },
  feeMessage: {
    marginTop: vp(22),
  },
  tabIcon: {
    width: vp(15),
    height: vp(15),
  },
  tabTextStyle: {
    textTransform: 'uppercase',
  },
});
