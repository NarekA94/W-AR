import React, {FC, memo, useCallback, useMemo} from 'react';
import {Image, Pressable, StyleSheet, View} from 'react-native';
import {AppText, PointsBrand} from '~/components';
import {FontWeight, GLOBAL_STYLES, TextColors, TextVariant} from '~/theme';
import {useIntl} from 'react-intl';
import {IS_IOS} from '~/constants/layout';
import LinearGradient from 'react-native-linear-gradient';
import {ButtonTransparent} from '../button-transparent';
interface CardMedium {
  logo?: string;
  points?: number;
  onPress?: (id: number) => void;
  onPressDesc?: () => void;
  id: number;
  rewardAvailable?: number;
  gradientEndColorHex: string;
  gradientStartColorHex: string;
  withDescription?: boolean;
}

const borderBoxGradientColors = [
  'rgba(255, 255, 255, 1)',
  'rgba(255, 255, 255, .1)',
];
const angleCenter = {x: 0.8, y: 0};

export const CardMedium: FC<CardMedium> = memo(props => {
  const intl = useIntl();
  const {gradientEndColorHex, gradientStartColorHex} = props;
  const handlePressBrand = useCallback(() => {
    props.onPress?.(props.id);
  }, []);

  const gradientColors = useMemo(() => {
    return [gradientStartColorHex, gradientEndColorHex];
  }, [gradientEndColorHex, gradientStartColorHex]);

  return (
    <Pressable onPress={handlePressBrand}>
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
                  <PointsBrand points={props.points} />
                  <AppText variant={TextVariant.R} color={TextColors.B100}>
                    {intl.formatMessage({
                      id: 'screens.brand.earned_points',
                      defaultMessage: 'Reward Available',
                    })}
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
              <View
                style={[
                  styles.desc,
                  props.withDescription && styles.withDescription,
                ]}>
                <ButtonTransparent
                  withDescription={props.withDescription}
                  onPress={props.onPressDesc}
                  disabled
                />
              </View>
            </View>
          </LinearGradient>
        </LinearGradient>
      </LinearGradient>
    </Pressable>
  );
});

const styles = StyleSheet.create({
  ground: {
    height: vp(172),
    marginBottom: vp(16),
    borderRadius: 32,
  },
  borderBox: {
    padding: 1,
    borderRadius: 32,
    flex: 1,
  },
  root: {
    borderRadius: 32,
    flex: 1,
  },
  rewardBox: {
    borderColor: 'rgba(0, 0, 0, 0.12)',
    borderLeftWidth: 1,
    paddingLeft: vp(18),
  },
  reward: {
    marginTop: vp(4),
  },
  desc: {position: 'absolute', right: -vp(90), bottom: 0},
  withDescription: {
    right: 0,
  },
  body: {
    flex: 1,
    paddingHorizontal: vp(22),
    paddingVertical: vp(20),
  },
  imageStyle: {
    width: '100%',
    height: vp(172),
  },
  infoBox: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    bottom: vp(14),
    left: 0,
    right: 0,
  },
  diamondIcon: {
    marginRight: vp(12),
    marginTop: IS_IOS ? 0 : 4,
  },
  point: {letterSpacing: -1.5},
  info: {
    fontSize: 10,
    lineHeight: 13,
  },
  imageBlock: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  logo: {
    height: vp(70),
    width: vp(70),
  },
  badge: {
    position: 'absolute',
    right: 0,
    top: 0,
  },
});
