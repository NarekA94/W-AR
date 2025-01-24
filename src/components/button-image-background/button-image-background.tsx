import React, {FC, PropsWithChildren, memo} from 'react';
import {
  StyleProp,
  StyleSheet,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import {SvgImageBackground} from '../svg-image-background/svg-image-background';
import {AppText} from '..';
import {TextVariant} from '~/theme';
import {IS_IOS} from '~/constants/layout';
import ButtonBg from '~/assets/images/buttons/button-background.svg';

interface ButtonImageBackgroundProps extends PropsWithChildren {
  title?: string;
  onPress?: () => void;
  containerStyle?: StyleProp<ViewStyle>;
  disabled?: boolean;
}

export const ButtonImageBackground: FC<ButtonImageBackgroundProps> = memo(
  props => {
    return (
      <TouchableOpacity
        disabled={props.disabled}
        style={[styles.button, props.containerStyle]}
        onPress={props.onPress}>
        <View>
          <SvgImageBackground
            containerStyle={styles.containerStyle}
            svgComponent={<ButtonBg width="100%" height={'100%'} />}>
            {props.children ? (
              props.children
            ) : (
              <AppText variant={TextVariant.M_B}>{props.title}</AppText>
            )}
          </SvgImageBackground>
          {props.disabled && <View style={styles.disable} />}
        </View>
      </TouchableOpacity>
    );
  },
);

const styles = StyleSheet.create({
  button: {
    height: vp(50),
    width: '100%',
    marginBottom: IS_IOS ? 0 : vp(20),
  },
  text: {
    textAlign: 'center',
    marginTop: vp(26),
    marginBottom: vp(62),
    lineHeight: 20,
  },
  containerStyle: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  disable: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'black',
    opacity: 0.7,
  },
});
