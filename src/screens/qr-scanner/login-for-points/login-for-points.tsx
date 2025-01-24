import React, {FC, useCallback} from 'react';
import {useIntl} from 'react-intl';
import {StyleSheet, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {AppText, Button} from '~/components';
import {ButtonVariant, GLOBAL_STYLES, TextColors, TextVariant} from '~/theme';
import GiftIcon from '~/assets/images/qrscanner/gift.svg';
import {AuthStackParamProps, AuthStackRoutes} from '~/navigation';
import {userModel} from '~/storage/models/user';

export const LoginForpoints: FC<
  AuthStackParamProps<AuthStackRoutes.LoginForPoints>
> = ({navigation}) => {
  const intl = useIntl();
  // const {qrToken} = route.params;
  const onNextPress = useCallback(() => {
    // authenticModel.setAuthenticToken(qrToken);
    if (!userModel.getUserRegionId()) {
      navigation.navigate(AuthStackRoutes.PreviewScreen);
    } else {
      navigation.navigate(AuthStackRoutes.RegisterScreen);
    }
  }, [navigation]);
  return (
    <SafeAreaView edges={['top', 'bottom']} style={[GLOBAL_STYLES.flex_1]}>
      <View style={[GLOBAL_STYLES.flex_1, GLOBAL_STYLES.center]}>
        <GiftIcon />
      </View>
      <View style={styles.content}>
        <AppText withGradient variant={TextVariant.H3_A}>
          {intl.formatMessage({
            id: 'authentic.loginForPoints.waiting',
            defaultMessage: 'Your points are waiting for you!',
          })}
        </AppText>
        <AppText
          style={styles.clickOnNext}
          variant={TextVariant.S_R}
          color={TextColors.G090}>
          {intl.formatMessage({
            id: 'authentic.loginForPoints.clickNext',
            defaultMessage:
              'You’ll get your points after registration or login.\nClick on Next to go on.',
          })}
        </AppText>
        <Button
          variant={ButtonVariant.GRAY}
          width="100%"
          onPress={onNextPress}
          title={intl.formatMessage({
            id: 'buttons.next',
            defaultMessage: 'Next',
          })}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 20,
    paddingBottom: vp(30),
  },
  clickOnNext: {
    marginTop: vp(22),
    marginBottom: vp(44),
    lineHeight: 20,
  },
});
