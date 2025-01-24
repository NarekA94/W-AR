import React, {FC} from 'react';
import {Pressable, StyleSheet, View} from 'react-native';
import {RadialGradient} from '~/components/gradient';
import {WIDTH} from '~/constants/layout';
import {GLOBAL_STYLES, TextVariant} from '~/theme';
import {AppText} from '../app-text/app-text';

interface RowItemProps {
  title: string;
  value: number | string;
  width?: number;
}

export const RowItem: FC<RowItemProps> = ({width = WIDTH - 48, ...props}) => {
  return (
    <View style={styles.content}>
      <RadialGradient
        height={vp(48)}
        width={width}
        colors={['#fbfcff', '#e4ecfe']}>
        <Pressable style={styles.root}>
          <AppText variant={TextVariant.M_B}>{props.title}</AppText>
          <AppText variant={TextVariant.M_B}>{props.value}</AppText>
        </Pressable>
      </RadialGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  content: {
    marginTop: 8,
  },
  root: {
    paddingHorizontal: 16,
    ...GLOBAL_STYLES.row_between,
    ...GLOBAL_STYLES.flex_1,
  },
});
