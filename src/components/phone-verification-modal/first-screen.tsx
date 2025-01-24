import {Image, StyleSheet, View} from 'react-native';
import React, {FC} from 'react';
import PersonIcon from '~/assets/images/verify-phone-number.png';
import {AppText} from '../blocks';
import {GLOBAL_STYLES, TextVariant} from '~/theme';
import {Button} from '..';
import {useIntl} from 'react-intl';
import {PhoneField} from '../form';
import {usePhoneNumberForm} from './usePhoneNumberForm';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

type FirstScreenProps = {
  onSuccessSubmit: (phoneNumber: string, verificationId: string) => void;
  onFocusInput: () => void;
  onBlurInput: () => void;
};

const FirstScreen: FC<FirstScreenProps> = ({
  onSuccessSubmit,
  onBlurInput,
  onFocusInput,
}) => {
  const {bottom: bottomInset} = useSafeAreaInsets();

  const intl = useIntl();

  const {form, handleSubmit, isLoading} = usePhoneNumberForm(onSuccessSubmit);

  return (
    <>
      <View style={styles.body}>
        <View style={styles.image}>
          <Image style={GLOBAL_STYLES.full_height_width} source={PersonIcon} />
        </View>
      </View>
      <AppText style={styles.title} variant={TextVariant.H5_M}>
        {intl.formatMessage({
          id: 'phoneNumberModal.title',
          defaultMessage:
            'Verify your phone number to unlock\nthe complete WEEDAR experience',
        })}
      </AppText>
      <PhoneField
        name="phone"
        placeholder="+1   (000) 000-0000"
        control={form.control}
        keyboardType="phone-pad"
        isTransparentBackground
        onBlur={onBlurInput}
        onFocus={onFocusInput}
      />
      <View style={GLOBAL_STYLES.flex_1} />
      <Button
        withImageBackground
        disabled={!form.formState.isValid}
        containerStyle={{
          marginBottom: bottomInset + vp(15),
        }}
        isLoading={isLoading}
        onPress={handleSubmit}
        width="100%"
        title={intl.formatMessage({
          id: 'auth.login.next',
          defaultMessage: 'Next',
        })}
      />
    </>
  );
};

export {FirstScreen};

const styles = StyleSheet.create({
  image: {
    width: vp(130),
    height: vp(130),
    marginTop: -vp(50),
  },
  body: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    marginBottom: vp(30),
    marginTop: vp(35),
    lineHeight: vp(24),
  },
  button: {marginTop: vp(40)},
});
