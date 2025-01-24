import React, {FC} from 'react';
import {useIntl} from 'react-intl';
import {Pressable, StyleSheet, View} from 'react-native';
import {AppText} from '~/components';
import {GLOBAL_STYLES, TextColors, TextVariant, useTheme} from '~/theme';
import CloseIcon from '~/assets/images/cart/close.svg';

export const TabHeader: FC = () => {
  const {theme} = useTheme();
  const intl = useIntl();
  return (
    <View style={styles.root}>
      <Pressable
        style={[styles.delivery, {backgroundColor: theme.colors.primary}]}>
        <AppText variant={TextVariant.M_B} color={TextColors.A100}>
          {intl.formatMessage({
            id: 'orderDetails.delivery',
            defaultMessage: 'Delivery',
          })}
        </AppText>
      </Pressable>
      <View style={styles.pickUp}>
        <CloseIcon height={9} width={9} />
        <AppText
          variant={TextVariant.M_B}
          style={styles.pickUpText}
          color={TextColors.P100}>
          {intl.formatMessage({
            id: 'orderDetails.pickup',
            defaultMessage: 'Pick up',
          })}
        </AppText>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  pickUpText: {
    marginLeft: 7,
  },
  root: {
    flexDirection: 'row',
    width: '100%',
    height: vp(44),
    marginTop: vp(26),
    marginBottom: vp(40),
  },
  delivery: {
    flex: 1,
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
    ...GLOBAL_STYLES.center,
  },
  pickUp: {
    ...GLOBAL_STYLES.center,
    flex: 1,
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopRightRadius: 12,
    borderBottomRightRadius: 12,
    flexDirection: 'row',
  },
});
