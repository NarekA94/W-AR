import React, {FC} from 'react';
import {StyleSheet, View} from 'react-native';

export const EmptyListBrands: FC = () => {
  return <View style={styles.root} />;
};

const styles = StyleSheet.create({
  root: {
    marginTop: vp(45),
  },
});
