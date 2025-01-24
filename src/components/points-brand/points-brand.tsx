import React, {forwardRef, memo, useCallback, useImperativeHandle} from 'react';
import {View} from 'react-native';
import {AppText} from '..';
import {FontWeight, GLOBAL_STYLES, TextColors} from '~/theme';
import WCoin from '~/assets/images/w_coin.png';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
interface PointsBrandProps {
  points?: number;
  size?: number;
  iconSize?: number;
}
export interface PointsBrandRef {
  playIconAnimation(): void;
}
function formatPoints(points?: number) {
  if (typeof points !== 'number') {
    return '';
  }
  return points.toLocaleString('en-US').replace(',', ' ');
}

export const PointsBrand = memo(
  forwardRef<PointsBrandRef, PointsBrandProps>(
    ({points, size = 44, iconSize = vp(24)}, ref) => {
      const animatedScale = useSharedValue(1);

      useImperativeHandle(ref, () => ({playIconAnimation}));

      const playIconAnimation = useCallback(() => {
        animatedScale.value = withRepeat(withTiming(1.25), 6, true);
      }, [animatedScale]);
      const iconAnimatedStyle = useAnimatedStyle(() => {
        return {
          transform: [{scale: animatedScale.value}],
        };
      });
      return (
        <View style={GLOBAL_STYLES.row}>
          <AppText
            color={TextColors.B100}
            size={size}
            style={{lineHeight: size}}
            fontWeight={FontWeight.W700}>
            {formatPoints(points)}
          </AppText>
          <Animated.Image
            style={[
              {
                width: vp(iconSize),
                height: vp(iconSize),
              },
              iconAnimatedStyle,
            ]}
            source={WCoin}
          />
        </View>
      );
    },
  ),
);
