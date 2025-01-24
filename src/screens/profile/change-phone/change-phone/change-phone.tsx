import React, {FC, useEffect, useRef} from 'react';
import {KeyboardAvoidingView, StyleSheet, View, ScrollView} from 'react-native';
import {
  AppText,
  BoxIcon,
  Button,
  PhoneField,
  ScreenWrapper,
} from '~/components';
import {useGetAuthUser} from '~/hooks/useGetAuthUser';
import {FontWeight, GLOBAL_STYLES, TextColors, TextVariant} from '~/theme';
import PhoneIcon from '~/assets/images/smallphone.svg';
import {formatPhoneNumber} from '~/utils/form';
import {usePhoneNumberForm} from './hooks';
import {IS_IOS} from '~/constants/layout';
import {setAdjustNothing, setAdjustResize} from 'rn-android-keyboard-adjust';
import {useKeyboard} from '~/hooks/useKeyboard';

export const ChangePhoneScreen: FC = () => {
  const {authUser} = useGetAuthUser();
  const {form, handleSubmit, isLoading} = usePhoneNumberForm();
  const {isKeyboardOpen} = useKeyboard();
  const scrollRef = useRef<ScrollView>(null);

  React.useEffect(() => {
    setAdjustResize();
    return () => {
      setAdjustNothing();
    };
  }, []);
  useEffect(() => {
    if (isKeyboardOpen) {
      scrollRef.current?.scrollToEnd();
    }
  }, [isKeyboardOpen]);
  return (
    <ScreenWrapper withHeader dark withTopInsets withBottomInset>
      <KeyboardAvoidingView
        style={GLOBAL_STYLES.flex_1}
        behavior={IS_IOS ? 'padding' : undefined}>
        <ScrollView ref={scrollRef} contentContainerStyle={styles.scroll}>
          <View>
            <AppText variant={TextVariant.H_5} size={26}>
              Change phone number
            </AppText>
            <BoxIcon containerStyle={styles.box} icon={<PhoneIcon />} />
            <AppText variant={TextVariant.S_R} color={TextColors.G090}>
              Current phone number
            </AppText>
            <AppText
              style={styles.current}
              variant={TextVariant.H4_G}
              color={TextColors.A100}
              fontWeight={FontWeight.W400}>
              {formatPhoneNumber(authUser?.phone || '')}
            </AppText>
            <PhoneField
              name="phone"
              placeholder="+1   (000) 000-0000"
              control={form.control}
              keyboardType="phone-pad"
              label="New phone number"
            />
          </View>
          <View>
            <Button
              disabled={!form.formState.isValid}
              title="Next"
              withImageBackground
              isLoading={isLoading}
              onPress={handleSubmit}
              containerStyle={styles.button}
            />
          </View>
        </ScrollView>
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
  scroll: {
    flexGrow: 1,
    justifyContent: 'space-between',
  },
});
