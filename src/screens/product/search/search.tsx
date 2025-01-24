import React, {FC, useCallback, useMemo, useRef, useState} from 'react';
import {Pressable, StyleSheet, View, FlatList} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import ArrowBackImage from '~/assets/images/arrowLeft.svg';
import {
  AppText,
  BottomSheet,
  BottomSheetRef,
  ChooseLocation,
  ListEmpty,
  SearchInput,
} from '~/components';
import {WIDTH} from '~/constants/layout';
import {UserStackParamProps, UserStackRoutes} from '~/navigation';
import {GLOBAL_STYLES, TextColors, TextVariant} from '~/theme';
import {ProductItem} from './components/product-item';
import {RecentBrand} from './components/recent';
import {
  Product,
  useSearchProductHistoryQuery,
  useSearchProductsQuery,
  useSetSearchProductHistoryMutation,
} from '~/store/query/product';
import {Tabs} from '~/components/brand/tabs/tabs';
import {useGetSelectedBrandTab} from '~/context/brand/hooks';
import {BrandSearchContext} from '~/context/brand';
import {ShortInfo} from '~/components/brand/tabs/short-info';
import {NeedZip} from '~/screens/brands/brand/components/products/need-zip';
import {useGetAuthUser} from '~/hooks/useGetAuthUser';
import {useIntl} from 'react-intl';
const zipBottomSheetSnapPoints = ['70%'];

export const SearchProductsScreen: FC<
  UserStackParamProps<UserStackRoutes.SearchProducts>
> = ({navigation, route}) => {
  const intl = useIntl();
  const {brandId} = route.params;
  const {selectedTab} = useGetSelectedBrandTab(BrandSearchContext);
  // const [getBrand, {data}] = useLazyGetBrandQuery();

  const [setSearchHistory] = useSetSearchProductHistoryMutation();
  const [searchText, setSearchText] = useState<string>('');

  const {data: recent} = useSearchProductHistoryQuery({
    brandId,
    tab: selectedTab?.tab,
  });
  const {authUser} = useGetAuthUser();

  const {
    data: products,
    refetch,
    status: searchProductsStatus,
  } = useSearchProductsQuery({
    search: searchText,
    brandId,
    tab: selectedTab?.tab,
  });
  const bottomSheetRef = useRef<BottomSheetRef>(null);

  const handPressChooseZipCode = useCallback(() => {
    bottomSheetRef.current?.open();
  }, []);
  const handlePressBackIcon = () => {
    navigation.goBack();
  };
  const {top} = useSafeAreaInsets();

  const onChangeSearchText = useCallback((text: string) => {
    setSearchText(text);
  }, []);

  const handlePressItem = useCallback(
    (id: number, color: string) => {
      setSearchHistory({id, tab: selectedTab?.tab});
      navigation.navigate(UserStackRoutes.ProductScreen, {
        productId: id,
        tab: selectedTab?.tab,
        color,
      });
    },
    [navigation, selectedTab],
  );
  const handleSelectLocation = useCallback(() => {
    bottomSheetRef.current?.close();
    if (brandId) {
      refetch();
    }
  }, [brandId, refetch]);
  const renderRecent = ({item}: FlatListItem<Product>) => (
    <RecentBrand
      id={item.id}
      onPress={handlePressItem}
      name={item.name}
      primaryColor={item.primaryColor}
      logo={item.images?.[0]?.file?.url}
    />
  );

  const renderBrands = ({item}: FlatListItem<Product>) => (
    <ProductItem
      primaryColor={item.primaryColor}
      thc={item.thc}
      strain={item.strain?.name}
      id={item.id}
      onPress={handlePressItem}
      name={item.name}
      logo={item.images?.[0]?.file?.url}
    />
  );
  const isRecentVisible = useMemo(() => {
    return (
      !searchText &&
      (!selectedTab?.needZipCode || authUser?.catalogZipCode) &&
      !!recent?.length
    );
  }, [searchText, selectedTab, authUser, recent]);

  const areProductsVisible = useMemo(() => {
    return (
      !!searchText &&
      (!selectedTab?.needZipCode || authUser?.catalogZipCode) &&
      searchProductsStatus === 'fulfilled'
    );
  }, [searchText, selectedTab, authUser, searchProductsStatus]);

  const isNeedZipVisible = useMemo(() => {
    return (
      selectedTab?.needZipCode &&
      products?.products?.length === 0 &&
      !authUser?.catalogZipCode
    );
  }, [products, selectedTab, authUser]);

  return (
    <View style={GLOBAL_STYLES.flex_1}>
      <View style={styles.gradientBox}>
        <LinearGradient
          colors={[
            'rgba(0, 0, 0, 1)',
            'rgba(104, 237, 158, 0.6)',
            'rgba(0, 0, 0, 1)',
          ]}
          locations={[0, 0.5, 1]}
          start={{x: 0, y: 0}}
          end={{x: 1, y: 0}}
          style={styles.gradinet}
        />
        <LinearGradient
          colors={['transparent', 'transparent', 'black']}
          locations={[0.2, 0.7, 1]}
          start={{x: 0, y: 0}}
          end={{x: 0, y: 1}}
          style={styles.gradientTop}
        />
      </View>

      <View style={[styles.header, {marginTop: top + vp(18)}]}>
        <Pressable onPress={handlePressBackIcon}>
          <ArrowBackImage />
        </Pressable>
        <SearchInput
          inputContainerStyles={GLOBAL_STYLES.flex_1}
          value={searchText}
          setValue={onChangeSearchText}
        />
      </View>
      <View style={GLOBAL_STYLES.horizontal_20}>
        <Tabs context={BrandSearchContext} brandId={brandId} />
      </View>
      {selectedTab?.needZipCode && (
        <ShortInfo
          context={BrandSearchContext}
          zipModalOpenHandler={handPressChooseZipCode}
        />
      )}
      <View style={GLOBAL_STYLES.horizontal_20}>
        {isNeedZipVisible && (
          <NeedZip
            onPressChooseZipCode={handPressChooseZipCode}
            brandId={brandId}
            emptyZip={!authUser?.catalogZipCode}
          />
        )}
      </View>
      {areProductsVisible && (
        <FlatList
          renderItem={renderBrands}
          data={products?.products}
          contentContainerStyle={GLOBAL_STYLES.horizontal_20}
          ListEmptyComponent={ListEmpty}
        />
      )}
      {isRecentVisible && (
        <View>
          <View style={GLOBAL_STYLES.horizontal_20}>
            <AppText
              style={styles.section}
              variant={TextVariant.P_M}
              color={TextColors.A060}>
              Recent results
            </AppText>
          </View>

          <FlatList
            horizontal
            renderItem={renderRecent}
            data={recent}
            contentContainerStyle={GLOBAL_STYLES.horizontal_20}
          />
        </View>
      )}
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
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    paddingHorizontal: 20,
  },
  section: {
    marginBottom: vp(19),
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: 'red',
    marginBottom: vp(28),
    paddingHorizontal: 20,
  },
  gradientBox: {
    position: 'absolute',
    alignItems: 'center',
    overflow: 'hidden',
    width: WIDTH,
  },
  gradinet: {
    width: '100%',
    height: vp(165),
    opacity: 0.2,
  },
  gradientTop: {width: '100%', height: vp(165), marginTop: -vp(165)},
});
