import React, {FC, memo} from 'react';
import {
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import {TextColors, TextVariant} from '~/theme';
import {AppText} from '..';
import ImageBg from '~/assets/images/buttons/add.png';
interface AddButtonProps {
  price?: number;
  onPress?: () => void;
}

export const AddButton: FC<AddButtonProps> = memo(({price, onPress}) => {
  return (
    <View style={styles.root}>
      <AppText style={styles.price} variant={TextVariant['24_5A']}>
        ${price}
      </AppText>
      <TouchableOpacity onPress={onPress}>
        <ImageBackground
          resizeMode="contain"
          style={styles.img}
          source={ImageBg}>
          <AppText variant={TextVariant.M_B} color={TextColors.B100}>
            + Add
          </AppText>
        </ImageBackground>
      </TouchableOpacity>
    </View>
  );
});

const styles = StyleSheet.create({
  root: {
    width: vp(90),
    alignItems: 'flex-end',
  },
  price: {
    marginBottom: vp(14),
  },
  img: {
    width: vp(98),
    height: vp(50),
    justifyContent: 'center',
    alignItems: 'center',
  },
});
