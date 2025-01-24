import React, {FC, useCallback, useRef} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Linking, StyleSheet, View} from 'react-native';
import Logo from '~/assets/images/logo.svg';
import {AppText, Box, Button, CustomAlert, CustomAlertRef} from '~/components';
import {
  ButtonVariant,
  FontWeight,
  GLOBAL_STYLES,
  TextColors,
  TextVariant,
} from '~/theme';
import {useIntl} from 'react-intl';
import {AuthStackParamProps, AuthStackRoutes} from '~/navigation';

const termsURL = 'https://cannabis.ca.gov/consumers/whats-legal/';

export const PreviewScreen: FC<
  AuthStackParamProps<AuthStackRoutes.PreviewScreen>
> = ({navigation}) => {
  const intl = useIntl();
  const alertRef = useRef<CustomAlertRef>(null);
  const handlePressIamNot = useCallback(() => {
    alertRef.current?.open();
  }, []);

  const handlePressIam = useCallback(() => {
    navigation.navigate(AuthStackRoutes.SelectState);
  }, []);

  const handlePressGoToSite = useCallback(() => {
    Linking.openURL(termsURL);
  }, []);

  return (
    <SafeAreaView style={styles.root} edges={['bottom', 'top']}>
      <Logo style={styles.logo} />
      <Box containerStyle={styles.boxStyles} radius={100} angle={160}>
        <View style={GLOBAL_STYLES.flex_1_center}>
          <AppText variant={TextVariant['24_4A']}>21+</AppText>
        </View>
      </Box>
      <AppText
        variant={TextVariant.H4_G}
        color={TextColors.A100}
        fontWeight={FontWeight.W500}>
        {intl.formatMessage({
          id: 'screens.preview.title',
          defaultMessage: 'Are you over 21 years old?',
        })}
      </AppText>
      <AppText
        style={[styles.info, styles.line_height]}
        variant={TextVariant.S_R}
        color={TextColors.G090}>
        {intl.formatMessage({
          id: 'screens.preview.info.first',
          defaultMessage:
            "You are also allowed to use our service if you are 18 years old and you have physician's recommendation",
        })}
      </AppText>
      <AppText
        style={styles.line_height}
        variant={TextVariant.S_R}
        color={TextColors.G090}>
        {intl.formatMessage({
          id: 'screens.preview.info.second',
          defaultMessage:
            'Smoking may be hazardous to your health. We do not promote smoking and the use of smoking products that can  expose the user to physical or mental harm.',
        })}
      </AppText>
      <View style={GLOBAL_STYLES.flex_1} />
      <View style={styles.buttons}>
        <Button
          onPress={handlePressIamNot}
          variant={ButtonVariant.GRAY}
          width="48%"
          title="I’m not"
        />
        <Button
          width="48%"
          onPress={handlePressIam}
          withImageBackground
          title="I am"
        />
      </View>
      <CustomAlert
        onPress={handlePressGoToSite}
        title={intl.formatMessage({
          id: 'screens.preview.alert.title',
        })}
        message={intl.formatMessage({
          id: 'screens.preview.alert.info',
        })}
        ref={alertRef}
        rightText="Go to site"
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    paddingHorizontal: 20,
    paddingBottom: vp(25),
  },
  buttons: {
    flexDirection: 'row',
    paddingHorizontal: 4,
    justifyContent: 'space-between',
  },
  logo: {
    marginTop: vp(22),
    alignSelf: 'center',
    marginBottom: vp(80),
  },
  boxStyles: {
    width: vp(76),
    height: vp(76),
    marginTop: vp(25),
    marginBottom: vp(38),
  },
  info: {
    marginTop: vp(20),
    marginBottom: vp(22),
  },
  line_height: {
    lineHeight: 18,
  },
});
