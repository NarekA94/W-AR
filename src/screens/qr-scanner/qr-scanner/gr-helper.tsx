import React, {Component, PropsWithChildren} from 'react';
import LinearGradient from 'react-native-linear-gradient';
import {GLOBAL_STYLES} from '~/theme';

const gradientColors = [
  'transparent',
  'rgba(255, 255, 255, 0.65)',
  'transparent',
];
interface GradientHelperProps extends PropsWithChildren {
  location: number;
}
export default class GradientHelper extends Component<GradientHelperProps> {
  render() {
    const {children, location} = this.props;
    return (
      <LinearGradient
        colors={gradientColors}
        locations={[0, location, 1]}
        style={GLOBAL_STYLES.flex_1}>
        {children}
      </LinearGradient>
    );
  }
}
