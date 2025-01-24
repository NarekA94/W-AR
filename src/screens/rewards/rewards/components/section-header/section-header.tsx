import React, {FC, memo} from 'react';
import {View, StyleSheet} from 'react-native';
import {AppText} from '~/components';
import {TextColors, TextVariant} from '~/theme';

interface Props {
  sectionName: string;
}

export const SectionHeader: FC<Props> = memo(props => {
  return (
    <View style={styles.root}>
      <View style={{paddingTop: vp(20)}}>
        <AppText variant={TextVariant.S_R} color={TextColors.A060}>
          {props.sectionName}
        </AppText>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  root: {
    paddingBottom: vp(14),
    paddingLeft: vp(2),
  },
});
