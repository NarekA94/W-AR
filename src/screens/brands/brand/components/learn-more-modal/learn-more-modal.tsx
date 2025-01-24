import React, {FC, useMemo} from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import {AppText} from '~/components';
import {TextVariant, useTheme} from '~/theme';
import CloseIcon from '~/assets/images/close.svg';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {IS_IOS} from '~/constants/layout';
import LinearGradient from 'react-native-linear-gradient';

interface LearnMoreModalProps {
  close?: () => void;
  bgImageUrl?: string;
  description?: string;
  logoUri?: string;
  gradientEndColorHex?: string;
  gradientStartColorHex?: string;
}

export const LearnMoreModal: FC<LearnMoreModalProps> = ({
  close,
  description,
  logoUri,
  gradientEndColorHex,
  gradientStartColorHex,
}) => {
  const {theme} = useTheme();
  const {top, bottom} = useSafeAreaInsets();
  const gradientColors = useMemo(() => {
    if (gradientEndColorHex && gradientStartColorHex) {
      return [gradientStartColorHex, gradientEndColorHex];
    }
    return ['white', 'white'];
  }, [gradientEndColorHex, gradientStartColorHex]);
  return (
    <View
      style={[
        styles.root,
        {paddingTop: IS_IOS ? top : vp(10), paddingBottom: bottom || vp(5)},
      ]}>
      <LinearGradient colors={gradientColors} style={styles.boxStyle}>
        <View style={styles.logoBox}>
          <Image style={styles.logo} source={{uri: logoUri}} />
        </View>

        <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>
          <AppText style={styles.info} variant={TextVariant.S_R}>
            {description}
          </AppText>
        </ScrollView>
        <View style={styles.buttonBox}>
          <TouchableOpacity onPress={close} hitSlop={20} style={styles.circle}>
            <CloseIcon
              color={theme.colors.primary}
              width={vp(14)}
              height={vp(14)}
            />
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  circle: {
    width: vp(50),
    height: vp(50),
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.15)',
  },
  buttonBox: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: vp(22),
  },
  root: {
    paddingHorizontal: vp(12),
  },
  boxStyle: {
    width: '100%',
    height: '100%',
    borderRadius: 30,
  },
  info: {
    textAlign: 'left',
    marginBottom: 30,
    lineHeight: vp(17),
  },
  body: {
    flex: 1,
    paddingHorizontal: vp(20),
    marginTop: vp(20),
    marginBottom: vp(10),
  },
  logoBox: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    paddingTop: vp(10),
  },
  logo: {
    width: vp(130),
    height: vp(130),
  },
});
