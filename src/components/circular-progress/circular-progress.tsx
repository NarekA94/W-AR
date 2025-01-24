import React, {FC, memo} from 'react';
import {
  Image,
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import {Circle, G, Svg} from 'react-native-svg';
import {AppText} from '..';
import {FontWeight, GLOBAL_STYLES, TextColors, TextVariant} from '~/theme';
import RedeemBg from '~/assets/images/product/redeem-bg.png';
import {IS_IOS} from '~/constants/layout';
import DiamondIcon from '~/assets/images/diamond-green.svg';
import WCoin from '~/assets/images/w_coin.png';

interface CircularProgressProps {
  radius?: number;
  activeStrokColor?: string;
  strokeWidth?: number;
  percentage?: number;
  max?: number;
  onPress?: () => void;
  showFooter?: boolean;
  isModelLoading?: boolean;
}

export const CircularProgress: FC<CircularProgressProps> = memo(
  ({
    radius = vp(53),
    activeStrokColor = '#C7FEC7',
    strokeWidth = 2,
    percentage = 0,
    max = 100,
    onPress,
    showFooter,
    isModelLoading,
  }) => {
    const width = radius * 2;
    const height = radius * 2;
    const halfCircle = radius + strokeWidth;
    const circleStrokeLenght = 2 * Math.PI * radius;
    const maxPercent = (100 * percentage) / max;
    const strokeDashoffset =
      circleStrokeLenght - (circleStrokeLenght * maxPercent) / 100;
    const isFull = percentage >= max;
    return (
      <View>
        <TouchableOpacity
          disabled={!isFull || isModelLoading}
          onPress={onPress}
          style={{width: width, height: height}}>
          <Svg
            width={width}
            height={height}
            viewBox={`0 0 ${halfCircle * 2} ${halfCircle * 2}`}>
            <G rotation="-90" origin={`${halfCircle}, ${halfCircle}`}>
              <Circle
                cy="50%"
                cx="50%"
                stroke={activeStrokColor}
                strokeWidth={strokeWidth}
                r={radius}
                fill="transparent"
                strokeOpacity={0.2}
              />
              <Circle
                cy="50%"
                cx="50%"
                stroke={activeStrokColor}
                strokeWidth={strokeWidth}
                r={radius}
                fill="transparent"
                strokeDasharray={circleStrokeLenght}
                strokeDashoffset={isFull ? 0 : strokeDashoffset}
                strokeLinecap="round"
              />
            </G>
          </Svg>
          <View style={styles.section}>
            <View
              style={[
                styles.center,
                {
                  width: width * 0.82,
                  height: width * 0.82,
                },
              ]}>
              {isFull ? (
                <View style={GLOBAL_STYLES.flex_1}>
                  <ImageBackground
                    source={RedeemBg}
                    style={GLOBAL_STYLES.flex_1_center}>
                    <View style={GLOBAL_STYLES.row}>
                      <Image style={styles.iconImage} source={WCoin} />
                      <AppText
                        style={styles.piceText}
                        variant={TextVariant['24_5A']}
                        color={TextColors.B100}>
                        {max}
                      </AppText>
                    </View>
                  </ImageBackground>
                </View>
              ) : (
                <View style={styles.sectionDisabled}>
                  <View
                    style={[
                      styles.elipse,
                      {
                        width: width * 0.82,
                        height: width * 0.82,
                        marginTop: -radius,
                      },
                    ]}>
                    <AppText
                      fontWeight={FontWeight.W500}
                      style={styles.percent}
                      variant={TextVariant.S_5W}>
                      {percentage}
                    </AppText>
                  </View>
                  <AppText variant={TextVariant.P_M}>out of</AppText>
                  <AppText style={styles.max} variant={TextVariant['24_5A']}>
                    {max}
                  </AppText>
                </View>
              )}
            </View>
          </View>
        </TouchableOpacity>
        {showFooter && (
          <View style={styles.footer}>
            <DiamondIcon
              style={styles.diamond}
              width={vp(10)}
              height={vp(10)}
            />
            <AppText
              variant={TextVariant.P_M}
              fontWeight={FontWeight.W500}
              color={TextColors.green}>
              {isFull ? 'REDEEM' : 'TO REDEEM'}
            </AppText>
          </View>
        )}
      </View>
    );
  },
);

const styles = StyleSheet.create({
  price: {position: 'absolute', paddingTop: IS_IOS ? 2 : 0},
  section: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  center: {
    borderRadius: 500,
    overflow: 'hidden',
  },
  containerStyle: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  elipse: {
    backgroundColor: 'rgba(191, 255, 191, 0.3)',
    borderRadius: 500,
    justifyContent: 'flex-end',
    alignItems: 'center',
    padding: 10,
    marginBottom: 5,
  },
  percent: {
    color: '#BFFFBF',
  },
  max: {
    marginTop: 4,
  },
  sectionDisabled: {
    flex: 1,
    alignItems: 'center',
  },
  diamond: {marginTop: -2, marginRight: 3},
  footer: {
    ...GLOBAL_STYLES.row_center,
    marginTop: vp(10),
  },
  iconImage: {
    width: vp(16),
    height: vp(16),
    alignSelf: 'center',
  },
  piceText: {
    marginRight: 8,
  },
});
