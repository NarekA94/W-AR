import React, {
  forwardRef,
  memo,
  useCallback,
  useMemo,
  useRef,
  useImperativeHandle,
} from 'react';
import {StyleSheet, View, ViewToken} from 'react-native';
import {
  BottomSheet,
  BottomSheetRef,
  ChooseLocation,
  ProductItem,
  ProductBoxWidth,
} from '~/components';
import {GLOBAL_STYLES} from '~/theme';
import {useNavigation} from '@react-navigation/native';
import {UserScreenNavigationProp, UserStackRoutes} from '~/navigation';
import {Product, useLazyGetProductsQuery} from '~/store/query/product';
import LinearGradient from 'react-native-linear-gradient';
import {useGetBrandCtx} from '~/context/brand/hooks';
import {useGetAuthUser} from '~/hooks/useGetAuthUser';
import {NeedZip} from './need-zip';
import {ProductTabs} from '~/store/query/brand';
import {useCartForm} from './hooks';
import {DeleteSheet} from './delete-sheet';
import {ShortInfo} from '~/components/brand/tabs/short-info';
import {FlashList} from '@shopify/flash-list';
import {useIntl} from 'react-intl';

export interface ProductsRef {
  scrollToProduct: (categoryId: number) => void;
}
interface ProductsProps {
  brandId?: number;
  isLoading?: boolean;
  isUninitialized?: boolean;
  products?: Product[];
}
const skeletonMockData = [1, 2];
const skeletonGradietnColors = ['rgba(0, 0, 0, 1)', 'rgba(41, 41, 41, 1)'];
const zipBottomSheetSnapPoints = ['70%'];

