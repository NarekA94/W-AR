import {useNavigation} from '@react-navigation/native';
import React, {FC, memo, useCallback} from 'react';
import {FlatList, StyleSheet} from 'react-native';
import {CollectibleItem, CollectibleItemSkeleton} from '~/components';
import {UserScreenNavigationProp, UserStackRoutes} from '~/navigation';
import {NFTDrop, useGetNftDropListQuery} from '~/store/query/nft-drop';

const mockSkeletonData = new Array(4).fill(null);

export const Collectibles: FC = memo(() => {
  const {data, isLoading, isUninitialized} = useGetNftDropListQuery();
  const navigation = useNavigation<UserScreenNavigationProp>();

  const handlePressCollectible = useCallback((id: number) => {
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
        onPress={handlePressCollectible(item.id)}
      />
    ),
    [],
  );

  const renderBrandSkeleton = useCallback(
    () => <CollectibleItemSkeleton />,
    [],
  );

  if (isUninitialized || isLoading) {
    return (
      <FlatList
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        horizontal
        contentContainerStyle={styles.contentContainerStyle}
        data={mockSkeletonData}
        renderItem={renderBrandSkeleton}
      />
    );
  }
  return (
    <FlatList
      showsHorizontalScrollIndicator={false}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.contentContainerStyle}
      horizontal
      data={data}
      renderItem={renderCollectibles}
    />
  );
});

const styles = StyleSheet.create({
  contentContainerStyle: {
    paddingLeft: vp(20),
  },

  explore: {
    marginTop: vp(27),
    marginBottom: vp(38),
  },
});
