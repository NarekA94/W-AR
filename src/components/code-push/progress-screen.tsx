import React, {FC} from 'react';
import {Image, StyleSheet, View} from 'react-native';
import {useIntl} from 'react-intl';
import {RadialGradient} from '../gradient';
import Airplane from '~/assets/images/screen-airplan.png';
import Animated, {
  SharedValue,
  useAnimatedStyle,
  useDerivedValue,
} from 'react-native-reanimated';
import {AppText} from '../blocks';
import {FontWeight, TextColors, TextVariant} from '~/theme';
import {ReText} from 'react-native-redash';
import {fontFamily} from '~/theme/utils/font-family';
import {HEIGHT, WIDTH} from '~/constants/layout';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

const gradientBackgroundColors = ['#292929', '#000000'];

interface CodePushProgressScreenProps {
  progress: SharedValue<number>;
}

export const CodePushProgressScreen: FC<CodePushProgressScreenProps> = ({
  progress,
}) => {
  const intl = useIntl();
  const {top} = useSafeAreaInsets();

  const percentNumber = useDerivedValue(() => {
    return Math.floor(Number(progress.value)).toString() + '%';
  }, [progress]);

  const rProgressStyle = useAnimatedStyle(() => {
    return {width: `${progress.value}%`};
  }, [progress]);

  return (
    <View style={styles.root}>
      <RadialGradient
        colors={gradientBackgroundColors}
        height={HEIGHT + top}
        width={WIDTH}
        containerStyle={styles.container}>
        <View style={styles.iconContainer}>
          <Image source={Airplane} style={styles.icon} />
        </View>
        <View style={styles.progressContainer}>
          <Animated.View style={[styles.progress, rProgressStyle]} />
        </View>
        <ReText text={percentNumber} style={styles.percentNumber} />
        <AppText
          variant={TextVariant.H4_G}
          color={TextColors.A100}
          fontWeight={FontWeight.W400}
          style={styles.title}>
          {intl.formatMessage({
            id: 'code.push.screen.title',
            defaultMessage: 'New Version Available!',
          })}
        </AppText>
        <AppText
          variant={TextVariant.S_R}
          color={TextColors.G090}
          style={styles.description}>
          {intl.formatMessage({
            id: 'code.push.screen.description',
            defaultMessage:
              'A new version of your app is available,\n Please update to latest version',
          })}
        </AppText>
      </RadialGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    backgroundColor: 'black',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    width: vp(121),
    height: vp(162),

    marginTop: vp(-12),
    marginBottom: vp(62),
  },
  icon: {
    width: '100%',
    height: '100%',
  },
  progressContainer: {
    height: vp(6),
    borderRadius: vp(6),
    backgroundColor: '#FFFFFF14',
    width: vp(260),

    marginBottom: vp(17),
  },

  progress: {
    height: '100%',
    borderRadius: vp(6),

    backgroundColor: '#FFFFFF',
  },
  percentNumber: {
    fontFamily: fontFamily[500],
    color: '#FFFFFF',
    marginBottom: vp(50),
  },
  percent: {
    lineHeight: vp(20),
  },
  title: {
    marginBottom: vp(9),
    lineHeight: vp(34),
  },
  description: {
    lineHeight: vp(20),
    textAlign: 'center',
  },
});
