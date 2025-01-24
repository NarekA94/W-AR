import React, {FC, useCallback, useEffect, useState} from 'react';
import {Pressable, StyleSheet, View, FlatList} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import ArrowBackImage from '~/assets/images/arrowLeft.svg';
import {AppText, ListEmpty, SearchInput} from '~/components';
import {WIDTH} from '~/constants/layout';
import {UserStackParamProps, UserStackRoutes} from '~/navigation';
import {GLOBAL_STYLES, TextColors, TextVariant} from '~/theme';
import {BrandItem} from './components/brend-item';
import {RecentBrand} from './components/recent';
import {
  Brand,
  useAddToSerachHistoryBrandsMutation,
  useSearchBrandsQuery,
  useSearchHistoryBrandsQuery,
} from '~/store/query/brand';

const horizontalGradientColors = [
  'rgba(0, 0, 0, 1)',
  'rgba(104, 237, 158, 0.6)',
  'rgba(0, 0, 0, 1)',
];
const horizontalGradientLocations = [0, 0.5, 1];
const horizontalGradientStart = {x: 0, y: 0};
const horizontalGradientEnd = {x: 1, y: 0};

const verticalGradientColors = ['transparent', 'transparent', 'black'];
const verticalGradientLocations = [0.2, 0.7, 1];
const verticalGradientStart = {x: 0, y: 0};
const verticalGradientEnd = {x: 0, y: 1};

export const SerachBrandsScreen: FC<
  UserStackParamProps<UserStackRoutes.SerachBrands>
> = ({navigation}) => {
  const [setSearchHistory] = useAddToSerachHistoryBrandsMutation();
  const [searchText, setSearchText] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const {data: recent} = useSearchHistoryBrandsQuery();

  const {data: brands} = useSearchBrandsQuery({search: searchText});

  const handlePressBackIcon = () => {
    navigation.goBack();
  };
  const {top} = useSafeAreaInsets();

  const onChangeSearchText = useCallback((text: string) => {
    setIsLoading(true);
    setSearchText(text);
  }, []);

  const handlePressItem = useCallback(
    (id: number) => {
      setSearchHistory({id});
      navigation.navigate(UserStackRoutes.BrandScreen, {brandId: id});
    },
    [navigation],
  );

  const renderRecent = ({item}: FlatListItem<Brand>) => (
    <RecentBrand
      id={item.id}
      onPress={handlePressItem}
      name={item.name}
      colors={[item.gradientStartColorHex, item.gradientEndColorHex]}
      logo={item.logo.url}
    />
  );

  const renderBrands = ({item}: FlatListItem<Brand>) => (
    <BrandItem
      id={item.id}
      onPress={handlePressItem}
      name={item.name}
      colors={[item.gradientStartColorHex, item.gradientEndColorHex]}
      logo={item.logo.url}
    />
  );

  useEffect(() => {
    setIsLoading(false);
  }, [brands]);

  return (
    <View style={GLOBAL_STYLES.flex_1}>
      <View style={styles.gradientBox}>
        <LinearGradient
          colors={horizontalGradientColors}
          locations={horizontalGradientLocations}
          start={horizontalGradientStart}
          end={horizontalGradientEnd}
          style={styles.gradinet}
        />
        <LinearGradient
          colors={verticalGradientColors}
          locations={verticalGradientLocations}
          start={verticalGradientStart}
          end={verticalGradientEnd}
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
      {!!searchText && !isLoading && (
        <FlatList
          renderItem={renderBrands}
          data={brands}
          contentContainerStyle={GLOBAL_STYLES.horizontal_20}
          ListEmptyComponent={ListEmpty}
        />
      )}
      {!searchText && !!recent?.length && (
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
