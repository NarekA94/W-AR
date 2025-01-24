import React, {FC, memo, useCallback} from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {AppText} from '..';
import PlusCircleIcon from '~/assets/images/plus-circle.svg';
import MinusCircleIcon from '~/assets/images/minus-circle.svg';
import {TextColors, TextVariant, useTheme} from '~/theme';

interface CartCounterProps {
  quantity: number;
  onChangeQuantity?: (quantity: number) => void;
}

export const CartCounter: FC<CartCounterProps> = memo(
  ({quantity, onChangeQuantity}) => {
    const {theme} = useTheme();
    const [currentQuantity, setCurrentQuantity] =
      React.useState<number>(quantity);

    const increment = useCallback(() => {
      setCurrentQuantity((prev: number) => prev + 1);
      onChangeQuantity?.(currentQuantity + 1);
    }, [currentQuantity, onChangeQuantity]);

    const decrement = useCallback(() => {
      setCurrentQuantity((prev: number) => {
        if (prev > 1) {
          return prev - 1;
        } else {
          return prev;
        }
      });
      onChangeQuantity?.(currentQuantity - 1);
    }, [currentQuantity, onChangeQuantity]);

    return (
      <View style={styles.root}>
        <TouchableOpacity onPress={decrement}>
          <MinusCircleIcon color={theme.colors.textColors.A060} />
        </TouchableOpacity>
        <View style={styles.body}>
          <AppText variant={TextVariant.M_R} color={TextColors.A100}>
            {currentQuantity}
          </AppText>
        </View>
        <TouchableOpacity onPress={increment}>
          <PlusCircleIcon color={theme.colors.background.primary} />
        </TouchableOpacity>
      </View>
    );
  },
);

const styles = StyleSheet.create({
  root: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  body: {
    height: vp(42),
    width: vp(75),
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 13,
    borderColor: '#454545',
    marginHorizontal: vp(12),
  },
});
