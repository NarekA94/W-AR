import React, {FC, memo, ReactNode} from 'react';
import {StyleProp, StyleSheet, View, ViewStyle} from 'react-native';
import {GLOBAL_STYLES} from '~/theme';
import {Box} from '../box/box';

interface BoxIcon {
  icon: ReactNode;
  containerStyle?: StyleProp<ViewStyle>;
}

export const BoxIcon: FC<BoxIcon> = memo(({icon, containerStyle}) => {
  return (
    <Box radius={22} containerStyle={[styles.box, containerStyle]}>
      <View style={GLOBAL_STYLES.flex_1_center}>{icon}</View>
    </Box>
  );
});

const styles = StyleSheet.create({
  box: {
    width: vp(76),
    height: vp(76),
  },
});
