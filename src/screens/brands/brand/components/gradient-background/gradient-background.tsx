import React, {memo} from 'react';
import {StyleSheet, View} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {HEIGHT, WIDTH} from '~/constants/layout';

const BackGradientHeight = HEIGHT * 0.7;

const horizontalGradientColors = [
  'rgba(0, 0, 0, 1)',
  'rgba(139, 224, 174, 0.6)',
  'rgba(139, 224, 174, 0.6)',
  'rgba(0, 0, 0, 1)',
];
const horizontalGradientLocations = [0, 0.3, 0.7, 1];
const horizontalGradientStart = {x: 0, y: 0};
const horizontalGradientEnd = {x: 1, y: 0};

const verticalGradientColors = ['rgba(0, 0, 0, 0.6)', 'transparent', 'black'];

const verticalGradientLocations = [0, 0.7, 1];
const verticalGradientStart = {x: 0, y: 0};
const verticalGradientEnd = {x: 0, y: 1};

export const GradientBackground = memo(() => {
  return (
    <View style={styles.gradientBox}>
      <LinearGradient
        colors={horizontalGradientColors}
        locations={horizontalGradientLocations}
        start={horizontalGradientStart}
        end={horizontalGradientEnd}
        style={styles.gradinet}
      />
      <LinearGradient
        colors={verticalGradientColors}
        locations={verticalGradientLocations}
        start={verticalGradientStart}
        end={verticalGradientEnd}
        style={styles.gradientTop}
      />
    </View>
  );
});

const styles = StyleSheet.create({
  gradientBox: {
    position: 'absolute',
    alignItems: 'center',
    overflow: 'hidden',
    width: WIDTH,
    zIndex: -9,
  },
  gradinet: {
    width: '100%',
    height: BackGradientHeight,
    opacity: 0.5,
  },
  gradientTop: {
    width: '100%',
    height: BackGradientHeight,
    position: 'absolute',
    top: 0,
  },
});
