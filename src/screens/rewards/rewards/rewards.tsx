import React, {
  FC,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {useIntl} from 'react-intl';
import {
  FlatList,
  RefreshControl,
  SectionList,
  SectionListData,
  SectionListRenderItemInfo,
  StyleSheet,
} from 'react-native';
import {ScreenWrapper} from '~/components';
import {UserStackParamProps, UserStackRoutes} from '~/navigation';
import {
  Reward,
  rewardsApi,
  RewardsSection,
  RewardsTab,
  useGetRewardsCountQuery,
  useGetRewardsQuery,
} from '~/store/query/rewards';
import {
  EmptyScreen,
  RewardItem,
  SectionHeader,
  CategoryItem,
} from './components';
import SkeletonIcon from '~/assets/images/catalog/brand-skeleton.svg';
import {GLOBAL_STYLES, useTheme} from '~/theme';
import {useAppDispatch} from '~/store/hooks';
import {useListBottomSafeAreaInset} from '~/hooks/useListBottomSafeAreaInset';
import {useHiddenUi} from '~/hooks/useHiddenUi';
import {debounce} from 'lodash';

const skeletonMockData = [...Array(4).keys()];

export const RewardsScreen: FC<
  UserStackParamProps<UserStackRoutes.Rewards>
> = ({route}) => {
  const {theme} = useTheme();
  const checkStatusForHiddenUi = useHiddenUi();
  const {bottom} = useListBottomSafeAreaInset();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const intl = useIntl();
  const {params} = route;
  const sectionListRef = useRef<SectionList<Reward, RewardsSection>>(null);
  const [needScrollToTarget, setNeedScrollToTarget] = useState<boolean>(true);
  useGetRewardsCountQuery(undefined, {refetchOnMountOrArgChange: true});
  const {
    data: rewards,
    isUninitialized,
    isLoading,
  } = useGetRewardsQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  const [refreshing, setRefreshing] = useState<boolean>(false);
  const dispatch = useAppDispatch();

  const renderItem = useCallback(
    ({item}: SectionListRenderItemInfo<Reward, RewardsSection>) => {
      const needToShowAll = item.number === params?.orderNumber;
      return <RewardItem reward={item} needToShowAll={needToShowAll} />;
    },
    [],
  );

  const renderSectionHeader = useCallback(
    ({section}: {section: SectionListData<Reward, RewardsSection>}) => (
      <SectionHeader sectionName={section.title} />
    ),
    [],
  );

  useEffect(() => {
    if (Array.isArray(rewards) && rewards.length > 0) {
      let currentTabOrders = rewards?.find(
        item => item.tabInfo.tabName === selectedCategory,
      )?.orders;
      if (!currentTabOrders) {
        setSelectedCategory(rewards?.[0]?.tabInfo?.tabName);
      }
    }
  }, [rewards]);

  const sectionListData = useMemo(() => {
    if (Array.isArray(rewards) && rewards.length > 0) {
      let data = rewards?.find(
        item => item.tabInfo.tabName === selectedCategory,
      )?.orders;
      return data || [];
    }
    return [];
  }, [rewards, selectedCategory]);

  const scrollToTarget = useCallback(() => {
    let targetSectionIndex = -1;
    let targetItemIndex = -1;
    if (needScrollToTarget) {
      if (sectionListData) {
        if (
          Array.isArray(rewards) &&
          rewards.length &&
          Array.isArray(rewards[0].orders)
        ) {
          rewards[0].orders.some((order, i) => {
            return (
              Array.isArray(order.data) &&
              order.data.some((item: Reward, j: number) => {
                if (item.number === params?.orderNumber) {
                  targetSectionIndex = i;
                  targetItemIndex = j;
                  return true;
                }
                return false;
              })
            );
          });
        }

        if (
          sectionListRef.current &&
          targetSectionIndex !== -1 &&
          targetItemIndex !== -1
        ) {
          sectionListRef.current.scrollToLocation({
            sectionIndex: targetSectionIndex,
            itemIndex: targetItemIndex,
            animated: true,
          });
          setNeedScrollToTarget(false);
        }
      }
    }
  }, []);

  const debouncedScrollToTarget = useMemo(
    () => debounce(scrollToTarget, 300),
    [scrollToTarget],
  );

  const renderSkeleton = useCallback(
    () => (
      <SkeletonIcon width="100%" height={vp(183)} style={styles.skeleton} />
    ),
    [],
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await dispatch(
      rewardsApi.endpoints.getRewards.initiate(undefined, {forceRefetch: true}),
    ).unwrap();
    await dispatch(
      rewardsApi.endpoints.getRewardsCount.initiate(undefined, {
        forceRefetch: true,
      }),
    ).unwrap();
    setRefreshing(false);
  }, [dispatch]);

  const handleSelectCategoryTab = useCallback((tabName?: string) => {
    if (!tabName) {
      return;
    }
    setSelectedCategory(tabName);
  }, []);

  const renderCategoryTabs = useCallback(
    ({item}: FlatListItem<RewardsTab>) => {
      const tabName = item?.tabInfo?.tabName;
      return (
        <CategoryItem
          onPress={handleSelectCategoryTab}
          title={tabName}
          isSelected={selectedCategory === tabName}
        />
      );
    },
    [handleSelectCategoryTab, selectedCategory],
  );

  const ListHeaderComponent = useCallback(() => {
    return (
      <FlatList
        showsHorizontalScrollIndicator={false}
        horizontal
        data={rewards}
        renderItem={renderCategoryTabs}
      />
    );
  }, [renderCategoryTabs, rewards]);

  return (
    <ScreenWrapper
      withHeader
      withStatusBar
      horizontalPadding={0}
      headerProps={{
        headerMarginBottom: vp(37),
        paddingHorizontal: 20,
        title: checkStatusForHiddenUi(
          intl.formatMessage({
            id: 'screens.rewards.title',
            defaultMessage: 'My orders',
          }),
          'My Rewards',
        ),
      }}>
      {isUninitialized || isLoading ? (
        <FlatList
          contentContainerStyle={GLOBAL_STYLES.horizontal_20}
          data={skeletonMockData}
          renderItem={renderSkeleton}
        />
      ) : (
        <SectionList
          ref={sectionListRef}
          refreshControl={
            <RefreshControl
              onRefresh={onRefresh}
              refreshing={refreshing}
              tintColor={theme.colors.textColors.A060}
            />
          }
          contentContainerStyle={[
            styles.contentContainerStyle,
            {paddingBottom: bottom},
          ]}
          ListHeaderComponent={ListHeaderComponent}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          sections={sectionListData as any}
          ListEmptyComponent={EmptyScreen}
          keyExtractor={item => item.number}
          renderItem={renderItem}
          renderSectionHeader={renderSectionHeader}
          stickySectionHeadersEnabled={false}
          onContentSizeChange={debouncedScrollToTarget}
        />
      )}
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  skeleton: {
    marginBottom: vp(16),
  },
  contentContainerStyle: {
    ...GLOBAL_STYLES.flexGrow_1,
    ...GLOBAL_STYLES.horizontal_20,
  },
});
