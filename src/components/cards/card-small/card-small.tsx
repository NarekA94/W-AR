import React, {FC, useMemo} from 'react';
import {Image, StyleSheet, View} from 'react-native';
import {AppText, PointsBrand} from '~/components';
import {FontWeight, GLOBAL_STYLES, TextColors, TextVariant} from '~/theme';
import {useIntl} from 'react-intl';
import LinearGradient from 'react-native-linear-gradient';

interface CardSmallProps {
  logo?: string;
  cardImage: string;
  points?: number;
  rewardAvailable?: number;
  gradientEndColorHex: string;
  gradientStartColorHex: string;
}

const borderBoxGradientColors = [
  'rgba(255, 255, 255, 1)',
  'rgba(255, 255, 255, .1)',
];
const angleCenter = {x: 0.8, y: 0};

export const CardSmall: FC<CardSmallProps> = props => {
  const intl = useIntl();
  const {gradientEndColorHex, gradientStartColorHex} = props;

  const gradientColors = useMemo(() => {
    return [gradientStartColorHex, gradientEndColorHex];
  }, [gradientEndColorHex, gradientStartColorHex]);
  return (
    <LinearGradient style={styles.ground} colors={gradientColors}>
      <LinearGradient
        useAngle
        angle={120}
        angleCenter={angleCenter}
        style={styles.borderBox}
        colors={borderBoxGradientColors}>
        <LinearGradient colors={gradientColors} style={styles.root}>
          <View style={styles.body}>
            <View style={GLOBAL_STYLES.row_between}>
              <View>
                <PointsBrand size={36} iconSize={18} points={props.points} />
                <AppText
                  style={styles.points}
                  variant={TextVariant.R}
                  color={TextColors.B100}>
                  EARNED POINTS
                </AppText>
              </View>
              {!!props.rewardAvailable && (
                <View style={styles.rewardBox}>
                  <AppText
                    size={30}
                    fontWeight={FontWeight.W700}
                    color={TextColors.B100}>
                    {props.rewardAvailable?.toString().padStart(2, '0')}
                  </AppText>
                  <AppText style={styles.reward} color={TextColors.B100}>
                    {intl.formatMessage({
                      id: 'screens.brand.reward_available',
                      defaultMessage: 'Reward Available',
                    })}
                  </AppText>
                </View>
              )}
            </View>
            <View style={styles.imageBlock}>
              <Image
                resizeMode="contain"
                style={styles.logo}
                source={{uri: props.logo}}
              />
            </View>
          </View>
        </LinearGradient>
      </LinearGradient>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  ground: {
    width: vp(251),
    height: vp(182),
    marginRight: vp(20),
    borderRadius: 32,
  },
  borderBox: {
    padding: 1,
    borderRadius: 32,
    flex: 1,
  },
  root: {
    flex: 1,
    borderRadius: 32,
  },
  reward: {
    marginTop: vp(2),
  },
  body: {
    flex: 1,
    paddingHorizontal: vp(22),
    paddingVertical: vp(20),
  },
  imageBlock: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  rewardBox: {
    borderColor: 'rgba(0, 0, 0, 0.12)',
    borderLeftWidth: 1,
    paddingLeft: vp(11),
  },
  logo: {
    height: vp(70),
    width: vp(70),
  },
  points: {
    marginTop: vp(2),
  },
});
