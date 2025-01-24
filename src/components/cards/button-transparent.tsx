import React, {FC} from 'react';
import {Defs, LinearGradient, Path, Stop, Svg} from 'react-native-svg';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {AppText} from '~/components';
import {FontWeight, TextColors, TextVariant, useTheme} from '~/theme';
import ArrowRight from '~/assets/images/arrowRight.svg';

interface LearnMoreProps {
  onPress?: () => void;
  withDescription?: boolean;
  disabled?: boolean;
}

export const ButtonTransparent: FC<LearnMoreProps> = ({
  onPress,
  withDescription,
  disabled,
}) => {
  const {
    theme: {colors},
  } = useTheme();
  return (
    <TouchableOpacity disabled={disabled} onPress={onPress}>
      <Svg width="170" height="62" viewBox="0 0 170 62" fill="none">
        <Path
          d="M20.7559 14.4061C24.5716 5.6566 33.2096 0 42.7549 0H179.245C188.79 0 197.428 5.6566 201.244 14.4061L222 62H0L20.7559 14.4061Z"
          fill="url(#paint0_linear_12882_66172)"
        />
        <Defs>
          <LinearGradient
            id="paint0_linear_12882_66172"
            x1="34.4483"
            y1="5.50001"
            x2="167.17"
            y2="57.8765"
            gradientUnits="userSpaceOnUse">
            <Stop stopOpacity="0.08" />
            <Stop offset="1" stopColor="white" stopOpacity="0" />
          </LinearGradient>
        </Defs>
      </Svg>
      <View style={styles.title}>
        {withDescription && (
          <AppText
            variant={TextVariant.P}
            fontWeight={FontWeight.W600}
            color={TextColors.B100}>
            DESCRIPTION
          </AppText>
        )}

        <ArrowRight
          style={[styles.icon, !withDescription && styles.noDesc]}
          color={colors.textColors.B100}
        />
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
    flexDirection: 'row',
    paddingLeft: vp(15),
  },
  icon: {marginTop: -2, marginLeft: vp(15)},
  noDesc: {
    position: 'absolute',
    left: vp(40),
  },
});
