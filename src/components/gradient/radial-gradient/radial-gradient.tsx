import React, {FC} from 'react';
import {StyleProp, StyleSheet, View, ViewStyle} from 'react-native';
import {
  Defs,
  Svg,
  RadialGradient as SvgRadialGradient,
  Stop,
  Rect,
} from 'react-native-svg';

interface RadialGradientProps {
  height?: number;
  width?: number | string;
  colors: string[];
  radius?: number;
  children?: React.ReactNode;
  containerStyle?: StyleProp<ViewStyle>;
}

export const RadialGradient: FC<RadialGradientProps> = ({
  width = 105,
  height = 72,
  colors,
  radius = 12,
  children,
  containerStyle,
}) => {
  const renderColors = (item: string, index: number) => (
    <Stop key={index} offset={index} stopColor={item} stopOpacity="1" />
  );
  return (
    <View style={{width, height}}>
      <Svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
        <Defs>
          <SvgRadialGradient
            id="grad"
            cx="50%"
            cy="50%"
            rx="100%"
            ry="100%"
            fx="50%"
            fy="50%"
            gradientUnits="userSpaceOnUse">
            {colors.map(renderColors)}
          </SvgRadialGradient>
        </Defs>
        <Rect
          x="0.5"
          y="0"
          width={width}
          height={height}
          rx={radius}
          fill="url(#grad)"
        />
      </Svg>
      <View style={[styles.child, containerStyle]}>{children}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  child: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
});
