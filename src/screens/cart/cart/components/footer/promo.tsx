import React, {FC} from 'react';
import {AppText} from '~/components';
import {FontWeight, GLOBAL_STYLES, TextVariant, useTheme} from '~/theme';
import {View, StyleSheet} from 'react-native';
import PromoIcon from '~/assets/images/cart/promo.svg';
import {DiscountType} from '~/store/query/cart';
export const FirstOrder: FC = () => {
  const {theme} = useTheme();
  return (
    <AppText
      variant={TextVariant.M_R}
      fontWeight={FontWeight.W400}
      style={{color: theme.colors.green.bold}}>
      Your $10 discount is applied
    </AppText>
  );
};

export const PromoCode: FC = () => {
  const {theme} = useTheme();

  return (
    <View style={GLOBAL_STYLES.row_center}>
      <PromoIcon />
      <AppText
        variant={TextVariant.M_B}
        style={{color: theme.colors.green.bold, ...styles.promo}}>
        Enter a promo code
      </AppText>
    </View>
  );
};

export const PromoComponents: Record<DiscountType, FC> = {
  [DiscountType.firstOrder]: FirstOrder,
  [DiscountType.promoCode]: PromoCode,
  [DiscountType.perkCoupon]: PromoCode,
};

const styles = StyleSheet.create({
  promo: {
    marginLeft: 14,
  },
});
