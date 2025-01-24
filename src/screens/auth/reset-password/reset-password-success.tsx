import React, {FC, useCallback} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Image, StyleSheet, View} from 'react-native';
import {GLOBAL_STYLES, TextColors, TextVariant} from '~/theme';
import SuccessIcon from '~/assets/images/register/reset-success.png';
import {AppText, Button} from '~/components';
import {AuthStackParamProps, AuthStackRoutes} from '~/navigation';

export const ResetPasswordSuccess: FC<
  AuthStackParamProps<AuthStackRoutes.ResetPasswordSuccess>
> = ({navigation}) => {
  const handlePressBackToLogin = useCallback(() => {
    navigation.navigate(AuthStackRoutes.LoginScreen);
  }, []);
  return (
    <SafeAreaView style={styles.root} edges={['bottom', 'top']}>
      <View style={GLOBAL_STYLES.flex_1_center}>
        <Image style={styles.image} source={SuccessIcon} />
        <AppText
          style={styles.success}
          withGradient
          variant={TextVariant['24_5A']}>
          Success
        </AppText>
        <AppText color={TextColors.G090} variant={TextVariant.S_R}>
          A new password is sent to your email.
        </AppText>
      </View>
      <Button
        onPress={handlePressBackToLogin}
        withImageBackground
        title="Back to Login"
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  image: {
    width: vp(120),
    height: vp(111),
  },
  root: {
    flex: 1,
    paddingHorizontal: 20,
    paddingBottom: vp(25),
  },
  success: {
    marginTop: vp(75),
    marginBottom: vp(12),
  },
});
