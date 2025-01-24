import React, {FC, memo, useCallback, useEffect, useState} from 'react';
import {StyleSheet, TouchableOpacity} from 'react-native';
import {FlatList} from 'react-native-gesture-handler';
import {CardSmall} from '~/components';
import {Brand, useGetBrandsListQuery} from '~/store/query/brand';
import SkeletonIcon from '~/assets/images/catalog/brand-skeleton.svg';
import {useNavigation} from '@react-navigation/native';
import {UserScreenNavigationProp, UserStackRoutes} from '~/navigation';
import AsyncStorage from '@react-native-async-storage/async-storage';

const skeletonMockData = [1, 2];

const retrieveIsSwitchOn = async (): Promise<boolean> => {
  const stringValue = await AsyncStorage.getItem('isSwitchOn');
  return stringValue !== null ? stringValue === 'true' : false;
};

export const Brands: FC = memo(() => {
  const [showHidden, setShowHidden] = useState<boolean>(false);

  useEffect(() => {
    const loadAsync = async () => {
      const value = await retrieveIsSwitchOn();
      setShowHidden(value);
    };
    loadAsync();
  }, []);

  const {isLoading, data} = useGetBrandsListQuery({
    showHidden: showHidden ? 'true' : 'false',
  });
  const navigation = useNavigation<UserScreenNavigationProp>();

  const handlePressBrand = useCallback((id: number) => {
    return () => {
      navigation.navigate(UserStackRoutes.BrandScreen, {brandId: id});
    };
  }, []);

  const renderBrands = useCallback(
    ({item}: FlatListItem<Brand>) => (
      <TouchableOpacity onPress={handlePressBrand(item.id)}>
        <CardSmall
          rewardAvailable={item.rewardAvailable}
          gradientEndColorHex={item.gradientEndColorHex}
          gradientStartColorHex={item.gradientStartColorHex}
          cardImage={item.cardImage.url}
          logo={item.logo.url}
          points={item.points}
        />
      </TouchableOpacity>
    ),
    [],
  );

  const renderBrandSkeleton = useCallback(
    () => (
      <SkeletonIcon width={vp(251)} height={vp(182)} style={styles.skeleton} />
    ),
    [],
  );

  if (isLoading) {
    return (
      <FlatList
        horizontal
        contentContainerStyle={styles.contentContainerStyle}
        showsHorizontalScrollIndicator={false}
        data={skeletonMockData}
        renderItem={renderBrandSkeleton}
      />
    );
  }
  return (
    <FlatList
      horizontal
      contentContainerStyle={styles.contentContainerStyle}
      showsHorizontalScrollIndicator={false}
      data={data}
      renderItem={renderBrands}
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
  skeleton: {
    marginRight: vp(20),
    width: vp(251),
    height: vp(182),
  },
});
