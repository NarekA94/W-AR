import React, {FC} from 'react';
import {StyleSheet, View} from 'react-native';
import {TextVariant, useTheme} from '~/theme';
import {AppText} from '../app-text/app-text';

interface EffectProps {
  title: string;
}

export const Effect: FC<EffectProps> = props => {
  const {
    theme: {colors},
  } = useTheme();
  return (
    <View style={[styles.root, {borderColor: colors.border.E005}]}>
      <AppText variant={TextVariant.M_R}>{props.title}</AppText>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    paddingLeft: 14,
    paddingRight: 12,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
    borderWidth: 2,
    borderRadius: 12,
  },
});
