import React, {FC, useCallback} from 'react';
import {useIntl} from 'react-intl';
import {StyleSheet, View} from 'react-native';
import {AppText, Button, PhoneField, ScreenWrapper} from '~/components';
import {useKeyboard} from '~/hooks/useKeyboard';
import {useAppDispatch} from '~/store/hooks';
import {logOut} from '~/store/reducers';
import {FontWeight, GLOBAL_STYLES, TextColors, TextVariant} from '~/theme';
import {usePhoneNumberForm} from './hooks';

export const PhoneNumberScreen: FC = () => {
  const intl = useIntl();
  const dispatch = useAppDispatch();
  const {form, handleSubmit, isLoading} = usePhoneNumberForm();
  const {keyboardHeight} = useKeyboard();
  const handleGoBack = useCallback(() => {
    dispatch(logOut());
    return false;
  }, []);
  return (
    <ScreenWrapper
      headerProps={{
        headerMarginBottom: vp(40),
        handleBackPressed: handleGoBack,
        withLogo: true,
      }}
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
          id: 'phoneNumber.title',
          defaultMessage: 'Provide your phone digits',
        })}
      </AppText>
      <AppText
        style={styles.desc}
        variant={TextVariant.S_R}
        color={TextColors.G090}>
        {intl.formatMessage({
          id: 'phoneNumber.description',
          defaultMessage:
            'Make sure you have access to that number to receive the confirmation code.',
        })}
      </AppText>
      <PhoneField
        name="phone"
        placeholder="+1   (000) 000-0000"
        control={form.control}
        keyboardType="phone-pad"
      />
      <View style={GLOBAL_STYLES.flex_1} />

      <Button
        containerStyle={{marginBottom: keyboardHeight || vp(25)}}
        isLoading={isLoading}
        disabled={!form.formState.isValid}
        onPress={handleSubmit}
        withImageBackground
        width="100%"
        title={intl.formatMessage({
          id: 'auth.login.next',
          defaultMessage: 'Next',
        })}
      />
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  title: {
    marginBottom: vp(20),
  },
  desc: {
    marginBottom: vp(63),
  },
});
