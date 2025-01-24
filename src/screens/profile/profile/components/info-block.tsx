import React, {FC, memo, ReactNode, useCallback} from 'react';
import {View} from 'react-native';

import Bag from '~/assets/images/bag.svg';
import Location from '~/assets/images/location.svg';
import Document from '~/assets/images/document.svg';
import Email from '~/assets/images/email.svg';
import Phone from '~/assets/images/smallphone.svg';
import SettingsIcon from '~/assets/images/settings.svg';
import PushHistoryIcon from '~/assets/images/profile/push-history.svg';

import {AccountBlock} from '~/components';
import {useGetAuthUser} from '~/hooks/useGetAuthUser';
import {useIntl} from 'react-intl';
import {formatPhoneNumber} from '~/utils/form';
import {UserScreenNavigationProp, UserStackRoutes} from '~/navigation';
import {useNavigation} from '@react-navigation/native';

interface ProfileItem {
  title?: string;
  text?: string;
  withArrow?: boolean;
  svgIcon?: ReactNode;
  switcher?: ReactNode;
  screenName?: UserStackRoutes;
}

export const InfoBlock: FC = memo(() => {
  const {authUser} = useGetAuthUser();
  const navigation = useNavigation<UserScreenNavigationProp>();
  const intl = useIntl();
  const ProfileItems: ProfileItem[] = [
    {
      title: intl.formatMessage({
        id: 'screens.profile.myOrders',
        defaultMessage: 'My orders',
      }),
      withArrow: true,
      svgIcon: <Bag />,
      screenName: UserStackRoutes.Rewards,
    },
    {
      title: intl.formatMessage({
        id: 'screens.profile.pushHistory',
        defaultMessage: 'Notifications history',
      }),
      withArrow: true,
      svgIcon: <PushHistoryIcon />,
      screenName: UserStackRoutes.PushHistoryScreen,
    },
    {
      title: intl.formatMessage({
        id: 'screens.profile.myState',
        defaultMessage: 'My state',
      }),
      text: authUser?.territoryState?.name,
      svgIcon: <Location />,
      screenName: UserStackRoutes.MyStateScreen,
    },
    {
      title: intl.formatMessage({
        id: 'screens.profile.documentsCenter',
        defaultMessage: 'Documents center',
      }),
      withArrow: true,
      svgIcon: <Document />,
      screenName: UserStackRoutes.ProfileDocumentCenter,
    },
    {
      title: intl.formatMessage({
        id: 'screens.profile.email',
        defaultMessage: 'Email',
      }),
      text: authUser?.email,
      svgIcon: <Email />,
      screenName: UserStackRoutes.ChangeEmail,
    },
    {
      title: intl.formatMessage({
        id: 'screens.profile.phone',
        defaultMessage: 'Phone',
      }),
      text: formatPhoneNumber(authUser?.phone || ''),
      svgIcon: <Phone />,
      screenName: UserStackRoutes.ChangePhone,
    },
    {
      title: intl.formatMessage({
        id: 'phrases.settings',
        defaultMessage: 'Settings',
      }),
      svgIcon: <SettingsIcon />,
      screenName: UserStackRoutes.Settings,
    },
  ];
  const handlePressItem = useCallback(
    (screenName: any) => {
      navigation.navigate(screenName);
    },
    [navigation],
  );

  const renderItem = (item: ProfileItem, index: number) => (
    <AccountBlock
      onPress={() => handlePressItem(item.screenName)}
      key={index}
      {...item}
    />
  );

  return <View>{ProfileItems.map(renderItem)}</View>;
});
