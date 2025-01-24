import React, {FC, useCallback} from 'react';
import {AppText, ScreenWrapper} from '~/components/blocks';
import {useIntl} from 'react-intl';

import {ScrollView, StyleSheet, View} from 'react-native';
import {FontWeight, TextVariant} from '~/theme';
import {AccountBlock} from '~/components';
import Contact from '~/assets/images/contact.svg';
import Info from '~/assets/images/info.svg';
import {InfoBlock} from './components/info-block';
import {ProfileFooter} from './components/footer';
import {TermsUrl} from '~/config/privacy';
import {UserStackParamProps, UserStackRoutes} from '~/navigation';

const textGradient = [
  'rgba(255, 255, 255, 0.3)',
  'rgba(255, 255, 255, 1)',
  'rgba(255, 255, 255, 0.3)',
];

export const ProfileScreen: FC<
  UserStackParamProps<UserStackRoutes.Profile>
> = ({navigation}) => {
  const intl = useIntl();

  const handlePressLegal = useCallback(() => {
    navigation.navigate(UserStackRoutes.WebViewScreen, {
      uri: TermsUrl,
    });
  }, []);

  const handlePressContactUs = useCallback(() => {
    navigation.navigate(UserStackRoutes.ContactUs);
  }, [navigation]);

  return (
    <>
      <ScreenWrapper withHeader withTopInsets>
        <ScrollView
          contentContainerStyle={styles.scroll}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}>
          <AppText
            variant={TextVariant.H_5}
            gradientColors={textGradient}
            fontWeight={FontWeight.W600}
            size={26}
            style={styles.styleProfile}>
            {intl.formatMessage({
              id: 'screens.profile.title',
              defaultMessage: 'Profile',
            })}
          </AppText>
          <AppText variant={TextVariant.H_6_W5} style={styles.textStyle}>
            {intl.formatMessage({
              id: 'screens.profile.myInfo',
              defaultMessage: 'My info',
            })}
          </AppText>
          <InfoBlock />

          <View>
            <AppText variant={TextVariant.H_6_W5} style={styles.heading}>
              {intl.formatMessage({
                id: 'screens.profile.app',
                defaultMessage: 'App',
              })}
            </AppText>
            <AccountBlock
              title={intl.formatMessage({
                id: 'screens.profile.contactUs',
                defaultMessage: 'Contact US',
              })}
              onPress={handlePressContactUs}
              svgIcon={<Contact />}
              withArrow={true}
            />
            <AccountBlock
              title={intl.formatMessage({
                id: 'screens.profile.legal',
                defaultMessage: 'Legal',
              })}
              onPress={handlePressLegal}
              svgIcon={<Info />}
              withArrow={true}
            />
          </View>
          <ProfileFooter />
        </ScrollView>
      </ScreenWrapper>
    </>
  );
};

const styles = StyleSheet.create({
  infotext: {
    marginTop: vp(28),
    marginBottom: vp(14),
  },
  settingsStyle: {
    marginBottom: vp(32),
    marginTop: vp(32),
  },
  textStyle: {
    marginBottom: vp(14),
  },
  styleProfile: {
    marginBottom: vp(28),
  },
  scroll: {
    paddingBottom: vp(35),
  },
  heading: {
    marginBottom: vp(14),
    marginTop: vp(20),
  },
});
