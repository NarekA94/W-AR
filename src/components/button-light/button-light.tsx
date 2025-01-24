import React, {FC, PropsWithChildren, memo} from 'react';
import {
  ImageBackground,
  StyleProp,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';
import ButtonBackGround from '~/assets/images/buttons/large-bg.png';
import {AppText} from '..';
import {TextVariant} from '~/theme';

interface ButtonLightProps extends PropsWithChildren {
  title?: string;
  width?: string | number;
  onPress?: () => void;
  height?: number;
  containerStyle?: StyleProp<ViewStyle>;
  disabled?: boolean;
}

export const ButtonLight: FC<ButtonLightProps> = memo(
  ({title, onPress, width = '100%', children, containerStyle, disabled}) => {
    return (
      <ImageBackground
        imageStyle={[styles.imageStyle, disabled && styles.disabled]}
        style={[styles.imageBoxStyle, {width: width}, containerStyle]}
        source={ButtonBackGround}>
        <TouchableOpacity
          disabled={disabled}
          onPress={onPress}
          style={styles.button}>
          {children ? (
            children
          ) : (
            <AppText variant={TextVariant.M_B}>{title}</AppText>
          )}
        </TouchableOpacity>
      </ImageBackground>
    );
  },
);

const styles = StyleSheet.create({
  imageBoxStyle: {
    height: vp(50),
    borderRadius: 18,
  },
  imageStyle: {
    width: '100%',
    borderRadius: 18,
  },
  button: {
    height: '100%',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  disabled: {
    opacity: 0.2,
  },
});
