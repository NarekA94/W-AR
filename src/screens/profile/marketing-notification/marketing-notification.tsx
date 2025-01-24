import React, {FC, useCallback, useMemo, useRef} from 'react';
import {useIntl} from 'react-intl';
import {Image, StyleSheet, View} from 'react-native';
import {
  AccountBlock,
  AlertAndNotificationSwitcher,
  AlertAndNotificationSwitcherRef,
  AppText,
  BottomSheet,
  BottomSheetRef,
  Button,
  ScreenWrapper,
} from '~/components';
import {UserStackParamProps, UserStackRoutes} from '~/navigation';
import Message from '~/assets/images/profile/message.svg';
import {ButtonVariant, GLOBAL_STYLES, TextColors, TextVariant} from '~/theme';
import {isScreenSmallerThanIPhone8} from '~/constants/layout';
import OptOut from '~/assets/images/profile/opt-out.png';
import {useGetAuthUser} from '~/hooks/useGetAuthUser';
import {useUpdateUserMutation} from '~/store/query/user/userApi';

export const MarketingNotifications: FC<
  UserStackParamProps<UserStackRoutes.MarketingNotification>
> = () => {
  const intl = useIntl();
  const bottomSheetModalRef = useRef<BottomSheetRef>(null);
  const switcherRef = useRef<AlertAndNotificationSwitcherRef>(null);
  const [updateUser] = useUpdateUserMutation();
  const {authUser} = useGetAuthUser();
  const snapPoints = useMemo(
    () => [isScreenSmallerThanIPhone8() ? '65%' : '60%'],
    [],
  );

  const handleToggleSwitcher = useCallback(() => {
    if (authUser) {
      if (authUser?.receiveMarketingSms) {
        bottomSheetModalRef.current?.open();
        return;
      }
      switcherRef.current?.on();

      updateUser({
        id: authUser?.id,
        receiveMarketingSms: !authUser?.receiveMarketingSms,
      }).unwrap();
    }
  }, [authUser, updateUser]);

  const handleCancel = useCallback(() => {
    bottomSheetModalRef.current?.close();
  }, []);

  const handlePressOptOut = useCallback(() => {
    if (authUser) {
      switcherRef.current?.off();

      updateUser({
        id: authUser?.id,
        receiveMarketingSms: !authUser?.receiveMarketingSms,
      }).unwrap();
      bottomSheetModalRef.current?.close();
    }
  }, [authUser, updateUser]);

  return (
    <>
      <ScreenWrapper withHeader withTopInsets withBottomInset>
        <AppText
          variant={TextVariant.H_6_W5}
          size={24}
          style={styles.textStyle}>
          {intl.formatMessage({
            id: 'screens.profile.marketing.title',
            defaultMessage: 'Marketing notification',
          })}
        </AppText>
        <AccountBlock
          title={intl.formatMessage({
            id: 'screens.profile.screens.profile.marketing',
            defaultMessage: 'Opt-out marketing SMS',
          })}
          switcher={
            <AlertAndNotificationSwitcher
              ref={switcherRef}
              isOn={authUser?.receiveMarketingSms}
              toggleSwitcher={handleToggleSwitcher}
              disableAutoSwitch={true}
              debounceTime={0}
            />
          }
          svgIcon={<Message />}
        />
      </ScreenWrapper>
      <BottomSheet ref={bottomSheetModalRef} snapPoints={snapPoints}>
        <View style={styles.body}>
          <Image style={styles.img} source={OptOut} />
          <AppText style={styles.alertTitle} variant={TextVariant.H_5}>
            {intl.formatMessage({
              id: 'screens.profile.marketing.alert.title',
              defaultMessage:
                'Opting out of marketing notifications means missing out on tailored offers.',
            })}
          </AppText>
          <AppText
            style={styles.info}
            variant={TextVariant.S_R}
            color={TextColors.G090}>
            {intl.formatMessage({
              id: 'screens.profile.marketing.alert.body',
              defaultMessage: 'Are you sure you want to proceed?',
            })}
          </AppText>
        </View>

        <View style={GLOBAL_STYLES.row_between}>
          <Button
            title={intl.formatMessage({id: 'phrases.opt_out'})}
            onPress={handlePressOptOut}
            width="48%"
            variant={ButtonVariant.GRAY}
          />
          <Button
            onPress={handleCancel}
            title={intl.formatMessage({id: 'global.cancel'})}
            width="48%"
            withImageBackground
          />
        </View>
      </BottomSheet>
    </>
  );
};

const styles = StyleSheet.create({
  textStyle: {
    marginBottom: vp(16),
  },
  body: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  info: {
    marginTop: vp(9),
    marginBottom: vp(39),
  },
  img: {
    width: vp(120),
    height: vp(109),
    marginBottom: vp(47),
  },
  alertTitle: {
    ...GLOBAL_STYLES.text_center,
    lineHeight: 20,
  },
});
