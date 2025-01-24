import React, {FC, useCallback} from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
} from 'react-native';
import {AppText, Button, PasswordField, TextField} from '~/components';
import {useIntl} from 'react-intl';
import {FontWeight, GLOBAL_STYLES, TextColors, TextVariant} from '~/theme';
import {Edge, SafeAreaView} from 'react-native-safe-area-context';
import {AuthStackParamProps, AuthStackRoutes} from '~/navigation';
import Logo from '~/assets/images/logo.png';
import {useLoginForm} from './hooks';
import MessageIcon from '~/assets/images/message.svg';
import {IS_IOS} from '~/constants/layout';

const edges: Edge[] = ['bottom', 'top'];

export const LoginScreen: FC<
  AuthStackParamProps<AuthStackRoutes.LoginScreen>
> = ({navigation}) => {
  const {form, handleSubmit, isLoading} = useLoginForm();
  const intl = useIntl();

  const handlePressSignUp = useCallback(() => {
    navigation.navigate(AuthStackRoutes.RegisterScreen);
  }, []);

  const handlePressForgot = useCallback(() => {
    navigation.navigate(AuthStackRoutes.ResetPassword);
  }, []);

  return (
    <SafeAreaView style={styles.root} edges={edges}>
      <KeyboardAvoidingView
        behavior={IS_IOS ? 'padding' : undefined}
        style={GLOBAL_STYLES.flex_1}>
        <View style={styles.header}>
          <Image source={Logo} style={styles.logo} />
          <TouchableOpacity onPress={handlePressSignUp}>
            <AppText
              fontWeight={FontWeight.W800}
              variant={TextVariant.S_R}
              color={TextColors.A100}>
              {intl.formatMessage({
                id: 'screens.auth.signUp.title',
                defaultMessage: 'Sign Up',
              })}
            </AppText>
          </TouchableOpacity>
        </View>
        <View style={styles.body}>
          <AppText
            style={styles.formTitle}
            variant={TextVariant.H4_G}
            fontWeight={FontWeight.W500}
            color={TextColors.A100}>
            {intl.formatMessage({
              id: 'auth.welcome.back',
              defaultMessage: 'Welcome back!',
            })}
          </AppText>
          <TextField
            icon={MessageIcon}
            name="email"
            keyboardType="email-address"
            control={form.control}
            autoCompleteType="email"
            placeholder={intl.formatMessage({
              id: 'auth.login.emailPlaceholder',
              defaultMessage: 'Email...',
            })}
            withTrim
            needFormValidation={false}
          />
          <PasswordField
            trigger={form.trigger}
            name="password"
            control={form.control}
            placeholder={intl.formatMessage({
              id: 'auth.login.passwordPlaceholder',
              defaultMessage: 'Password',
            })}
            bottomSpace={0}
            needFormValidation={false}
          />
          <TouchableOpacity onPress={handlePressForgot} style={styles.forgot}>
            <AppText variant={TextVariant.S_R} color={TextColors.A060}>
              Forgot Password?
            </AppText>
          </TouchableOpacity>
          <Button
            containerStyle={styles.button}
            onPress={handleSubmit}
            isLoading={isLoading}
            title={intl.formatMessage({
              id: 'screens.auth.signIn.title',
              defaultMessage: 'Sign In',
            })}
            withImageBackground
            disabled={!form.formState.isValid}
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  root: {
    ...GLOBAL_STYLES.horizontal_20,
    ...GLOBAL_STYLES.flex_1,
    paddingBottom: vp(30),
  },
  logo: {
    width: vp(183),
    height: vp(32),
  },
  header: {
    marginTop: vp(33),
    marginBottom: vp(40),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  formTitle: {
    marginBottom: vp(20),
  },

  forgot: {
    alignSelf: 'flex-end',
    marginTop: vp(25),
  },
  body: {
    flex: 1,
    justifyContent: 'center',
  },
  button: {
    marginTop: vp(25),
  },
});
