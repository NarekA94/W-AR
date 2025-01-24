import {Image, StyleSheet, View} from 'react-native';
import React, {FC, useCallback} from 'react';

import CheckMark from '~/assets/images/congraturation-check-mark.png';
import {useIntl} from 'react-intl';
import {AppText, ScreenWrapper} from '../blocks';
import {ButtonVariant, TextColors, TextVariant} from '~/theme';
import {Button} from '../button/button';
import codePush from 'react-native-code-push';

export const CodePushCongratulationScreen: FC = () => {
  const intl = useIntl();
  const handlePressOk = useCallback(() => {
    codePush.restartApp();
  }, []);

  return (
    <View style={styles.root}>
      <ScreenWrapper withBottomInset>
        <View style={styles.container}>
          <View style={styles.iconContainer}>
            <Image source={CheckMark} style={styles.icon} />
          </View>
          <AppText variant={TextVariant.H3_A} style={styles.title}>
            {intl.formatMessage({
              id: 'code.push.congraturation.title',
              defaultMessage: 'Update complete',
            })}
          </AppText>
          <AppText variant={TextVariant.S_L} color={TextColors.A100}>
            {intl.formatMessage({
              id: 'code.push.congraturation.description',
              defaultMessage: 'Application will restart now',
            })}
          </AppText>
        </View>
        <Button
          onPress={handlePressOk}
          withImageBackground
          title={intl.formatMessage({
            id: 'buttons.okay',
            defaultMessage: 'Okay',
          })}
          containerStyle={styles.button}
          variant={ButtonVariant.PRIMARY}
        />
      </ScreenWrapper>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  iconContainer: {
    width: vp(130),
    height: vp(130),

    marginTop: vp(-50),
    marginBottom: vp(100),
  },
  icon: {
    width: '100%',
    height: '100%',
  },
  title: {
    lineHeight: vp(34),
    marginBottom: vp(18),
  },
  desctiption: {
    lineHeight: vp(20),
  },

  button: {
    marginBottom: vp(32),
  },
});
