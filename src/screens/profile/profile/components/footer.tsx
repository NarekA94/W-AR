import React, {FC, memo, useCallback, useMemo, useRef, useState} from 'react';
import {useIntl} from 'react-intl';
import {Image, StyleSheet, View, TouchableOpacity} from 'react-native';
import {
  AppText,
  BottomSheet,
  BottomSheetRef,
  Button,
  CustomAlert,
  CustomAlertRef,
} from '~/components';
import {ButtonVariant, GLOBAL_STYLES, TextColors, TextVariant} from '~/theme';
import LogOut from '~/assets/images/profile/log_out.png';
import {useAppDispatch} from '~/store/hooks';
import {logOut} from '~/store/reducers';
import {useDeleteAccountMutation} from '~/store/query/user/userApi';
import {useGetAuthUser} from '~/hooks/useGetAuthUser';
import {isScreenSmallerThanIPhone8} from '~/constants/layout';
import DeviceInfo from 'react-native-device-info';
import {SecretMenu} from '~/components/secret-menu/secret-menu';

export const ProfileFooter: FC = memo(() => {
  const dispatch = useAppDispatch();
  const {authUser} = useGetAuthUser();
  const [secretTapsCount, setSecretTapsCount] = useState(0);
  const [deleteAccount] = useDeleteAccountMutation();
  const deleteAccountAlert = useRef<CustomAlertRef>(null);
  const bottomSheetModalRef = useRef<BottomSheetRef>(null);
  const bottomSheetSecretRef = useRef<BottomSheetRef>(null);
  const secretBottomSheetSnapPoints = ['20%'];
  const intl = useIntl();
  const snapPoints = useMemo(
    () => [isScreenSmallerThanIPhone8() ? '65%' : '60%'],
    [],
  );

  const handleLogout = useCallback(async () => {
    bottomSheetModalRef.current?.close();
    dispatch(logOut());
  }, []);

  const handleCancel = useCallback(() => {
    bottomSheetModalRef.current?.close();
  }, []);

  const handlePressDeleteButton = useCallback(() => {
    deleteAccountAlert.current?.open();
  }, []);

  const handlePressLogout = useCallback(() => {
    bottomSheetModalRef.current?.open();
  }, []);

  const handleDeleteAccount = useCallback(() => {
    if (authUser) {
      deleteAccount()
        .unwrap()
        .then(() => {
          handleLogout();
        });
    }
  }, [deleteAccount, handleLogout, authUser]);

  const handlePressSecretMenu = useCallback(() => {
    setSecretTapsCount(secretTapsCount + 1);
    if (secretTapsCount + 1 === 30) {
      bottomSheetSecretRef.current?.open();
      setSecretTapsCount(0);
    }
  }, [secretTapsCount]);

  const appVersion = DeviceInfo.getVersion();

  return (
    <>
      <Button
        containerStyle={styles.buttonLogOut}
        width="100%"
        variant={ButtonVariant.GRAY}
        onPress={handlePressLogout}
        title={intl.formatMessage({
          id: 'screens.profile.logout',
          defaultMessage: 'Log out',
        })}
      />
      <TouchableOpacity
        style={styles.buttonDeleteContainer}
        onPress={handlePressDeleteButton}>
        <AppText style={styles.buttonDelete}>
          {intl.formatMessage({
            id: 'screens.profile.deleteMyAccount',
            defaultMessage: 'Delete my account',
          })}
        </AppText>
      </TouchableOpacity>
      <TouchableOpacity onPress={handlePressSecretMenu} activeOpacity={1}>
        <AppText style={styles.versionInfo} variant={TextVariant.S_R}>
          v{appVersion}
        </AppText>
      </TouchableOpacity>
      <CustomAlert
        title={intl.formatMessage({
          id: 'screens.profile.delete.alert.title',
          defaultMessage: 'Delete account',
        })}
        message={intl.formatMessage({
          id: 'screens.profile.delete.alert.info',
          defaultMessage:
            'Are you sure you want to delete your account? This action cannot be undone.',
        })}
        rightText="Delete"
        onPress={handleDeleteAccount}
        ref={deleteAccountAlert}
      />
      <BottomSheet
        withCloseIcon
        ref={bottomSheetModalRef}
        snapPoints={snapPoints}>
        <View style={styles.body}>
          <Image style={styles.img} source={LogOut} />
          <AppText variant={TextVariant['24_5A']}>Log out</AppText>
          <AppText
            style={styles.info}
            variant={TextVariant.S_R}
            color={TextColors.G090}>
            Are you sure you want to log out ?
          </AppText>
        </View>

        <View style={GLOBAL_STYLES.row_between}>
          <Button
            title="Cancel"
            onPress={handleCancel}
            width="48%"
            variant={ButtonVariant.GRAY}
          />
          <Button
            onPress={handleLogout}
            title="Log Out"
            width="48%"
            withImageBackground
          />
        </View>
      </BottomSheet>

      <BottomSheet
        ref={bottomSheetSecretRef}
        snapPoints={secretBottomSheetSnapPoints}
        disableCloseByTouchOutside={true}>
        <SecretMenu />
      </BottomSheet>
    </>
  );
});

const styles = StyleSheet.create({
  buttonLogOut: {
    marginTop: vp(34),
    marginBottom: vp(14),
  },
  buttonDelete: {
    fontWeight: '500',
    fontSize: 16,
    color: '#FF4C56',
    alignSelf: 'center',
  },
  img: {
    width: vp(113),
    height: vp(113),
    marginBottom: vp(47),
  },
  body: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  info: {
    marginTop: vp(9),
    marginBottom: vp(39),
  },
  buttonDeleteContainer: {
    marginTop: vp(18),
    width: '50%',
    alignSelf: 'center',
  },
  versionInfo: {
    color: '#9EA2C48F',
    alignSelf: 'center',
    marginTop: vp(32),
  },
});
