import React, {FC, useCallback} from 'react';
import {useIntl} from 'react-intl';
import {AppText, Button} from '~/components';
import BackgroundImg from '~/assets/images/force-update-bg.png';
import {FontWeight, GLOBAL_STYLES, TextVariant} from '~/theme';
import {View, ImageBackground, Image, StyleSheet, Linking} from 'react-native';
import Logo from '~/assets/images/logo_gradient.png';
import {IS_IOS} from '~/constants/layout';
import {STORE_URL} from '~/constants/store';

export const ForceUpdateScreen: FC = () => {
  const intl = useIntl();
  const handlePressStoreButton = useCallback(() => {
    if (STORE_URL) {
      Linking.canOpenURL(STORE_URL).then(supported => {
        if (supported) {
          Linking.openURL(STORE_URL!);
        }
      });
    }
  }, []);
  return (
    <View style={styles.container}>
      <ImageBackground
        style={styles.bgImage}
        imageStyle={styles.bgImage}
        source={BackgroundImg}>
        <View style={styles.content}>
          <View style={styles.centerContent}>
            <Image source={Logo} style={styles.logo} />
            <AppText
              style={styles.titleText}
              variant={TextVariant.H2_A}
              fontWeight={FontWeight.W600}>
              {intl.formatMessage({
                id: 'screens.forceupdate.title',
                defaultMessage: 'Update Available',
              })}
            </AppText>

            <AppText style={styles.descriptionText} variant={TextVariant.P_M}>
              {intl.formatMessage({
                id: 'screens.forceupdate.description',
                defaultMessage:
                  'To use the application, you need to update it to the latest version available.',
              })}
            </AppText>
          </View>

          <View style={styles.bottomButton}>
            <Button
              containerStyle={styles.bottomButton}
              onPress={handlePressStoreButton}
              title={
                IS_IOS
                  ? intl.formatMessage({
                      id: 'screens.forceupdate.store.button.ios',
                      defaultMessage: 'Go to AppStore',
                    })
                  : intl.formatMessage({
                      id: 'screens.forceupdate.store.button.android',
                      defaultMessage: 'Go to Google Play Market',
                    })
              }
              withImageBackground
            />
          </View>
        </View>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1000,
    flex: 1,
    justifyContent: 'space-between',
  },

  content: {
    ...GLOBAL_STYLES.horizontal_20,
    ...GLOBAL_STYLES.flex_1,
  },
  logo: {
    width: 121,
    height: 132,
  },
  bgImage: {
    width: '100%',
    height: '100%',
  },

  titleText: {
    textAlign: 'center',
    fontSize: 28,
    paddingTop: 128,
  },
  descriptionText: {
    textAlign: 'center',
    fontSize: 14,
    marginHorizontal: 50,
    marginTop: 18,
    lineHeight: 17,
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  bottomButton: {
    marginBottom: vp(30),
  },
});
