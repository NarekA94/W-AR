import React, {FC, useCallback, useState} from 'react';
import {Pressable, StyleSheet, View, FlatList} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import ArrowBackImage from '~/assets/images/arrowLeft.svg';
import {AppText, ListEmpty} from '~/components';
import {WIDTH} from '~/constants/layout';
import {UserStackParamProps, UserStackRoutes} from '~/navigation';
import {GLOBAL_STYLES, TextColors, TextVariant} from '~/theme';
import {CollectibleItem} from './components/collectible-item';
import {SearchInput} from './components/search-input';
import {
  NFTDrop,
  useGetSearchNftDropHistoryQuery,
  useSearchNftDropQuery,
  useSetSearchNftDropHistoryMutation,
} from '~/store/query/nft-drop';
import {RecentCollectible} from './components/recent';

export const SerachCollectiblesScreen: FC<
  UserStackParamProps<UserStackRoutes.SerachCollectibles>
> = ({navigation}) => {
  const [searchText, setSearchText] = useState<string>('');

  const {data: brands, isFetching} = useSearchNftDropQuery({
    search: searchText,
  });
  const {data: recent} = useGetSearchNftDropHistoryQuery();
  const [setNftDropHistory] = useSetSearchNftDropHistoryMutation();

  const handlePressBackIcon = () => {
    navigation.goBack();
  };
  const {top} = useSafeAreaInsets();

  const onChangeSearchText = useCallback((text: string) => {
    setSearchText(text);
  }, []);

  const handlePressItem = useCallback(
    (id: number) => {
      setNftDropHistory({id});
      navigation.navigate(UserStackRoutes.CollectibleScreen, {id});
    },
    [navigation],
  );

  const renderRecent = ({item}: FlatListItem<NFTDrop>) => (
    <RecentCollectible
      id={item.id}
      onPress={handlePressItem}
      name={item.name}
      logo={item?.nftPreview?.url}
    />
  );

  const renderBrands = ({item}: FlatListItem<NFTDrop>) => (
    <CollectibleItem
      id={item.id}
      onPress={handlePressItem}
      name={item.name}
      logo={item?.nftPreview?.url}
    />
  );

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
        <SearchInput value={searchText} setValue={onChangeSearchText} />
      </View>
      {!!searchText && !isFetching && (
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
