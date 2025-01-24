import React, {FC, memo} from 'react';
import {
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import BgImage from '~/assets/images/buttons/rounded.png';
import {useTheme} from '~/theme';

interface RadioProps {
  size?: number;
  isSelected?: boolean;
  onPress?: () => void;
}

export const Radio: FC<RadioProps> = memo(
  ({size = vp(18), isSelected, onPress}) => {
    const {theme} = useTheme();
    return (
      <TouchableOpacity
        onPress={onPress}
        style={[
          styles.root,
          {
            width: size,
            height: size,
            borderColor: theme.colors.textColors.A045,
          },
        ]}>
        {isSelected && (
          <ImageBackground source={BgImage} style={styles.image}>
            <View style={styles.dot} />
          </ImageBackground>
        )}
      </TouchableOpacity>
    );
  },
);

const styles = StyleSheet.create({
  root: {
    borderRadius: 100,
    borderWidth: 1,
  },
  image: {
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  dot: {
    width: vp(6),
    height: vp(6),
    borderRadius: 100,
    backgroundColor: 'black',
  },
});