export const Products = memo(
  forwardRef<ProductsRef, ProductsProps>(
    ({brandId, isLoading, isUninitialized, products}, ref) => {
      const intl = useIntl();
      const bottomSheetRef = useRef<BottomSheetRef>(null);
      const flatListRef = useRef<FlashList<Product>>(null);
      const {handlePressAddButton, deleteSheetRef, handlePressDeleteCart} =
        useCartForm();
      const snapPoints = useMemo(() => ['65%'], []);
      const {selectedTab, selectedCategory, setSelectedCategory} =
        useGetBrandCtx();
      const {authUser} = useGetAuthUser();
      const navigation = useNavigation<UserScreenNavigationProp>();
      const [getProducts] = useLazyGetProductsQuery();

      const scrollToProduct = useCallback(
        (categoryId: number) => {
          if (typeof selectedCategory === 'number' && products) {
            let firstProductIndex: number | null = 0;
            for (let i = 0; i < products.length; i++) {
              if (products[i].type.id === categoryId) {
                firstProductIndex = i;
                break;
              }
            }
            setTimeout(() => {
              if (typeof firstProductIndex !== 'number') {
                return;
              }

              flatListRef.current?.scrollToIndex({
                index: firstProductIndex,
                animated: true,
                viewPosition: 0.5,
              });
            }, 100);
          }
        },
        [products, selectedCategory],
      );

      useImperativeHandle(ref, () => ({
        scrollToProduct,
      }));

      const handlePressProduct = useCallback(
        (id: number, color: string) => {
          navigation.navigate(UserStackRoutes.ProductScreen, {
            productId: id,
            ...(selectedTab?.tab !== ProductTabs.FULL_CATALOG
              ? {
                  tab: selectedTab?.tab,
                }
              : {}),
            color,
          });
        },
        [navigation, selectedTab?.tab],
      );

      const handlePressPoints = useCallback(
        ({productId}: {productId: number}) => {
          if (brandId) {
            navigation.navigate(UserStackRoutes.Dispensaries, {
              brandId,
              productId,
              hasPoints: true,
            });
          }
        },
        [],
      );

      const handleSelectLocation = useCallback(() => {
        bottomSheetRef.current?.close();
        if (brandId) {
          getProducts({brandId: brandId, tab: selectedTab?.tab})
            .unwrap()
            .then(res => {
              setSelectedCategory?.(res?.types?.[0]?.id);
            });
        }
      }, [brandId, getProducts, selectedTab?.tab, setSelectedCategory]);

      const handPressChooseZipCode = useCallback(() => {
        bottomSheetRef.current?.open();
      }, []);

      const renderProducts = ({item}: FlatListItem<Product>) => (
        <ProductItem
          id={item.id}
          gramWeight={item.gramWeight}
          ounceWeight={item.ounceWeight}
          name={item.name}
          thcString={item.thcString}
          points={item.brand.points}
          priceForPoints={item.priceForPoints}
          onPressProduct={handlePressProduct}
          uri={item.images?.[0]?.file?.url}
          primaryColor={item.primaryColor}
          brandId={item.brand.id}
          onPressPoints={handlePressPoints}
          isRedeemable={selectedTab?.tab === ProductTabs.FULL_CATALOG}
          price={item.price}
          onPressAddButton={handlePressAddButton}
          amountString={item.amountString}
          amount={item.amount}
        />
      );

      const renderBrandSkeleton = useCallback(
        () => (
          <LinearGradient
            colors={skeletonGradietnColors}
            style={styles.skeleton}
          />
        ),
        [],
      );

      const viewableItemsChanged = useRef(
        ({viewableItems}: {viewableItems: ViewToken[]}) => {
          if (viewableItems.length > 0) {
            const typeID = viewableItems[viewableItems.length - 1].item.type.id;
            if (typeID !== selectedCategory) {
              setSelectedCategory?.(typeID);
            }
          }
        },
      ).current;

      const viewConfig = useRef({
        viewAreaCoveragePercentThreshold: 50,
        waitForInteraction: false,
      }).current;

      if (isLoading || isUninitialized) {
        return (
          <FlashList
            style={GLOBAL_STYLES.overflow_visible}
            horizontal
            data={skeletonMockData}
            renderItem={renderBrandSkeleton}
          />
        );
      }
      return (
        <>
          <ShortInfo zipModalOpenHandler={handPressChooseZipCode} />

          {Array.isArray(products) && products.length > 0 && (
            <FlashList
              ref={flatListRef}
              horizontal
              data={products || []}
              scrollEventThrottle={1}
              renderItem={renderProducts}
              onViewableItemsChanged={viewableItemsChanged}
              viewabilityConfig={viewConfig}
              keyExtractor={item => item.id.toString()}
              estimatedItemSize={ProductBoxWidth + vp(40)}
              contentContainerStyle={GLOBAL_STYLES.horizontal_20}
              extraData={handlePressAddButton}
            />
          )}

          <View style={GLOBAL_STYLES.horizontal_20}>
            {selectedTab?.needZipCode && products?.length === 0 && (
              <NeedZip
                onPressChooseZipCode={handPressChooseZipCode}
                brandId={brandId}
                emptyZip={!authUser?.catalogZipCode}
              />
            )}
          </View>

          <BottomSheet ref={deleteSheetRef} snapPoints={snapPoints}>
            <DeleteSheet
              onPressDelete={handlePressDeleteCart}
              close={deleteSheetRef.current?.close}
            />
          </BottomSheet>
          <BottomSheet
            title={intl.formatMessage({
              id: 'zipCode.changeZip.title',
              defaultMessage: 'Want to change zip-code?',
            })}
            withCloseIcon
            ref={bottomSheetRef}
            snapPoints={zipBottomSheetSnapPoints}>
            <ChooseLocation
              handleSelectLocation={handleSelectLocation}
              withRecent
              type="modal"
            />
          </BottomSheet>
        </>
      );
    },
  ),
);

const styles = StyleSheet.create({
  zipCodeBody: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: vp(20),
  },
  description: {
    marginTop: vp(14),
    marginBottom: vp(32),
  },
  skeleton: {
    width: vp(293),
    height: vp(325),
    borderWidth: 1,
    borderColor: 'rgba(102, 102, 102, 0.7)',
    borderRadius: 25,
    marginLeft: vp(20),
    backgroundColor: 'black',
    marginTop: vp(37),
  },
  needZip: {
    marginBottom: vp(60),
  },
});
