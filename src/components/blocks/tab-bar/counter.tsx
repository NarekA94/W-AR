import React, {FC} from 'react';
import {StyleSheet, View} from 'react-native';
import {AppText} from '../app-text/app-text';
import {TextVariant} from '~/theme';

interface CounterProps {
  count: number;
}

export const Counter: FC<CounterProps> = props => {
  return (
    <View style={styles.root}>
      <AppText variant={TextVariant.P_M}>{props.count}</AppText>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    width: vp(29),
    height: vp(29),
    backgroundColor: '#FF4CD8',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 100,
    position: 'absolute',
    right: -vp(5),
    top: -vp(5),
    paddingTop: 1,
    paddingLeft: 1,
  },
});
