import React, {FC, useMemo} from 'react';
import {BottomSheetBackdropProps} from '@gorhom/bottom-sheet';
import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedStyle,
} from 'react-native-reanimated';
import {Pressable, StyleSheet} from 'react-native';
import {BlurView} from '@react-native-community/blur';
import {useTheme} from '~/theme';

const AnimatedBlurView = Animated.createAnimatedComponent(BlurView);

interface CustomSheetBackdropProps extends BottomSheetBackdropProps {
  close?: () => void;
  blure?: boolean;
}

export const CustomSheetBackdrop: FC<CustomSheetBackdropProps> = ({
  animatedIndex,
  style,
  close,
  blure = true,
}) => {
  const {theme} = useTheme();
  const containerAnimatedStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      animatedIndex.value,
      [0, -1],
      [1, 0],
      Extrapolate.CLAMP,
    ),
  }));

  const containerStyle = useMemo(
    () => [style, styles.root, containerAnimatedStyle],
    [style, containerAnimatedStyle],
  );

  return (
    <Pressable style={styles.root} onPress={close}>
      {blure ? (
        <AnimatedBlurView
          blurType="dark"
          blurAmount={5}
          reducedTransparencyFallbackColor="white"
          style={containerStyle}
        />
      ) : (
        <Animated.View
          style={[
            containerStyle,
            {backgroundColor: theme.colors.textColors.B020},
          ]}
        />
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  root: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  backDrop: {},
});
