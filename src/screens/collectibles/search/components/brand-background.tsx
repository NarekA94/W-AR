import React, {FC, PropsWithChildren} from 'react';
import LinearGradient from 'react-native-linear-gradient';
import {StyleProp, ViewStyle} from 'react-native';

interface BrandBackgroundProps extends PropsWithChildren {
  gradientStyle?: StyleProp<ViewStyle> | undefined;
  colors?: (string | number)[];
}

export const BrandBackground: FC<BrandBackgroundProps> = ({
  children,
  gradientStyle,
  colors = ['#A1E0FB', '#68ED9E'],
}) => {
  return (
    <LinearGradient
      style={gradientStyle}
      colors={colors}
      start={{x: 0, y: 0}}
      end={{x: 0, y: 1}}>
      {children}
    </LinearGradient>
  );
};
