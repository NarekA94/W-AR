import React, {FC, useCallback, useEffect, useState} from 'react';
import {StyleSheet} from 'react-native';
import {
  AccountBlock,
  AlertAndNotificationSwitcher,
  AppText,
  ScreenWrapper,
} from '~/components';
import {UserStackParamProps, UserStackRoutes} from '~/navigation';
import Notification from '~/assets/images/notification.svg';
import Password from '~/assets/images/password.svg';
import BellIcon from '~/assets/images/bell.svg';
import {TextVariant} from '~/theme';
import {useIntl} from 'react-intl';
import {useGetAuthUser} from '~/hooks/useGetAuthUser';
import {useUpdateUserSettingMutation} from '~/store/query/user/userApi';
import messaging from '@react-native-firebase/messaging';

export const SettingsScreen: FC<
  UserStackParamProps<UserStackRoutes.Settings>
> = ({navigation}) => {
  const intl = useIntl();
  const [updateUserSettings] = useUpdateUserSettingMutation();
  const [notificationPermissionStatus, setNotificationPermissionStatus] =
    useState<boolean>(false);
  const {authUser} = useGetAuthUser();
  const handleToggleSwitcher = useCallback(() => {
    if (authUser) {
      updateUserSettings({
        id: authUser.id,
        enableNotifications: !authUser.enableNotifications,
      });
    }
  }, [authUser, updateUserSettings]);

  const handlePressChangePassword = useCallback(() => {
    navigation.navigate(UserStackRoutes.ChangePassword);
  }, [navigation]);

  const handlePressMarketing = useCallback(() => {
    navigation.navigate(UserStackRoutes.MarketingNotification);
  }, [navigation]);

  useEffect(() => {
    const checkPermission = async () => {
      try {
        const status = await messaging().hasPermission();
        if (status === messaging.AuthorizationStatus.DENIED) {
          setNotificationPermissionStatus(true);
        }
      } catch (error) {
        setNotificationPermissionStatus(true);
      }
    };
    checkPermission();
  }, []);

  return (
    <ScreenWrapper withHeader withTopInsets withBottomInset>
      <AppText variant={TextVariant.H_6_W5} size={24} style={styles.textStyle}>
        {intl.formatMessage({
          id: 'screens.profile.settings',
          defaultMessage: 'Settings',
        })}
      </AppText>
      <AccountBlock
        title={intl.formatMessage({
          id: 'screens.profile.notifications',
          defaultMessage: 'Notifications',
        })}
        switcher={
          <AlertAndNotificationSwitcher
            isOn={authUser?.enableNotifications}
            toggleSwitcher={handleToggleSwitcher}
            disabled={notificationPermissionStatus}
          />
        }
        svgIcon={<Notification />}
      />
      <AccountBlock
        title={intl.formatMessage({
          id: 'screens.profile.changePassword',
          defaultMessage: 'Change password',
        })}
        onPress={handlePressChangePassword}
        svgIcon={<Password />}
        withArrow={true}
      />
      <AccountBlock
        title={intl.formatMessage({
          id: 'screens.profile.marketing_notifications',
          defaultMessage: 'Marketing notifications',
        })}
        onPress={handlePressMarketing}
        svgIcon={<BellIcon />}
        withArrow={true}
      />
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  infotext: {
    marginTop: vp(28),
    marginBottom: vp(14),
  },
  textStyle: {
    marginBottom: vp(16),
  },
  styleProfile: {
    marginBottom: vp(28),
  },
  scroll: {
    paddingBottom: vp(35),
  },
});
