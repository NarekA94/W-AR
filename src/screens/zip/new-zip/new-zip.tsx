import React, {FC} from 'react';
import {useIntl} from 'react-intl';
import {Pressable, StyleSheet, View} from 'react-native';
import {AppText, SvgImageBackground, Wrapper} from '~/components';
import {UserStackParamProps, UserStackRoutes} from '~/navigation';
import {GLOBAL_STYLES, TextColors, TextVariant} from '~/theme';
import CircleIcon from '~/assets/images/zip/circle.svg';
import LocationIcon from '~/assets/images/zip/location.svg';
import {
  NavigationThemes,
  useSetNavigationTheme,
} from '~/context/navigation-theme';

export const NewZipScreen: FC<UserStackParamProps<UserStackRoutes.NewZip>> = ({
  navigation,
}) => {
  const intl = useIntl();
  const handlePressZip = () => {
    navigation.navigate(UserStackRoutes.ZipCode);
  };
  useSetNavigationTheme(NavigationThemes.Dark);

  return (
    <Wrapper horizontalPadding={20} withStatusBar dark>
      <View style={styles.root}>
        <SvgImageBackground svgComponent={<CircleIcon />}>
          <View style={GLOBAL_STYLES.flex_1_center}>
            <LocationIcon />
          </View>
        </SvgImageBackground>
        <AppText
          style={styles.title}
          withGradient
          variant={TextVariant['24_5A']}>
          {intl.formatMessage({
            id: 'newZip.title',
            defaultMessage: 'Enter your zip-code',
          })}
        </AppText>
        <AppText
          style={styles.description}
          variant={TextVariant.S_R}
          color={TextColors.G090}>
          {intl.formatMessage({
            id: 'newZip.description',
            defaultMessage:
              'Enter your zip-code or allow to use your location to detect it, so we could show you an available catalog in your zip-code.',
          })}
        </AppText>
        <Pressable onPress={handlePressZip} style={styles.input}>
          <AppText variant={TextVariant.S_L} color={TextColors.A060}>
            {intl.formatMessage({
              id: 'newZip.placeholder',
              defaultMessage: 'Enter a new zip-code',
            })}
          </AppText>
        </Pressable>
      </View>
    </Wrapper>
  );
};

const styles = StyleSheet.create({
  title: {
    marginBottom: vp(12),
    marginTop: vp(24),
  },
  root: {
    ...GLOBAL_STYLES.flex_1_center,
    marginTop: -50,
  },
  description: {
    textAlign: 'center',
    lineHeight: 18,
  },
  input: {
    marginTop: vp(33),
    borderWidth: 1,
    borderColor: '#454545',
    height: vp(50),
    width: '100%',
    borderRadius: 13,
    justifyContent: 'center',
    paddingLeft: 20,
  },
  containerStyle: {
    justifyContent: 'center',
    paddingLeft: 19,
    borderColor: 'rgba(88, 88, 88, 0.1)',
    borderWidth: 2,
    borderRadius: 12,
  },
});
