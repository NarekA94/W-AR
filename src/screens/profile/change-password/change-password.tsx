import React, {FC, useCallback, useMemo} from 'react';
import {useIntl} from 'react-intl';
import {KeyboardAvoidingView, ScrollView, StyleSheet, View} from 'react-native';
import {
  AppText,
  BoxIcon,
  Button,
  HintProp,
  PasswordField,
  ScreenWrapper,
} from '~/components';
import {GLOBAL_STYLES, TextVariant} from '~/theme';
import PasswordIcon from '~/assets/images/password.svg';
import {useChangePasswordForm} from './hooks';
import {IS_IOS} from '~/constants/layout';
import {useController} from 'react-hook-form';
import {useFocusEffect} from '@react-navigation/native';
import {setAdjustNothing, setAdjustPan} from 'rn-android-keyboard-adjust';

export const ChangePasswordScreen: FC = () => {
  const intl = useIntl();
  const {form, handleSubmit, isLoading} = useChangePasswordForm();
  const oldPass = useController({name: 'oldPassword', control: form.control});
  const newPass = useController({name: 'password', control: form.control});
  const repeatPassword = useController({
    name: 'repeatPassword',
    control: form.control,
  });
  const isValid = useMemo(() => {
    return (
      oldPass.fieldState.isDirty &&
      !oldPass.fieldState.invalid &&
      newPass.fieldState.isDirty &&
      !newPass.fieldState.invalid &&
      repeatPassword.fieldState.isDirty
    );
  }, [oldPass, newPass, repeatPassword]);

  const onSubmit = useCallback(() => {
    if (repeatPassword.fieldState.error?.message) {
      form.setError('repeatPassword', {
        message: repeatPassword.fieldState.error?.message || '',
        type: 'server',
      });
      return;
    }
    handleSubmit();
  }, [handleSubmit, form, repeatPassword]);

  const hints: HintProp[] = useMemo(
    () => [
      {
        name: 'minCharacters',
        label: intl.formatMessage({
          id: 'validations.password.minCharacters',
        }),
      },
      {
        name: 'uppercase',
        label: intl.formatMessage({
          id: 'validations.password.uppercase',
        }),
      },
      {
        name: 'digit',
        label: intl.formatMessage({
          id: 'validations.password.digit',
        }),
      },
      {
        name: 'lowercase',
        label: intl.formatMessage({
          id: 'validations.password.lowercase',
        }),
      },
    ],
    [],
  );
  useFocusEffect(
    React.useCallback(() => {
      setAdjustPan();

      return () => {
        setAdjustNothing();
      };
    }, []),
  );

  return (
    <ScreenWrapper withHeader dark withTopInsets withBottomInset>
      <KeyboardAvoidingView behavior={IS_IOS ? 'height' : 'height'}>
        <ScrollView>
          <AppText variant={TextVariant.H_5} size={26}>
            {intl.formatMessage({
              id: 'screens.profile.change_password.title',
              defaultMessage: 'Change password',
            })}
          </AppText>
          <BoxIcon containerStyle={styles.box} icon={<PasswordIcon />} />
          <PasswordField
            name="oldPassword"
            label="Current password"
            control={form.control}
            placeholder="Enter current password"
          />
          <PasswordField
            name="password"
            label="New password"
            control={form.control}
            placeholder="Enter new password"
            bottomSpace={0}
            hints={hints}
          />
          <View style={styles.confirm}>
            <PasswordField
              name="repeatPassword"
              label="Confirm new password"
              control={form.control}
              placeholder="Confirm new password"
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <View style={GLOBAL_STYLES.flex_1} />
      <Button
        disabled={!isValid}
        title="Change password"
        withImageBackground
        isLoading={isLoading}
        onPress={onSubmit}
        containerStyle={styles.button}
      />
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  box: {
    marginTop: vp(20),
    marginBottom: vp(26),
  },
  button: {
    marginBottom: vp(25),
  },
  confirm: {
    marginTop: vp(20),
  },
});
