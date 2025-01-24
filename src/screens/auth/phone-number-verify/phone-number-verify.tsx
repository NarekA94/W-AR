import React, {FC, useCallback, useEffect, useState} from 'react';
import {useIntl} from 'react-intl';
import {StyleSheet, View} from 'react-native';
import {setAdjustNothing, setAdjustPan} from 'rn-android-keyboard-adjust';
import {
  AppText,
  Button,
  ResendField,
  ScreenWrapper,
  VerifyMode,
} from '~/components';
import {useGetAuthUser} from '~/hooks/useGetAuthUser';
import {
  ButtonVariant,
  FontWeight,
  GLOBAL_STYLES,
  TextColors,
  TextVariant,
  useTheme,
} from '~/theme';
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
  RenderCellOptions,
} from 'react-native-confirmation-code-field';
import {UserStackParamProps, UserStackRoutes} from '~/navigation';
import auth from '@react-native-firebase/auth';
import {unMaskPhoneNumber} from '~/utils/form';
import {httpClient} from '~/api/httpClient';
import {logger} from '~/utils';
import {AxiosError} from 'axios';
import {userModel} from '~/storage/models/user';
import {zipCodeModel} from '~/storage';
import {
  useLazyGetCurrentUserQuery,
  useUpdateUserMutation,
} from '~/store/query/user/userApi';
import {authenticModel} from '~/storage/models/authentic';
import {gameModel} from '~/storage/models/game';

const CELL_COUNT = 6;

export const PhoneNumberVerifyScreen: FC<
  UserStackParamProps<UserStackRoutes.PhoneNumberVerify>
