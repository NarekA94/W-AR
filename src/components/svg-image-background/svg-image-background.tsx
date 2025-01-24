import React, {FC} from 'react';
import {StyleProp, StyleSheet, View, ViewStyle} from 'react-native';

interface SvgImageBackgroundProps {
  children?: React.ReactNode;
  containerStyle?: StyleProp<ViewStyle>;
  svgComponent?: any;
}

export const SvgImageBackground: FC<SvgImageBackgroundProps> = ({
  children,
  containerStyle,
  svgComponent,
}) => {
  return (
    <View>
      {svgComponent}
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
