import React, {FC, Fragment, useCallback, useRef, useState} from 'react';
import {RefreshControl, ScrollView, StyleSheet, View} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {AppText, AboutPlatform, ScreenWrapper} from '~/components';
import {ProductsHeader} from '~/components/headers';
import {CatalogUserComposite, CatalogStackRoutes} from '~/navigation';
import {
  FontWeight,
  GLOBAL_STYLES,
  TextColors,
  TextVariant,
  useTheme,
} from '~/theme';
import {CatalogHeader} from './components/header';
import {ZipBottomSheet, ZipBottomSheetRef} from './components/zip-bottom-sheet';
import {Brands} from './components/brands';
import {useIntl} from 'react-intl';
import {useBottomTabBarInsets} from '~/components/blocks/tab-bar/useBottomTabBarInsets';
import {Collectibles} from './components/collectibles';
import ForwardIcon from '~/assets/images/arrowRight.svg';
import {useAppDispatch} from '~/store/hooks';
import {brandApi} from '~/store/query/brand';
import {nftDropApi} from '~/store/query/nft-drop';
import {PhoneVerificationModal} from '~/components/phone-verification-modal/phone-verification-modal';

export const CatalogScreen: FC<
  CatalogUserComposite<CatalogStackRoutes.CatalogScreen>
> = ({navigation}) => {
  const {tabBarHeight} = useBottomTabBarInsets();
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const dispatch = useAppDispatch();
  const {theme} = useTheme();
  const intl = useIntl();
  const editZipModalRef = useRef<ZipBottomSheetRef>(null);

  const handlePressZip = useCallback(() => {
    editZipModalRef.current?.open();
  }, []);

  const handlePressExplore = useCallback(() => {
    navigation.navigate(CatalogStackRoutes.BrandsScreen);
  }, []);

  const handlePressSeeAll = useCallback(() => {
    navigation.navigate(CatalogStackRoutes.CollectiblesScreen);
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await Promise.all([
      dispatch(
        brandApi.endpoints.getBrandsList.initiate(
          {},
          {
            forceRefetch: true,
          },
        ),
      ).unwrap(),
      dispatch(
        nftDropApi.endpoints.getNftDropList.initiate(undefined, {
          forceRefetch: true,
        }),
      ).unwrap(),
    ]);
    setRefreshing(false);
  }, []);

  return (
    <Fragment>
      <ScreenWrapper horizontalPadding={0} dark withTopInsets>
        <ScrollView
          refreshControl={
            <RefreshControl
              onRefresh={onRefresh}
              refreshing={refreshing}
              tintColor={theme.colors.textColors.A060}
            />
          }
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{paddingBottom: tabBarHeight}}
          showsVerticalScrollIndicator={false}>
          <CatalogHeader onPressZip={handlePressZip} />
          <Brands />
          <View style={GLOBAL_STYLES.horizontal_20}>
            <TouchableOpacity
              onPress={handlePressExplore}
              style={styles.explore}>
              <AppText
                style={GLOBAL_STYLES.text_center}
                variant={TextVariant.P}
                fontWeight={FontWeight.W600}
                color={TextColors.G070}>
                {intl.formatMessage({
                  id: 'screens.catalog.exploreBrands',
                  defaultMessage: 'EXPLORE BRANDS',
                })}
              </AppText>
              <ForwardIcon
                color={theme.colors.textColors.G070}
                style={styles.rightIcon}
              />
            </TouchableOpacity>

            <AboutPlatform title="About the platform" />
            <ProductsHeader
              onPressSeeAll={handlePressSeeAll}
              title="Collectibles"
            />
          </View>
          <Collectibles />
        </ScrollView>
      </ScreenWrapper>
      <ZipBottomSheet ref={editZipModalRef} />
      <PhoneVerificationModal />
    </Fragment>
  );
};

const styles = StyleSheet.create({
  contentContainerStyle: {
    paddingLeft: vp(20),
  },

  explore: {
    marginTop: vp(27),
    marginBottom: vp(38),
    width: vp(173),
    borderWidth: 1,
    borderColor: 'rgba(145, 145, 145, 0.21)',
    alignSelf: 'center',
    borderRadius: 18,
    height: vp(42),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(51, 51, 51, 0.39)',
    flexDirection: 'row',
  },
  rightIcon: {
    marginTop: -3,
    marginLeft: vp(15),
  },
});
