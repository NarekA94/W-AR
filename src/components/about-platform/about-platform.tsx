import React, {FC, useCallback} from 'react';
import CommingSoonIcon from '~/assets/images/comming-soon.png';
import {ImageBackground, Linking, StyleSheet, View} from 'react-native';
import {GLOBAL_STYLES, TextVariant, useTheme} from '~/theme';
import {AppText} from '../blocks';
import {useIntl} from 'react-intl';
import {TouchableOpacity} from '@gorhom/bottom-sheet';
import {useGetAppSettingsQuery} from '~/store/query/app-settings';

interface AboutPlatformProps {
  title?: string;
}

export const AboutPlatform: FC<AboutPlatformProps> = ({title}) => {
  const intl = useIntl();
  const {theme} = useTheme();
  const {data} = useGetAppSettingsQuery();

  const onPressAboutThePlatform = useCallback(() => {
    if (data?.aboutPlatformLink) {
      Linking.openURL(data?.aboutPlatformLink);
    }
  }, [data?.aboutPlatformLink]);

  if (!data?.aboutPlatformLink) {
    return null;
  }
  return (
    <TouchableOpacity
      onPress={onPressAboutThePlatform}
      style={[styles.section, {borderColor: theme.colors.background.primary}]}>
      <ImageBackground
        style={styles.root}
        imageStyle={styles.image}
        source={CommingSoonIcon}>
        <View style={GLOBAL_STYLES.flex_1_center}>
          <AppText variant={TextVariant.H_5}>
            {title
              ? title
              : intl.formatMessage({
                  id: 'coming_soon',
                  defaultMessage: 'Coming Soon',
                })}
          </AppText>
        </View>
      </ImageBackground>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  root: {
    width: '100%',
    height: vp(80),
  },
  image: {
    width: '100%',
    height: vp(80),
  },
  section: {
    borderWidth: 1,
    borderRadius: 15,
  },
});
