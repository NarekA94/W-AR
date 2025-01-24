import React, {FC, memo, useCallback} from 'react';
import {Image, StyleSheet, View} from 'react-native';
import DeleteItemIcon from '~/assets/images/cart/delete-item.png';
import {AppText, Button} from '~/components';
import {ButtonVariant, GLOBAL_STYLES, TextColors, TextVariant} from '~/theme';

interface DeleteSheetProps {
  close?: () => void;
  onPressDelete: () => void;
}

export const DeleteSheet: FC<DeleteSheetProps> = memo(
  ({close, onPressDelete}) => {
    const handlePressBackToCart = useCallback(() => {
      close?.();
    }, [close]);

    return (
      <>
        <View style={styles.body}>
          <Image style={styles.img} source={DeleteItemIcon} />
          <AppText variant={TextVariant['24_5A']}>Attention!</AppText>
          <AppText
            style={styles.info}
            variant={TextVariant.S_R}
            color={TextColors.G090}>
            Cart contains items from another brand. Do you want to clear cart
            and add this item?
          </AppText>
        </View>

        <View style={GLOBAL_STYLES.row_between}>
          <Button
            onPress={onPressDelete}
            title="Clear Cart"
            width="48%"
            variant={ButtonVariant.GRAY}
          />
          <Button
            onPress={handlePressBackToCart}
            title="Back"
            width="48%"
            withImageBackground
          />
        </View>
      </>
    );
  },
);

const styles = StyleSheet.create({
  img: {
    width: vp(130),
    height: vp(130),
    marginBottom: vp(47),
  },
  body: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  info: {
    marginTop: vp(9),
    marginBottom: vp(39),
    textAlign: 'center',
    width: '80%',
    lineHeight: 18,
  },
});
