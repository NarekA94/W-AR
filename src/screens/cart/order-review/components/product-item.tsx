import React, {FC, memo} from 'react';
import {StyleSheet, View} from 'react-native';
import {AppText} from '~/components';
import {GLOBAL_STYLES, TextColors, TextVariant, useTheme} from '~/theme';
import {ToFixNumber} from '~/utils/utils';

interface ProductItemProps {
  name: string;
  price: number | undefined;
  discount?: boolean;
  minus?: boolean;
}

export const ProductItem: FC<ProductItemProps> = memo(props => {
  const {theme} = useTheme();
  return (
    <View style={styles.root}>
      <AppText
        variant={TextVariant.M_R}
        color={TextColors.B060}
        style={props.discount && {color: theme.colors.green.bold}}>
        {props.name}
      </AppText>
      <AppText
        variant={TextVariant.M_R}
        color={TextColors.B060}
        style={props.discount && {color: theme.colors.green.bold}}>
        {props.minus && '-'}${ToFixNumber(props.price)}
      </AppText>
    </View>
  );
});

const styles = StyleSheet.create({
  root: {
    height: vp(34),
    ...GLOBAL_STYLES.row_between,
  },
});
