import React, {memo, useEffect, useRef} from 'react';
import {StyleSheet, View, Animated} from 'react-native';
import GradientHelper from './gr-helper';

const AnimatedLinerGradient = Animated.createAnimatedComponent(GradientHelper);

export const QrMarker = memo(() => {
  const animatedGradientLocation = useRef(new Animated.Value(0.1)).current;
  const animatedLoop = useRef(
    Animated.loop(
      Animated.sequence([
        Animated.timing(animatedGradientLocation, {
          toValue: 0.9,
          duration: 1000,
          useNativeDriver: false,
        }),
        Animated.timing(animatedGradientLocation, {
          toValue: 0.1,
          duration: 1000,
          useNativeDriver: false,
        }),
      ]),
    ),
  ).current;
  useEffect(() => {
    animatedLoop.start();
    return () => {
      animatedLoop.stop();
    };
  }, []);
  return (
    <View style={styles.root}>
      <AnimatedLinerGradient location={animatedGradientLocation} />
    </View>
  );
});
const styles = StyleSheet.create({
  root: {
    width: vp(280),
    height: vp(240),
  },
});
