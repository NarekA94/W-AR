import React, {FC, useCallback, useMemo} from 'react';
import {FlatList, RefreshControl, StyleSheet, View} from 'react-native';
import {AppText, ScreenWrapper} from '~/components';
import {UserStackParamProps, UserStackRoutes} from '~/navigation';
import {TextColors, TextVariant, useTheme} from '~/theme';
import {NotificationItem} from './components/notification-item';
import {CustomerNotification} from '~/store/query/notifications/types';
import {useGetNotificationsQuery} from '~/store/query/notifications';
import NotificationIcon from '~/assets/images/notifications/emptyNotifications.svg';
import {useIntl} from 'react-intl';
import SkeletonIcon from '~/assets/images/catalog/brand-skeleton.svg';

const skeletonMockData = [...Array(4).keys()];

export const PushHistoryScreen: FC<
  UserStackParamProps<UserStackRoutes.PushHistoryScreen>
> = () => {
  const {
    data: history,
    refetch,
    isFetching,
    isLoading,
  } = useGetNotificationsQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });
  const intl = useIntl();
  const {theme} = useTheme();

  const renderItem = useCallback(
    ({item}: FlatListItem<CustomerNotification>) => (
      <NotificationItem
        subject={item.subject}
        message={item.message}
        date={item.createdAt}
      />
    ),
    [],
  );
  const renderSkeleton = useCallback(
    (item: number) => (
      <SkeletonIcon
        key={item}
        width="100%"
        height={vp(183)}
        style={styles.skeleton}
      />
    ),
    [],
  );
  const ListHeaderComponent = () =>
    useMemo(() => {
      return (
        <AppText variant={TextVariant.H_6_W5} style={styles.title} size={26}>
          {intl.formatMessage({
            id: 'screens.push-history.title',
            defaultMessage: 'Notifications',
          })}
        </AppText>
      );
    }, []);
  const EmptyList = useCallback(() => {
    if (isLoading) {
      return null;
    }
    return (
      <View style={styles.root}>
        <NotificationIcon />
        <AppText
          style={styles.emptyTitle}
          size={20}
          variant={TextVariant['24_4A']}>
          {intl.formatMessage({
            id: 'screens.push-history.empty.title',
            defaultMessage: 'You don’t have any messages yet',
          })}
        </AppText>
        <AppText
          style={styles.emptyText}
          variant={TextVariant.S_R}
          color={TextColors.G090}>
          {intl.formatMessage({
            id: 'screens.push-history.empty.text',
            defaultMessage: 'Any new push notifications will be displayed here',
          })}
        </AppText>
      </View>
    );
  }, [isLoading, intl]);

  return (
    <ScreenWrapper withHeader withTopInsets>
      {isLoading ? (
        skeletonMockData.map(renderSkeleton)
      ) : (
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
          ListHeaderComponent={ListHeaderComponent}
          renderItem={renderItem}
          ListEmptyComponent={EmptyList}
          data={history}
        />
      )}
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  root: {
    marginTop: vp(100),
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyTitle: {
    marginTop: vp(20),
    marginBottom: vp(12),
    textAlign: 'center',
  },
  emptyText: {
    textAlign: 'center',
    lineHeight: 20,
  },
  title: {
    marginBottom: 16,
  },
  skeleton: {
    marginBottom: vp(12),
  },
});
