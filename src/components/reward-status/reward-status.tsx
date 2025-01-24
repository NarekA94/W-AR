import React, {FC, memo} from 'react';
import {StyleSheet, View} from 'react-native';
import {FontWeight, TextVariant} from '~/theme';
import {AppText} from '..';

interface RewardStatusProps {
  title: string;
  color?: string;
  backgroundColor?: string;
}

const defaultBgColor = '#FDC250';
const defaultColor = '#000000';

export const RewardStatus: FC<RewardStatusProps> = memo(
  ({backgroundColor = defaultBgColor, color = defaultColor, title}) => {
    return (
      <View style={[styles.root, {backgroundColor: backgroundColor}]}>
        <AppText
          fontWeight={FontWeight.W600}
          style={[styles.title, {color: color}]}
          variant={TextVariant['10_4A']}>
          {title}
        </AppText>
      </View>
    );
  },
);

const styles = StyleSheet.create({
  root: {
    height: vp(24),
    paddingHorizontal: vp(12),
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    textTransform: 'uppercase',
  },
});
