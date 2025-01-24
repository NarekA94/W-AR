import React, {FC, memo, useMemo} from 'react';
import {StyleProp, StyleSheet, TextStyle, View, ViewStyle} from 'react-native';
import CalendarIcon from '~/assets/images/rewards/calendar.svg';
import FlashIcon from '~/assets/images/rewards/flash.svg';

import {ProductTabName, ProductTabs} from '~/store/query/brand';
import {FontWeight, TextColors, TextVariant} from '~/theme';
import {AppText} from '..';

interface RewardTabProps {
  tab?: ProductTabs;
  containerStyles?: StyleProp<ViewStyle>;
  textStyles?: StyleProp<TextStyle>;
  iconSize?: number;
  textSize?: number;
  fontWeight?: FontWeight;
  timeTypeText?: string;
  typeText?: string;
}

export const RewardTab: FC<RewardTabProps> = memo(
  ({
    tab,
    containerStyles,
    textStyles,
    iconSize = 13,
    textSize,
    fontWeight,
    timeTypeText,
    typeText,
  }) => {
    const isSameDay = useMemo(() => {
      return (
        tab === ProductTabs.SAME_DAY ||
        tab === ProductTabs.SAME_DAY_DELIVERY ||
        tab === ProductTabs.SAME_DAY_IN_STORE_PICK_UP
      );
    }, [tab]);

    return (
      <View style={[styles.root, containerStyles]}>
        {isSameDay ? (
          <FlashIcon width={iconSize} height={iconSize} />
        ) : (
          <CalendarIcon width={iconSize} height={iconSize} />
        )}

        <AppText
          style={[styles.title, textStyles]}
          size={textSize}
          fontWeight={fontWeight}
          variant={TextVariant.P_M}>
          {timeTypeText ? timeTypeText : ProductTabName[tab || 1]}
          {typeText && (
            <AppText
              size={textSize}
              color={TextColors.A045}
              fontWeight={fontWeight}
              variant={TextVariant.P_M}>
              {' '}
              {typeText}
            </AppText>
          )}
        </AppText>
      </View>
    );
  },
);

const styles = StyleSheet.create({
  root: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    marginLeft: vp(6),
    marginTop: 2,
  },
});
