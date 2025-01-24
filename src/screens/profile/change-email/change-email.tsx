import React, {FC} from 'react';
import {useIntl} from 'react-intl';
import {KeyboardAvoidingView, ScrollView, StyleSheet, View} from 'react-native';
import {
  AppText,
  BoxIcon,
  Button,
  PasswordField,
  ScreenWrapper,
  TextField,
} from '~/components';
import {FontWeight, GLOBAL_STYLES, TextColors, TextVariant} from '~/theme';
import EmailIcon from '~/assets/images/email.svg';
import {useGetAuthUser} from '~/hooks/useGetAuthUser';
import {useChangeEmailForm} from './hooks';
import {IS_IOS} from '~/constants/layout';
import {useFocusEffect} from '@react-navigation/native';
import {setAdjustNothing, setAdjustPan} from 'rn-android-keyboard-adjust';

export const ChangeEmailScreen: FC = () => {
  const intl = useIntl();
  const {authUser} = useGetAuthUser();
  const {form, handleSubmit, isLoading} = useChangeEmailForm();

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
              id: 'screens.profile.change_email.title',
              defaultMessage: 'Change email',
            })}
          </AppText>
          <BoxIcon containerStyle={styles.box} icon={<EmailIcon />} />
          <AppText variant={TextVariant.S_R} color={TextColors.G090}>
            {intl.formatMessage({
              id: 'screens.profile.change_email.current',
              defaultMessage: 'Current email',
            })}
          </AppText>
          <AppText
            style={styles.current}
            variant={TextVariant.H4_G}
            color={TextColors.A100}
            fontWeight={FontWeight.W400}>
            {authUser?.email}
          </AppText>
          <TextField
            name="email"
            control={form.control}
            label="New email"
            placeholder="New email"
            withTrim
          />
          <PasswordField
            name="password"
            label="Password"
            control={form.control}
            placeholder="Enter your password"
            bottomSpace={0}
          />
        </ScrollView>
      </KeyboardAvoidingView>
      <View style={GLOBAL_STYLES.flex_1} />
      <Button
        disabled={!form.formState.isValid}
        title="Change email"
        withImageBackground
        isLoading={isLoading}
        onPress={handleSubmit}
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
  current: {
    marginTop: vp(12),
    marginBottom: vp(24),
  },
  button: {
    marginBottom: vp(25),
  },
});
