import React, {FC, useCallback, useEffect, useState} from 'react';
import {FlatList, Pressable, RefreshControl, StyleSheet} from 'react-native';
import {CardMedium, ScreenWrapper} from '~/components';
import SearchICon from '~/assets/images/searchIcon.svg';
import {
  CatalogUserComposite,
  CatalogStackRoutes,
  UserStackRoutes,
} from '~/navigation';
import {useBottomTabBarInsets} from '~/components/blocks/tab-bar/useBottomTabBarInsets';
import {Brand, useGetBrandsListQuery} from '~/store/query/brand';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {useTheme} from '~/theme';

const retrieveIsSwitchOn = async (): Promise<boolean> => {
  const stringValue = await AsyncStorage.getItem('isSwitchOn');
  return stringValue !== null ? stringValue === 'true' : false;
};

export const BrandsScreen: FC<
  CatalogUserComposite<CatalogStackRoutes.BrandsScreen>
> = ({navigation}) => {
  const [showHidden, setShowHidden] = useState<boolean>(false);

  useEffect(() => {
    const loadAsync = async () => {
      const value = await retrieveIsSwitchOn();
      setShowHidden(value);
    };
    loadAsync();
  }, []);

  const {theme} = useTheme();
  const {data, isFetching, refetch} = useGetBrandsListQuery({
    showHidden: showHidden ? 'true' : 'false',
  });
  const {tabBarHeight} = useBottomTabBarInsets();
  const handlePressBrand = useCallback((id: number) => {
    navigation.navigate(UserStackRoutes.BrandScreen, {brandId: id});
  }, []);

  const renderBrands = ({item}: FlatListItem<Brand>) => (
    <CardMedium
      id={item.id}
      rewardAvailable={item.rewardAvailable}
      onPress={handlePressBrand}
      logo={item.logo.url}
      points={item.points}
      gradientEndColorHex={item.gradientEndColorHex}
      gradientStartColorHex={item.gradientStartColorHex}
    />
  );

  const handlePressSearch = useCallback(() => {
    navigation.navigate(UserStackRoutes.SerachBrands);
  }, []);

  return (
    <ScreenWrapper
      withHeader
      dark
      withStatusBar
      headerProps={{
        title: 'Brands',
        headerMarginBottom: vp(18),
        right: (
          <Pressable onPress={handlePressSearch}>
            <SearchICon />
          </Pressable>
        ),
      }}>
      <FlatList
        refreshControl={
          <RefreshControl
            onRefresh={refetch}
            refreshing={isFetching}
            tintColor={theme.colors.textColors.A060}
          />
        }
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        data={data}
        contentContainerStyle={[
          styles.contentContainerStyle,
          {paddingBottom: tabBarHeight},
        ]}
        renderItem={renderBrands}
      />
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  contentContainerStyle: {
    paddingTop: vp(17),
  },
});
