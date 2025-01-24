import React, {FC, memo} from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {AppText} from '~/components/blocks';
import {TextVariant} from '~/theme';

const textGradient = [
  'rgba(250, 250, 250, 0.3)',
  'rgba(250, 250, 250, 0.9)',
  'rgba(250, 250, 250, 0.3)',
];

interface ProductsHeaderProps {
  title: string;
  onPressSeeAll?: () => void;
}

export const ProductsHeader: FC<ProductsHeaderProps> = memo(props => {
  return (
    <View style={styles.root}>
      <AppText
        gradientColors={textGradient}
        variant={TextVariant.H_6_W5}
        withGradient>
        {props.title}
      </AppText>
      <TouchableOpacity hitSlop={20} onPress={props.onPressSeeAll}>
        <AppText variant={TextVariant.S_L}>See All</AppText>
      </TouchableOpacity>
    </View>
  );
});

const styles = StyleSheet.create({
  root: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: vp(14),
    marginTop: vp(38),
  },
});
