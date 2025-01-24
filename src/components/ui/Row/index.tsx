import React from 'react';

import {StyleProp, View, ViewStyle} from 'react-native';
import {GLOBAL_STYLES} from '~/theme';

type Props = {
  style?: StyleProp<ViewStyle>;
  children: React.ReactNode;
};

export const Row = ({style, children}: Props) => {
  return <View style={[GLOBAL_STYLES.row, style]}>{children}</View>;
};
