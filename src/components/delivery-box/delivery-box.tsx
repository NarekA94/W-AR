import React, {memo} from 'react';
import {StyleSheet, View} from 'react-native';
import DeliveryIcon from '~/assets/images/rewards/delivery.svg';
import {AppText} from '..';
import {GLOBAL_STYLES, TextVariant} from '~/theme';

export const DeliveryBox = memo(() => {
  return (
    <View style={GLOBAL_STYLES.row_vertical_center}>
      <AppText style={styles.text} variant={TextVariant['10_4A']}>
        Delivery
      </AppText>
      <DeliveryIcon />
    </View>
  );
});

const styles = StyleSheet.create({
  text: {
    marginRight: 4,
  },
});
