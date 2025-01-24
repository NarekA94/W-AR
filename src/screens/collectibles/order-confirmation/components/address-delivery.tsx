import React, {memo} from 'react';
import {StyleSheet, View} from 'react-native';
import {AppText} from '~/components';
import {GLOBAL_STYLES, TextColors, TextVariant} from '~/theme';
import LocationIcon from '~/assets/images/zip/location.svg';
import AlarmIcon from '~/assets/images/alarm.svg';
export const AddressDelivery = memo(() => {
  return (
    <View>
      <AppText
        style={styles.title}
        variant={TextVariant.S_L}
        color={TextColors.G090}>
        Address delivery
      </AppText>
      <View style={styles.sectionRow}>
        <LocationIcon width={vp(24)} height={vp(24)} />
        <View style={GLOBAL_STYLES.flexShrink_1}>
          <AppText
            style={styles.rowName}
            variant={TextVariant.M_R}
            color={TextColors.A100}>
            180 S Alvarado St, Los Angeles, CA 90057
          </AppText>
        </View>
      </View>
      <View style={[GLOBAL_STYLES.row]}>
        <AlarmIcon width={vp(24)} height={vp(24)} />
        <View style={GLOBAL_STYLES.flexShrink_1}>
          <AppText
            style={styles.rowName}
            variant={TextVariant.M_R}
            color={TextColors.A100}>
            up to 72 hours
          </AppText>
        </View>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  title: {
    marginBottom: vp(13),
  },
  sectionRow: {
    flexDirection: 'row',
    marginBottom: vp(28),
  },
  rowName: {marginLeft: vp(14), lineHeight: 22},
});
