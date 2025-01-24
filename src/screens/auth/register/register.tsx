import React, {
  FC,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  Image,
  KeyboardAvoidingView,
  StyleSheet,
  TouchableOpacity,
  View,
  ScrollView,
  Platform,
} from 'react-native';
import {
  AppText,
  Button,
  CheckBox,
  HintProp,
  PasswordField,
  TextField,
  Toast,
  ToastRef,
} from '~/components';
import {useIntl} from 'react-intl';
import {FontWeight, GLOBAL_STYLES, TextColors, TextVariant} from '~/theme';
import {Edge, SafeAreaView} from 'react-native-safe-area-context';
import {AuthStackParamProps, AuthStackRoutes} from '~/navigation';
import Logo from '~/assets/images/logo.png';
import {useAuthForm} from './hooks';
import MessageIcon from '~/assets/images/message.svg';
import {IS_IOS} from '~/constants/layout';
import {useKeyboard} from '~/hooks/useKeyboard';
import {PrivacyUrl} from '~/config/privacy';

const edges: Edge[] = ['bottom', 'top'];

export const RegisterScreen: FC<
  AuthStackParamProps<AuthStackRoutes.RegisterScreen>
> = ({navigation, route}) => {
  const {params} = route;
  const toastRef = useRef<ToastRef>(null);
  const {form, handleSubmit, isLoading} = useAuthForm();
  const intl = useIntl();
  const [isAgreeWithPrivacy, setIsAgreeWithPrivacy] = useState<boolean>(false);
  const {isKeyboardOpen} = useKeyboard();

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

  const handlePressSignIn = useCallback(() => {
    navigation.navigate(AuthStackRoutes.LoginScreen);
  }, []);

  useEffect(() => {
    if (params?.showLocationAlert && Platform.OS === 'android') {
      toastRef.current?.open();
    }
  }, [params]);

  const handlePressPrivacy = useCallback(async () => {
    navigation.navigate(AuthStackRoutes.WebViewScreenAuth, {
      uri: PrivacyUrl,
    });
  }, []);

  const handlePressAgreeWithPrivacy = useCallback(() => {
    setIsAgreeWithPrivacy(prev => !prev);
  }, []);

  return (
    <SafeAreaView style={styles.root} edges={edges}>
      <KeyboardAvoidingView
        behavior={IS_IOS ? 'height' : undefined}
        style={GLOBAL_STYLES.flex_1}>
        <ScrollView
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollViewContent}>
          <View style={styles.header}>
            <Image source={Logo} style={styles.logo} />
            <TouchableOpacity onPress={handlePressSignIn}>
              <AppText
                fontWeight={FontWeight.W800}
                variant={TextVariant.S_R}
                color={TextColors.A100}>
                {intl.formatMessage({
                  id: 'screens.auth.signIn.title',
                  defaultMessage: 'Sign In',
                })}
              </AppText>
            </TouchableOpacity>
          </View>
          <View
            style={[styles.body, !isKeyboardOpen && styles.bodyWithKeyboard]}>
            <AppText
              style={styles.formTitle}
              variant={TextVariant.H4_G}
              fontWeight={FontWeight.W500}
              color={TextColors.A100}>
              {intl.formatMessage({
                id: 'auth.createAccount',
                defaultMessage: 'Create an account',
              })}
            </AppText>
            <TextField
              icon={MessageIcon}
              name="email"
              keyboardType="email-address"
              autoCompleteType="email"
              control={form.control}
              placeholder={intl.formatMessage({
                id: 'auth.login.emailPlaceholder',
                defaultMessage: 'Email...',
              })}
              withTrim
            />
            <PasswordField
              trigger={form.trigger}
              name="password"
              control={form.control}
              placeholder={intl.formatMessage({
                id: 'auth.login.passwordPlaceholder',
                defaultMessage: 'Password',
              })}
              hints={hints}
              bottomSpace={0}
            />
            <View
              style={[
                styles.privacyBox,
                isKeyboardOpen && styles.privacyBoxWithKeyboard,
              ]}>
              <CheckBox
                onPress={handlePressAgreeWithPrivacy}
                isSelected={isAgreeWithPrivacy}
              />
              <AppText
                style={styles.privacy}
                variant={TextVariant.S_R}
                color={TextColors.A045}>
                {intl.formatMessage({
                  id: 'auth.privacy.body',
                  defaultMessage: 'I agree to the',
                })}
                <AppText
                  onPress={handlePressPrivacy}
                  style={styles.privacy}
                  variant={TextVariant.S_R}
                  color={TextColors.A100}>
                  {' '}
                  {intl.formatMessage({
                    id: 'auth.privacy.button',
                    defaultMessage: 'privacy policy',
                  })}
                </AppText>
              </AppText>
            </View>
            <AppText
              style={styles.otpOut}
              variant={TextVariant['10_4A']}
              color={TextColors.A045}>
              {intl.formatMessage({
                id: 'auth.privacy.otp_out',
                defaultMessage:
                  'By accepting our privacy policy, you consent to receive our marketing notifications. You can opt-out at any time in the settings.',
              })}
            </AppText>
            <Button
              onPress={handleSubmit}
              isLoading={isLoading}
              title={intl.formatMessage({
                id: 'screens.auth.signUp.title',
                defaultMessage: 'Sign Up',
              })}
              withImageBackground
              disabled={!form.formState.isValid || !isAgreeWithPrivacy}
              containerStyle={[isKeyboardOpen && styles.button]}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      <Toast
        message={intl.formatMessage({
          id: 'screens.auth.locationConfirmed',
          defaultMessage: 'Your location was successfully confirmed!',
        })}
        ref={toastRef}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  root: {
    ...GLOBAL_STYLES.horizontal_20,
    ...GLOBAL_STYLES.flex_1,
  },
  scrollViewContent: {flexGrow: 1, justifyContent: 'center'},
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
    zIndex: 9,
  },
  formTitle: {
    marginBottom: vp(20),
    lineHeight: 34,
  },
  body: {
    flex: 1,
    justifyContent: 'center',
  },
  bodyWithKeyboard: {
    marginTop: vp(-57),
  },
  privacyBox: {
    ...GLOBAL_STYLES.row_vertical_center,
    marginTop: vp(32),
    marginBottom: vp(8),
  },
  privacy: {
    marginLeft: vp(12),
    lineHeight: 14,
    marginTop: 2,
  },
  privacyBoxWithKeyboard: {
    marginVertical: vp(20),
  },
  otpOut: {
    marginBottom: vp(20),
    lineHeight: 14,
  },
  button: {
    marginBottom: vp(16),
  },
});
