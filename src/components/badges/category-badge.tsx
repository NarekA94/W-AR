import React, {FC, memo} from 'react';
import {StyleSheet, View} from 'react-native';
import {AppText} from '..';
import {TextVariant} from '~/theme';

interface CategoryBadgeProps {
  cost?: number;
}

export const CategoryBadge: FC<CategoryBadgeProps> = memo(props => {
  return (
    <View style={styles.root}>
      <View style={styles.body}>
        <AppText style={styles.cost} variant={TextVariant.P_M}>
          {props.cost}
        </AppText>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  root: {
    width: vp(35),
    height: vp(35),
    borderRadius: 100,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#FF4CD8',
    padding: 2,
  },
  body: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    backgroundColor: '#FF4CD8',
    borderRadius: 100,
  },
  cost: {
    marginTop: vp(2),
  },
});
