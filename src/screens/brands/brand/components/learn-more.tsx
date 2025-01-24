import React, {FC} from 'react';
import {Defs, LinearGradient, Path, Stop, Svg} from 'react-native-svg';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {AppText} from '~/components';
import {FontWeight, TextColors, TextVariant} from '~/theme';

interface LearnMoreProps {
  onPress?: () => void;
}

export const LearnMore: FC<LearnMoreProps> = ({onPress}) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <Svg width="218" height="47" viewBox="0 0 218 47" fill="none">
        <Path
          opacity="0.15"
          d="M19.6619 12.1953C23.9188 4.65983 31.9033 0 40.5581 0H177.442C186.097 0 194.081 4.65983 198.338 12.1953L218 47H0L19.6619 12.1953Z"
          fill="url(#paint0_linear_12882_66172)"
        />
        <Defs>
          <LinearGradient
            id="paint0_linear_12882_66172"
            x1="109"
            y1="0"
            x2="109"
            y2="47"
            gradientUnits="userSpaceOnUse">
            <Stop />
            <Stop offset="1" stopOpacity="0" />
          </LinearGradient>
        </Defs>
      </Svg>
      <View style={styles.title}>
        <AppText
          variant={TextVariant.P}
          fontWeight={FontWeight.W400}
          color={TextColors.B100}>
          WHERE TO BUY
        </AppText>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  title: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    top: 0,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9,
  },
});
