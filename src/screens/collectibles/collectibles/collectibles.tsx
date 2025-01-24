import React, {FC, useCallback} from 'react';
import {ScreenWrapper} from '~/components';
import SearchIcon from '~/assets/images/searchIcon.svg';
import {GLOBAL_STYLES, useTheme} from '~/theme';
import {FlatList, TouchableOpacity} from 'react-native';
import {
  CollectibleItem,
  CollectibleItemSkeleton,
} from './components/collectible-item';
import {
  CatalogStackRoutes,
  CatalogUserComposite,
  UserStackRoutes,
} from '~/navigation';
import {useBottomTabBarInsets} from '~/components/blocks/tab-bar/useBottomTabBarInsets';
import {NFTDrop, useGetNftDropListQuery} from '~/store/query/nft-drop';

const mockSkeletonData = new Array(6).fill(null);

export const CollectiblesScreen: FC<
  CatalogUserComposite<CatalogStackRoutes.CollectiblesScreen>
> = ({navigation}) => {
  const {data, isLoading, isUninitialized} = useGetNftDropListQuery();
  const {theme} = useTheme();
  const {tabBarHeight} = useBottomTabBarInsets();

  const handlePressItem = useCallback((id: number) => {
    return () => {
      navigation.navigate(UserStackRoutes.CollectibleScreen, {id});
    };
  }, []);

  const renderCollectibles = useCallback(
    ({item}: FlatListItem<NFTDrop>) => (
      <CollectibleItem
        perks={item.perks}
        name={item.name}
        brandName={item.brand}
        imageUri={item?.nftPreview?.url}
        onPress={handlePressItem(item.id)}
      />
    ),
    [],
  );

  const handlePressSearch = useCallback(() => {
    navigation.navigate(UserStackRoutes.SerachCollectibles);
  }, []);

  const renderBrandSkeleton = useCallback(
    () => <CollectibleItemSkeleton />,
    [],
  );

  return (
    <ScreenWrapper
      withHeader
      withStatusBar
      horizontalPadding={0}
      headerProps={{
        headerMarginBottom: vp(37),
        paddingHorizontal: 20,
        title: 'Collectibles',
        right: (
          <TouchableOpacity onPress={handlePressSearch}>
            <SearchIcon color={theme.colors.background.primary} />
          </TouchableOpacity>
        ),
      }}>
      {isLoading || isUninitialized ? (
        <FlatList
          numColumns={2}
          data={mockSkeletonData}
          renderItem={renderBrandSkeleton}
          contentContainerStyle={[
            GLOBAL_STYLES.horizontal_20,
            {paddingBottom: tabBarHeight},
          ]}
        />
      ) : (
        <FlatList
          numColumns={2}
          keyExtractor={item => item.id.toString()}
          data={data}
          renderItem={renderCollectibles}
          contentContainerStyle={[
            GLOBAL_STYLES.horizontal_20,
            {paddingBottom: tabBarHeight},
          ]}
        />
      )}
    </ScreenWrapper>
  );
};
