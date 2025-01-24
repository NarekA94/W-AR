import React, {FC, memo} from 'react';
import {View, StyleSheet} from 'react-native';
import {HR} from '~/components';

export const SectionSeparatorComponent: FC = memo(() => {
  return (
    <View style={styles.root}>
      <HR />
    </View>
  );
});

const styles = StyleSheet.create({
  root: {
    paddingTop: vp(10),
    paddingBottom: vp(26),
  },
});
