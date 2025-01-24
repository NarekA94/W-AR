import React, {FC, memo} from 'react';
import LinearGradient from 'react-native-linear-gradient';
import {StyleProp, StyleSheet, ViewStyle} from 'react-native';
import {WIDTH} from '~/constants/layout';

const colors = ['#212121', '#525252', '#212121'];
const start = {x: 0, y: 0};
const end = {x: 1, y: 0};

interface HRProps {
  style?: StyleProp<ViewStyle>;
}

export const HR: FC<HRProps> = memo(props => {
  return (
    <LinearGradient
      colors={colors}
      start={start}
      end={end}
      style={[styles.linearGradient, props.style]}
    />
  );
});

const styles = StyleSheet.create({
  linearGradient: {
    height: 1,
    marginTop: vp(19),
    width: WIDTH,
    marginLeft: -20,
  },
});
