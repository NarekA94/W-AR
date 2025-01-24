import React, {FC} from 'react';
import {useIntl} from 'react-intl';
import {KeyboardAvoidingView, StyleSheet, View} from 'react-native';
import {AppText, Box, Button, ScreenWrapper, TextField} from '~/components';
import {AuthStackParamProps, AuthStackRoutes} from '~/navigation';
import {FontWeight, GLOBAL_STYLES, TextVariant} from '~/theme';
import LockIcon from '~/assets/images/lock.svg';
import {useResetPasswordForm} from './hooks';
import MessageIcon from '~/assets/images/message.svg';
import {IS_IOS} from '~/constants/layout';

export const ResetPassword: FC<
  AuthStackParamProps<AuthStackRoutes.ResetPassword>
> = () => {
  const intl = useIntl();
  const {form, handleSubmit, isLoading} = useResetPasswordForm();

  return (
    <ScreenWrapper withTopInsets withBottomInset withHeader withStatusBar>
      <KeyboardAvoidingView
        behavior={IS_IOS ? 'padding' : undefined}
        style={GLOBAL_STYLES.flex_1}>
        <AppText
          style={styles.title}
          variant={TextVariant['24_5A']}
          fontWeight={FontWeight.W600}>
          {intl.formatMessage({
            id: 'resetPassword.title',
            defaultMessage: 'Reset password',
          })}
        </AppText>
        <Box containerStyle={styles.boxStyles} radius={100} angle={160}>
          <View style={GLOBAL_STYLES.flex_1_center}>
            <LockIcon />
          </View>
        </Box>
        <TextField
          icon={MessageIcon}
          name="email"
          control={form.control}
          label={intl.formatMessage({
            id: 'resetPassword.email.title',
            defaultMessage: 'Email address',
          })}
          placeholder={intl.formatMessage({
            id: 'auth.login.emailPlaceholder',
            defaultMessage: 'Email...',
          })}
          withTrim
        />
        <View style={GLOBAL_STYLES.flex_1} />
        <Button
          containerStyle={styles.button}
          onPress={handleSubmit}
          isLoading={isLoading}
          title={intl.formatMessage({
            id: 'resetPassword.title',
            defaultMessage: 'Reset password',
          })}
          withImageBackground
          disabled={!form.formState.isValid}
        />
      </KeyboardAvoidingView>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 26,
  },
  boxStyles: {
    width: vp(76),
    height: vp(76),
    marginTop: vp(25),
    marginBottom: vp(27),
  },
  button: {
    marginBottom: vp(25),
  },
});
