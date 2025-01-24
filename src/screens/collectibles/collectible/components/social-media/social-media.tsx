import React, {FC, memo} from 'react';
import {StyleSheet, View} from 'react-native';
import {AppText, Box} from '~/components';
import ProfileIcon from '~/assets/images/profile.svg';
import {FontWeight, GLOBAL_STYLES, TextVariant, useTheme} from '~/theme';
import LinearGradient from 'react-native-linear-gradient';
import FacebookIcon from '~/assets/images/facebook.svg';
import InstagramIcon from '~/assets/images/instagram.svg';
import TwitterIcon from '~/assets/images/twitter.svg';

const gradientColors = ['#2F2F2F', '#525252', '#2F2F2F'];
const start = {x: 0, y: 0};
const end = {x: 1, y: 0};

interface SocailMediaProps {
  artist?: string;
}

export const SocailMedia: FC<SocailMediaProps> = memo(props => {
  const {theme} = useTheme();
  return (
    <View style={styles.root}>
      <Box height={vp(144)}>
        <View style={styles.body}>
          <View
            style={[GLOBAL_STYLES.row_vertical_center, styles.firstSection]}>
            <View
              style={[styles.circle, {backgroundColor: theme.colors.primary}]}>
              <ProfileIcon />
            </View>
            <View>
              <AppText style={styles.name} variant={TextVariant.P_M}>
                Artist
              </AppText>
              <AppText
                withGradient
                variant={TextVariant.H_5}
                fontWeight={FontWeight.W500}>
                {props.artist}
              </AppText>
            </View>
          </View>
          <LinearGradient
            colors={gradientColors}
            start={start}
            end={end}
            style={styles.linearGradient}
          />
          <View style={styles.socialMedia}>
            <FacebookIcon />
            <InstagramIcon />
            <TwitterIcon />
          </View>
        </View>
      </Box>
    </View>
  );
});

const styles = StyleSheet.create({
  root: {
    marginTop: vp(38),
  },
  firstSection: {
    padding: vp(15),
  },
  name: {
    marginBottom: vp(3),
  },
  body: {
    flex: 1,
  },
  circle: {
    height: vp(50),
    width: vp(50),
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: vp(15),
  },
  linearGradient: {
    height: 1,
    width: '100%',
  },
  socialMedia: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '65%',
    alignSelf: 'center',
  },
});
