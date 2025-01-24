import React, {FC, useCallback, useMemo} from 'react';
import {useIntl} from 'react-intl';
import {KeyboardAvoidingView, ScrollView, StyleSheet, View} from 'react-native';
import {
  AppText,
  BottomSheet,
  Button,
  ScreenWrapper,
  TextField,
} from '~/components';
import {IS_IOS} from '~/constants/layout';
import {GLOBAL_STYLES, TextColors, TextVariant} from '~/theme';
import {useContactUsForm} from './hooks';
import {setAdjustPan, setAdjustNothing} from 'rn-android-keyboard-adjust';
import {useFocusEffect} from '@react-navigation/native';
import {SendSuccessSheet} from './components/send-success-sheet';
import {UserStackParamProps, UserStackRoutes} from '~/navigation';

export const ContactUsScreen: FC<
  UserStackParamProps<UserStackRoutes.ContactUs>
> = ({navigation}) => {
  const intl = useIntl();
  const {form, isLoading, handleSubmit, bottomSheetModalRef} =
    useContactUsForm();
  const snapPoints = useMemo(() => ['60%'], []);

  useFocusEffect(
    React.useCallback(() => {
      setAdjustPan();

      return () => {
        setAdjustNothing();
      };
    }, []),
  );

  const HandlePressOkay = useCallback(() => {
    bottomSheetModalRef.current?.close();
    navigation.navigate(UserStackRoutes.Profile);
  }, [navigation]);

  return (
    <>
      <ScreenWrapper withHeader withTopInsets withBottomInset>
        <KeyboardAvoidingView
          style={GLOBAL_STYLES.flex_1}
          behavior={IS_IOS ? 'padding' : 'height'}>
          <ScrollView>
            <AppText variant={TextVariant.H_5} size={26}>
              {intl.formatMessage({
                id: 'screens.profile.contact_us.title',
                defaultMessage: 'Contact us',
              })}
            </AppText>
            <AppText
              variant={TextVariant.S_R}
              color={TextColors.G090}
              style={styles.info}>
              {intl.formatMessage({
                id: 'screens.profile.contact_us.info',
                defaultMessage:
                  'If you have any troubles with using service, suggestions or something you would like to share place use form below to tell us. We will send you reply via email',
              })}
            </AppText>
            <TextField
              name="title"
              control={form.control}
              label="Title"
              placeholder="Message title"
              withTrim
            />
            <TextField
              multiline
              name="message"
              control={form.control}
              label="Message"
              placeholder="Enter your message"
            />
            <View style={GLOBAL_STYLES.flex_1} />
          </ScrollView>
        </KeyboardAvoidingView>

        <Button
          disabled={!form.formState.isValid}
          title="Send"
          withImageBackground
          isLoading={isLoading}
          onPress={handleSubmit}
          containerStyle={styles.button}
        />
      </ScreenWrapper>
      <BottomSheet
        ref={bottomSheetModalRef}
        snapPoints={snapPoints}
        withCloseIcon>
        <SendSuccessSheet onPressOkay={HandlePressOkay} />
      </BottomSheet>
    </>
  );
};

const styles = StyleSheet.create({
  info: {
    marginVertical: vp(26),
  },
  button: {
    marginBottom: vp(25),
  },
});
