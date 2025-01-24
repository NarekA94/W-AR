import {StyleSheet, View} from 'react-native';
import React, {FC, useCallback, useMemo, useState} from 'react';
import {AppText} from '../blocks';
import {
  FontWeight,
  GLOBAL_STYLES,
  TextColors,
  TextVariant,
  useTheme,
} from '~/theme';
import {Button, ResendField, VerifyMode} from '..';
import {useIntl} from 'react-intl';

import {
  CodeField,
  RenderCellOptions,
  useBlurOnFulfill,
  useClearByFocusCell,
  Cursor,
} from 'react-native-confirmation-code-field';

import auth from '@react-native-firebase/auth';
import {unMaskPhoneNumber} from '~/utils/form';
import {useGetAuthUser} from '~/hooks/useGetAuthUser';
import {
  useUpdatePhoneMutation,
  useUpdateUserMutation,
} from '~/store/query/user/userApi';
import {ApiError} from '~/store/types';
import {logger} from '~/utils';
import {CurrentPhoneNumberAndId} from './phone-verification-modal';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

type SecondScreenProps = {
  currentPhoneNumberAndId: CurrentPhoneNumberAndId;
  onSuccessSubmit: () => void;
  onFocusInput: () => void;
  onBlurInput: () => void;
};

const CELL_COUNT = 6;

const SecondScreen: FC<SecondScreenProps> = ({
  currentPhoneNumberAndId,
  onSuccessSubmit,
  onBlurInput,
  onFocusInput,
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>();
  const [otpValue, setOtpValue] = useState('');
  const [verificationId, setVerificationId] = useState(
    currentPhoneNumberAndId.id,
  );
  const {bottom: bottomInset} = useSafeAreaInsets();

  const intl = useIntl();
  const {theme} = useTheme();
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value: otpValue,
    setValue: setOtpValue,
  });

  const {authUser} = useGetAuthUser();
  const [updatePhone] = useUpdatePhoneMutation();
  const [updateUser] = useUpdateUserMutation();

  const ref = useBlurOnFulfill({value: otpValue, cellCount: CELL_COUNT});

  const handleOnFocus = useCallback(() => {
    onFocusInput();
    if (error) {
      setError('');
    }
  }, [error, onFocusInput]);

  const phoneNumberWithFormat = useMemo(
    () => currentPhoneNumberAndId.number.replace('  ', ''),
    [currentPhoneNumberAndId.number],
  );

  const handleResend = useCallback(async () => {
    auth()
      .verifyPhoneNumber(unMaskPhoneNumber(currentPhoneNumberAndId.number))
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
  }, [currentPhoneNumberAndId]);

  const handleSubmit = useCallback(
    (code?: string) => {
      setIsLoading(true);
      const credential = auth.PhoneAuthProvider.credential(
        verificationId,
        code || otpValue,
      );

      auth()
        .signInWithCredential(credential)
        .then(() => {
          if (authUser) {
            updatePhone({
              id: authUser?.id,
              phone: unMaskPhoneNumber(currentPhoneNumberAndId.number),
            })
              .unwrap()
              .then(() => {
                onSuccessSubmit();
                setTimeout(() => {
                  updateUser({id: authUser?.id, phoneConfirmed: true}).unwrap();
                  setIsLoading(false);
                }, 0);
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
      currentPhoneNumberAndId.number,
      otpValue,
      updatePhone,
      updateUser,
      onSuccessSubmit,
    ],
  );

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

  return (
    <>
      <AppText variant={TextVariant.H5_M} style={styles.title}>
        {intl.formatMessage({
          id: 'optCodeModal.title',
          defaultMessage: 'Verify your phone number',
        })}
      </AppText>
      <AppText
        variant={TextVariant.S_R}
        color={TextColors.G090}
        style={styles.description}>
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
        {phoneNumberWithFormat}
      </AppText>
      <View style={styles.cellBoxesContainer}>
        <CodeField
          ref={ref}
          {...props}
          value={otpValue}
          onChangeText={code => {
            setOtpValue(code);
            if (code.length === CELL_COUNT) {
              handleSubmit(code);
            }
          }}
          cellCount={CELL_COUNT}
          keyboardType="number-pad"
          textContentType="oneTimeCode"
          renderCell={renderCell}
          onFocus={handleOnFocus}
          onBlur={onBlurInput}
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
        phoneOnly
        verifyMode={VerifyMode.PHONE}
      />
      <View style={GLOBAL_STYLES.flex_1} />
      <Button
        withImageBackground
        title={intl.formatMessage({
          id: 'phrases.verify',
          defaultMessage: 'Verify',
        })}
        isLoading={isLoading}
        onPress={handleSubmit}
        disabled={true}
        width="100%"
        containerStyle={
          isLoading
            ? [
                styles.button,
                {
                  marginBottom: bottomInset + vp(15),
                },
              ]
            : styles.buttonTransparent
        }
      />
    </>
  );
};

export {SecondScreen};

const styles = StyleSheet.create({
  box: {
    marginTop: vp(20),
    marginBottom: vp(26),
  },
  current: {
    marginTop: vp(12),
    marginBottom: vp(24),
  },
  title: {marginBottom: vp(10), lineHeight: vp(24), marginTop: -vp(17)},
  description: {marginBottom: vp(13), lineHeight: vp(19)},

  cellBoxesContainer: {marginBottom: vp(30)},
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
  button: {marginBottom: vp(20)},
  buttonTransparent: {
    marginBottom: vp(25),
    opacity: 0,
  },
});
