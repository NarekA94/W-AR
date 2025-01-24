import React, {memo} from 'react';
import {useIntl} from 'react-intl';
import {StyleSheet, View} from 'react-native';
import EmptyCart from '~/assets/images/rewards/empty.svg';
import {AppText} from '~/components';
import {GLOBAL_STYLES, TextColors, TextVariant} from '~/theme';

export const EmptyScreen = memo(() => {
  const intl = useIntl();
  return (
    <View style={GLOBAL_STYLES.flex_1_center}>
      <EmptyCart style={styles.logo} />
      <AppText withGradient variant={TextVariant['24_4A']}>
        {intl.formatMessage({
          id: 'screens.rewards.empty.title',
          defaultMessage: 'No rewards redeemed',
        })}
      </AppText>
      <AppText
        style={styles.info}
        variant={TextVariant.S_R}
        color={TextColors.G090}>
        {intl.formatMessage({
          id: 'screens.rewards.empty.info',
          defaultMessage: 'You’ll see here current redeemed rewards',
        })}
      </AppText>
    </View>
  );
});

const styles = StyleSheet.create({
  logo: {
    marginBottom: vp(73),
    marginTop: -vp(50),
  },
  info: {
    textAlign: 'center',
    marginTop: vp(12),
  },
});
