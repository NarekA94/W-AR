import React, {FC, memo, PropsWithChildren} from 'react';
import {StyleProp, StyleSheet, View, ViewStyle} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {GLOBAL_STYLES} from '~/theme';

interface BoxProps extends PropsWithChildren {
  containerStyle?: StyleProp<ViewStyle>;
  height?: number | string;
  gradientColorsBottom?: string[];
  angle?: number;
  radius?: number;
}
const TopGradientColor = [
  'rgba(76, 76, 76, 1)',
  'rgba(64, 64, 64, 1)',
  'rgba(0, 0, 0, 1)',
];
const locations = [0, 0.35, 1];

const BottomGradientColos = ['rgba(51, 51, 51, 1)', 'rgba(0, 0, 0, 1)'];

export const Box: FC<BoxProps> = memo(
  ({
    children,
    containerStyle,
    height,
    gradientColorsBottom = BottomGradientColos,
    angle = 170,
    radius = 25,
  }) => {
    return (
      <View style={[{height: height}, containerStyle]}>
        <LinearGradient
          style={[styles.gradientTop, {borderRadius: radius}]}
          useAngle
          angle={angle}
          locations={locations}
          colors={TopGradientColor}>
          <LinearGradient
            style={[styles.gradientBottom, {borderRadius: radius}]}
            colors={gradientColorsBottom}>
            <View style={GLOBAL_STYLES.flex_1}>{children}</View>
          </LinearGradient>
        </LinearGradient>
      </View>
    );
  },
);

const styles = StyleSheet.create({
  gradientTop: {
    flex: 1,
    padding: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gradientBottom: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