> = ({route, navigation}) => {
  const [updateUser] = useUpdateUserMutation();
  const [fetchUser] = useLazyGetCurrentUserQuery();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [verifyMode, setVerifyMode] = useState<VerifyMode>(VerifyMode.PHONE);
  const {authUser} = useGetAuthUser();
  const {params} = route;
  const {theme} = useTheme();
  const intl = useIntl();
  const [otpValue, setOtpValue] = useState('');
  const [error, setError] = useState<string>();
  const ref = useBlurOnFulfill({value: otpValue, cellCount: CELL_COUNT});

  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value: otpValue,
    setValue: setOtpValue,
  });
  const [verificationId, setVerificationId] = useState(params.verificationId);

  useEffect(() => {
    setAdjustPan();
    return () => {
      setAdjustNothing();
    };
  }, []);

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

  const continueAfterSuccessfullySignUp = useCallback(() => {
    userModel.removeUserCachedRegisterStep();
    zipCodeModel.removeUserSelectedZipCode();

    fetchUser();

    const authenticToken = authenticModel.getAuthenticToken();
    const gameToken = gameModel.getGameToken();

    setIsLoading(false);
    if (authenticToken) {
      navigation.reset({
        index: 0,
        routes: [
          {name: UserStackRoutes.TabNavigator},
          {
            name: UserStackRoutes.BrandScreen,
            params: {qrToken: authenticToken},
          },
        ],
      });
    } else if (gameToken) {
      navigation.reset({
        index: 0,
        routes: [
          {name: UserStackRoutes.TabNavigator},
          {
            name: UserStackRoutes.StickerGameScreen,
            params: {id: gameToken},
          },
        ],
      });
    } else {
      navigation.reset({
        index: 0,
        routes: [{name: UserStackRoutes.TabNavigator}],
      });
    }
  }, [fetchUser, navigation]);

  const confirmEmailCode = useCallback(
    async (code?: string) => {
      try {
        setIsLoading(true);
        await httpClient.post('user/confirm-email', {
          code: code ? code : otpValue,
        });
        await httpClient.put(`user/${authUser?.id}/verifyPhone`, {
          phone: unMaskPhoneNumber(params.phoneNumber),
        });
        continueAfterSuccessfullySignUp();
      } catch (e) {
        const err = e as AxiosError<string>;
        logger.log(err);
        if (err.response) {
          setError(err.response.data);
        }
      } finally {
        setIsLoading(false);
      }
    },
    [
      authUser?.id,
      continueAfterSuccessfullySignUp,
      otpValue,
      params.phoneNumber,
    ],
  );

  const confirmCode = (code?: string) => {
    setIsLoading(true);
    const credential = auth.PhoneAuthProvider.credential(
      verificationId,
      code || otpValue,
    );
    auth()
      .signInWithCredential(credential)
      .then(() => {
        httpClient
          .put(`user/${authUser?.id}/verifyPhone`, {
            phone: unMaskPhoneNumber(params.phoneNumber),
          })
          .then(async () => {
            if (authUser) {
              await updateUser({
                id: authUser?.id,
                phoneConfirmed: true,
              }).unwrap();
            }
            continueAfterSuccessfullySignUp();
          })
          .catch(e => {
            setIsLoading(false);
            const err = e as AxiosError<string>;
            logger.log(err);
            if (err.response) {
              setError(err.response.data);
            }
          });
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
  };

  const handleOnFocus = () => {
    if (error) {
      setError('');
    }
  };

  const handleResend = useCallback(async () => {
    setVerifyMode(VerifyMode.PHONE);
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

  const handlePressSendCodeToEmail = useCallback(() => {
    setVerifyMode(VerifyMode.EMAIL);
    httpClient.post('user/resend-confirm-email-code');
  }, []);

  const onChangeText = useCallback(
    (code: string) => {
      setOtpValue(code);
      if (code.length === CELL_COUNT) {
        verifyMode === VerifyMode.PHONE
          ? confirmCode(code)
          : confirmEmailCode(code);
      }
    },
    [setOtpValue, confirmCode, confirmEmailCode, verifyMode],
  );

  return (
    <ScreenWrapper
      headerProps={{headerMarginBottom: vp(52), withLogo: true}}
      withHeader
      withTopInsets
      withBottomInset
      withStatusBar>
      <AppText
        style={styles.title}
        variant={TextVariant.H4_G}
        color={TextColors.A100}
        fontWeight={FontWeight.W500}>
        {intl.formatMessage({
          id: 'phoneNumberVerify.title',
          defaultMessage: 'Provide your phone digits',
        })}
      </AppText>
      <AppText
        variant={TextVariant.S_R}
        color={TextColors.G090}
        style={styles.label}>
        {intl.formatMessage({
          id: 'phoneNumberVerify.codeSentTo',
          defaultMessage: 'The code is sent to',
        })}
      </AppText>
      <AppText
        style={styles.desc}
        variant={TextVariant.H4_G}
        color={TextColors.A100}
        fontWeight={FontWeight.W400}>
        {verifyMode === VerifyMode.PHONE
          ? params.phoneNumber.replace('  ', '')
          : authUser?.email}
      </AppText>
      <View>
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
      <View style={styles.resendBlock}>
        <ResendField
          onPress={handleResend}
          onPressSendCodeToEmail={handlePressSendCodeToEmail}
          verifyMode={verifyMode}
        />
      </View>
      <View style={GLOBAL_STYLES.flex_1} />

      <Button
        variant={ButtonVariant.GRAY}
        containerStyle={isLoading ? styles.button : styles.transparentButton}
        isLoading={isLoading}
        disabled={true}
        onPress={
          verifyMode === VerifyMode.PHONE ? confirmCode : confirmEmailCode
        }
        width="100%"
        title=""
      />
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  title: {
    lineHeight: 50,
    marginBottom: vp(20),
  },
  label: {
    lineHeight: 20,
  },
  desc: {
    marginBottom: vp(30),
    marginTop: vp(13),
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
  error: {
    marginTop: 8,
  },
  resendSection: {
    marginTop: vp(27),
  },
  resendBlock: {
    marginTop: vp(38),
  },
  button: {
    marginBottom: vp(25),
  },
  transparentButton: {
    opacity: 0,
  },
});
