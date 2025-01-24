import React, {FC, useCallback, useState} from 'react';
import {KeyboardAvoidingView, StyleSheet, View} from 'react-native';
import {
  AppText,
  BoxIcon,
  Button,
  ResendField,
  ScreenWrapper,
  VerifyMode,
} from '~/components';
import {
  FontWeight,
  GLOBAL_STYLES,
  TextColors,
  TextVariant,
  useTheme,
} from '~/theme';
import VerifyIcon from '~/assets/images/verify.svg';
import {UserStackParamProps, UserStackRoutes} from '~/navigation';
import {
  CodeField,
  Cursor,
  RenderCellOptions,
  useBlurOnFulfill,
  useClearByFocusCell,
} from 'react-native-confirmation-code-field';
import auth from '@react-native-firebase/auth';
import {unMaskPhoneNumber} from '~/utils/form';
import {useUpdatePhoneMutation} from '~/store/query/user/userApi';
import {useGetAuthUser} from '~/hooks/useGetAuthUser';
import {logger} from '~/utils';
import ChangePhoneSuccessIcon from '~/assets/images/profile/change_phone.png';
import {IS_IOS} from '~/constants/layout';
import {useIntl} from 'react-intl';
import {ApiError} from '~/store/types';

const CELL_COUNT = 6;
export const VerifyUpdatedNumberScreen: FC<
  UserStackParamProps<UserStackRoutes.VerifyUpdatedNumber>
> = ({route, navigation}) => {
  const {params} = route;
  const intl = useIntl();
  const [updatePhone] = useUpdatePhoneMutation();
  const {authUser} = useGetAuthUser();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const {theme} = useTheme();
  const [error, setError] = useState<string>();
  const [otpValue, setOtpValue] = useState('');
  const ref = useBlurOnFulfill({value: otpValue, cellCount: CELL_COUNT});
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value: otpValue,
    setValue: setOtpValue,
  });
  const [verificationId, setVerificationId] = useState(params.verificationId);
  const renderCell = ({index, symbol, isFocused}: RenderCellOptions) => (
    <View
      style={[
        styles.cellBox,
        {borderColor: theme.colors.border.A020},
        !!symbol && {borderColor: theme.colors.background.primary},
        !!error && {borderColor: theme.colors.common.error},
      ]}
      onLayout={getCellOnLayoutHandler(index)}
      key={index}>
      <AppText
        variant={TextVariant.M_R}
        color={error ? TextColors.error : TextColors.A100}>
        {symbol || (isFocused ? <Cursor /> : null)}
      </AppText>
    </View>
  );

  const handleResend = useCallback(async () => {
    auth()
      .verifyPhoneNumber(unMaskPhoneNumber(params.phoneNumber))
      .on(
        'state_changed',
        phoneAuthSnapshot => {
          setVerificationId(phoneAuthSnapshot.verificationId);
        },
        err => {
          const verifyError = err as any;
          if (
            verifyError.code === 'auth/too-many-requests' &&
            verifyError?.userInfo
          ) {
            setError(verifyError.message);
          }
        },
      );
  }, [params.phoneNumber]);

  const handleOnFocus = useCallback(() => {
    if (error) {
      setError('');
    }
  }, [error]);

  const handleSubmit = useCallback(
    (code?: string) => {
      setIsLoading(true);
      const credential = auth.PhoneAuthProvider.credential(
        verificationId,
        code ? code : otpValue,
      );
      auth()
        .signInWithCredential(credential)
        .then(() => {
          if (authUser) {
            updatePhone({
              id: authUser?.id,
              phone: unMaskPhoneNumber(params.phoneNumber),
            })
              .unwrap()
              .then(() => {
                navigation.navigate(UserStackRoutes.Congratulations, {
                  infoI18nKey: 'screens.profile.change_phone.congratulations',
                  file: ChangePhoneSuccessIcon,
                });
              })
              .catch(e => {
                setIsLoading(false);
                const err = e as ApiError<string>;
                logger.log(err);
                if (err?.data) {
                  setError(err?.data);
                }
              });
          }
        })
        .catch((err: any) => {
          setIsLoading(false);
          if (err.code === 'auth/session-expired') {
            setError(err?.userInfo?.message || '');
          }
          if (err.code === 'auth/invalid-verification-code') {
            setError(
              'The SMS verification code is invalid. Please resend the verification code',
            );
          }
        });
    },
    [
      verificationId,
      authUser,
      params.phoneNumber,
      otpValue,
      updatePhone,
      navigation,
    ],
  );

  const onChangeText = useCallback(
    (code: string) => {
      setOtpValue(code);
      if (code.length === CELL_COUNT) {
        handleSubmit(code);
      }
    },
    [setOtpValue, handleSubmit],
  );

  return (
    <ScreenWrapper withHeader dark withTopInsets>
      <KeyboardAvoidingView
        style={GLOBAL_STYLES.flex_1}
        behavior={IS_IOS ? 'padding' : undefined}>
        <AppText variant={TextVariant.H_5} size={26}>
          {intl.formatMessage({
            id: 'screens.profile.verify_phone.title',
            defaultMessage: 'Confirm your number',
          })}
        </AppText>
        <BoxIcon containerStyle={styles.box} icon={<VerifyIcon />} />
        <AppText variant={TextVariant.S_R} color={TextColors.G090}>
          {intl.formatMessage({
            id: 'screens.profile.verify_phone.subtitle',
            defaultMessage: 'The SMS code is sent to',
          })}
        </AppText>
        <AppText
          style={styles.current}
          variant={TextVariant.H4_G}
          color={TextColors.A100}
          fontWeight={FontWeight.W400}>
          {params.phoneNumber.replace('  ', '')}
        </AppText>
        <View style={styles.codeField}>
          <CodeField
            ref={ref}
            {...props}
            value={otpValue}
            onChangeText={onChangeText}
            cellCount={CELL_COUNT}
            keyboardType="number-pad"
            textContentType="oneTimeCode"
            renderCell={renderCell}
            onFocus={handleOnFocus}
          />
          {!!error && (
            <AppText
              style={[styles.error, {color: theme.colors.common.error}]}
              variant={TextVariant.R}>
              {error}
            </AppText>
          )}
        </View>
        <ResendField
          onPress={handleResend}
          verifyMode={VerifyMode.PHONE}
          phoneOnly
        />
        <View style={GLOBAL_STYLES.flex_1} />

        <Button
          title="Next"
          withImageBackground
          isLoading={isLoading}
          onPress={handleSubmit}
          disabled={true}
          containerStyle={isLoading ? styles.button : styles.buttonTransparent}
        />
      </KeyboardAvoidingView>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  box: {
    marginTop: vp(20),
    marginBottom: vp(26),
  },
  current: {
    marginTop: vp(12),
    marginBottom: vp(24),
  },
  button: {
    marginBottom: vp(25),
  },
  buttonTransparent: {
    marginBottom: vp(25),
    opacity: 0,
  },
  cellBox: {
    height: vp(48),
    width: vp(44.1),
    borderWidth: 1,
    borderColor: '#E0E7E0',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  codeField: {marginBottom: vp(38)},
  error: {
    marginTop: 8,
  },
});
