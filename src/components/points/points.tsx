import React, {FC, memo, useMemo} from 'react';
import {StyleSheet, View} from 'react-native';
import {AppText} from '..';
// import DiamondIcon from '~/assets/images/diamondLight.svg';
import {TextColors, TextVariant} from '~/theme';
import WCoin from '~/assets/images/w_coin.svg';

interface PointsProps {
  points?: number | string;
  size?: number;
  iconSize?: number;
  isDollar?: boolean;
  withAdaptiveSize?: boolean;
}

export const Points: FC<PointsProps> = memo(
  ({points, size = 42, iconSize = vp(17), isDollar, withAdaptiveSize}) => {
    const adaptiveTextSize = useMemo(() => {
      if (!withAdaptiveSize || !points) {
        return size;
      }
      const strLength = points && points.toString().length;
      if (strLength) {
        return points && strLength > 3 ? (size * 3) / strLength : size;
      }
      return size;
    }, [points, size, withAdaptiveSize]);
    return (
      <View style={styles.points}>
        <AppText
          variant={TextVariant.H2_A}
          size={adaptiveTextSize}
          style={[styles.point, {lineHeight: size + 1}]}
          color={TextColors.A100}>
          {isDollar && '$'}
          {points}
        </AppText>
        {!isDollar && <WCoin width={iconSize} height={iconSize} />}
      </View>
    );
  },
);

const styles = StyleSheet.create({
  points: {
    flexDirection: 'row',
  },
  point: {
    marginRight: 3,
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
  },
});
