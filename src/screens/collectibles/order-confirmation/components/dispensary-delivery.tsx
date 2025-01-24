import React, {FC, memo} from 'react';
import {StyleSheet, View} from 'react-native';
import {AppText} from '~/components';
import {DispensaryStatus} from '~/components/dispensary';
import {FontWeight, GLOBAL_STYLES, TextColors, TextVariant} from '~/theme';
import LocationIcon from '~/assets/images/zip/location.svg';
import {useGetDispensaryQuery} from '~/store/query/brand';

const textGradientLocations = [0, 0.2, 0.4];

interface DispensaryDeliveryProps {
  dispensaryId: number;
}

export const DispensaryDelivery: FC<DispensaryDeliveryProps> = memo(
  ({dispensaryId}) => {
    const {data: dispensary} = useGetDispensaryQuery({id: dispensaryId});

    return (
      <>
        <View style={GLOBAL_STYLES.row_between}>
          <AppText variant={TextVariant.S_L} color={TextColors.G090}>
            Dispensary information
          </AppText>
          <DispensaryStatus
            textProps={{variant: TextVariant.S_5W}}
            isThirdParty={true}
            iconSize={vp(17)}
          />
        </View>
        <AppText
          style={styles.name}
          locations={textGradientLocations}
          variant={TextVariant.H4_B}
          fontWeight={FontWeight.W500}
          color={TextColors.A100}
          withGradient>
          {dispensary?.name}
        </AppText>
        <View style={styles.sectionRow}>
          <LocationIcon width={vp(24)} height={vp(24)} />
          <View style={GLOBAL_STYLES.flexShrink_1}>
            <AppText
              style={styles.rowName}
              variant={TextVariant.M_R}
              color={TextColors.A100}>
              {dispensary?.address}
            </AppText>
          </View>
        </View>
        <AppText variant={TextVariant.S_L} color={TextColors.G090}>
          When placing an order at this dispensary, there is a waiting period
          involved. After your order is confirmed, we will process it, and it
          will be delivered to the dispensary within 48 hours.
        </AppText>
      </>
    );
  },
);

const styles = StyleSheet.create({
  name: {
    marginBottom: vp(20),
    marginTop: vp(16),
  },
  sectionRow: {
    flexDirection: 'row',
    marginBottom: vp(14),
  },
  rowName: {marginLeft: vp(14), lineHeight: 22},
});
