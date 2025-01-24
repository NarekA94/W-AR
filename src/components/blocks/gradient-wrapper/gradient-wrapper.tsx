import React, {FC, PropsWithChildren} from 'react';
import LinearGradient from 'react-native-linear-gradient';
import {GLOBAL_STYLES} from '~/theme';

const defaultColors = [
  'rgba(187, 110, 185, 0.2)',
  'rgba(0, 0, 0, 1)',
  'rgba(0, 0, 0, 1)',
];
const Start = {x: 0, y: 0};
const End = {x: 0, y: 1};
const Locations = [0, 0.55, 1];

interface GradientWrapper extends PropsWithChildren {
  colors?: string[];
  locations?: number[];
}

export const GradientWrapper: FC<GradientWrapper> = ({
  children,
  colors = defaultColors,
  locations = Locations,
}) => {
  return (
    <LinearGradient
      colors={colors}
      start={Start}
      end={End}
      locations={locations}
      style={GLOBAL_STYLES.flex_1}>
      {children}
    </LinearGradient>
  );
};
