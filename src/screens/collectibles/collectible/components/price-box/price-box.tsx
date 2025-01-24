import React, {FC, memo} from 'react';
import {
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import {AppText, Box} from '~/components';
import {TextVariant} from '~/theme';
import ButtonBackGround from '~/assets/images/buttons/small-bg.png';

interface PriceBoxProps {
  price?: string | number;
  onPressBuy?: () => void;
}

export const PriceBox: FC<PriceBoxProps> = memo(({price, onPressBuy}) => {
  return (
    <Box containerStyle={styles.box}>
      <View style={styles.root}>
        <AppText style={styles.price} withGradient variant={TextVariant.H3_A}>
          $ {price}
        </AppText>
        <ImageBackground style={styles.imageStyle} source={ButtonBackGround}>
          <TouchableOpacity onPress={onPressBuy} style={styles.button}>
            <AppText variant={TextVariant.M_B}>Buy</AppText>
          </TouchableOpacity>
        </ImageBackground>
      </View>
    </Box>
  );
});

const styles = StyleSheet.create({
  box: {
    height: vp(80),
  },
  price: {
    fontSize: 30,
  },
  imageStyle: {
    height: vp(50),
    width: vp(158),
    borderRadius: 18,
  },
  root: {
    flex: 1,
    borderColor: 'red',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: vp(19),
    paddingRight: vp(15),
  },
  button: {
    height: vp(50),
    width: vp(158),
    justifyContent: 'center',
    alignItems: 'center',
  },
  containerStyle: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
