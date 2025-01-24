import React, {FC, useState} from 'react';
import {useIntl} from 'react-intl';
import LinearGradient from 'react-native-linear-gradient';
import {Image, StyleSheet, View} from 'react-native';
import {FontWeight, TextVariant, useTheme} from '~/theme';
import Airplane from '~/assets/images/airplane.png';

import {AppText} from '../blocks';
import {WIDTH} from '~/constants/layout';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {
  PanGestureHandler,
  PanGestureHandlerGestureEvent,
} from 'react-native-gesture-handler';
import Animated, {
  runOnJS,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

const iconContainerGradientColors = ['#FFFFFF70', '#66666600'];
const boxHeight = vp(72);

export const CodePushNotification: FC = () => {
  const intl = useIntl();
  const {theme} = useTheme();
  const {top} = useSafeAreaInsets();
  const topInsetToCloseNotification = top + boxHeight * 0.25;
  const [isHidden, setIsHidden] = useState<boolean>(false);

  const translationY = useSharedValue<number>(0);
  const translationFixedValue = useDerivedValue(() => {
    return Math.min(0, translationY.value);
  }, [translationY]);

  const onGestureEvent =
    useAnimatedGestureHandler<PanGestureHandlerGestureEvent>({
      onActive: e => {
        translationY.value = e.translationY;
      },
      onEnd: e => {
        if (
          e.translationY < -topInsetToCloseNotification ||
          e.velocityY < -300
        ) {
          translationY.value = withTiming(-200, {}, isFinished => {
            if (isFinished) {
              runOnJS(setIsHidden)(true);
            }
          });
        } else {
          translationY.value = withTiming(0);
        }
      },
    });

  const rNotificationContainerStyle = useAnimatedStyle(() => {
    return {
      transform: [{translateY: translationFixedValue.value}],
    };
  });

  if (isHidden) {
    return null;
  }

  return (
    <PanGestureHandler onGestureEvent={onGestureEvent}>
      <Animated.View
        style={[
          styles.container,
          {backgroundColor: theme.colors.background.gray, top: top + vp(9)},
          rNotificationContainerStyle,
        ]}>
        <LinearGradient
          colors={iconContainerGradientColors}
          style={styles.iconContainer}
          angle={120}
          useAngle
          locations={[0, 0.7]}>
          <Image source={Airplane} style={styles.icon} />
        </LinearGradient>
        <View style={styles.textContainer}>
          <AppText variant={TextVariant.P_M} fontWeight={FontWeight.W600}>
            {intl.formatMessage({
              id: 'code.push.notification.title.bold',
              defaultMessage:
                'We have found a new version of the\n application for you.',
            })}
            <AppText variant={TextVariant.P_M}>
              {intl.formatMessage({
                id: 'code.push.notification.title',
                defaultMessage: 'The update will\n be downloaded in a moment',
              })}
            </AppText>
          </AppText>
        </View>
      </Animated.View>
    </PanGestureHandler>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderRadius: vp(8),
    position: 'absolute',
    width: WIDTH - vp(32),
    alignSelf: 'center',
    height: boxHeight,
    alignItems: 'center',
  },
  iconContainer: {
    height: '100%',
    justifyContent: 'center',
    paddingLeft: vp(17),
    paddingRight: vp(20),
    borderRadius: vp(8),
    alignItems: 'center',
  },
  icon: {
    width: vp(45),
    height: vp(56),
  },

  textContainer: {
    justifyContent: 'center',
  },
});
