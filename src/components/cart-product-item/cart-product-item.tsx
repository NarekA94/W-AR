import React, {memo, FC} from 'react';
import {useIntl} from 'react-intl';
import {Image, StyleSheet, View} from 'react-native';
import {AppText} from '~/components';
import {GLOBAL_STYLES, TextColors, TextVariant} from '~/theme';

interface CartProductItemProps {
  imageUri?: string;
  name?: string;
  gramWeight?: number;
  thc?: number;
  ounceWeight?: number;
  quantity?: number;
}

export const CartProductItem: FC<CartProductItemProps> = memo(props => {
  const intl = useIntl();
  return (
    <View style={styles.root}>
      <Image
        resizeMode="contain"
        style={styles.img}
        source={{uri: props.imageUri}}
      />
      <View style={styles.info}>
        <AppText
          style={styles.name}
          variant={TextVariant.S_R}
          color={TextColors.A100}>
          {props.name}
        </AppText>
        <AppText
          style={styles.grams}
          color={TextColors.G070}
          variant={TextVariant.P_M}>
          {props.gramWeight} G / {props.ounceWeight} oz
        </AppText>
        <View style={[GLOBAL_STYLES.row_vertical_center, styles.thcRow]}>
          <View style={GLOBAL_STYLES.row_vertical_center}>
            <AppText variant={TextVariant.S_R} color={TextColors.A045}>
              {intl.formatMessage({
                id: 'thc',
                defaultMessage: 'THC',
              })}{' '}
            </AppText>
            <AppText variant={TextVariant.S_R} color={TextColors.A100}>
              {props.thc} %
            </AppText>
          </View>
          {props.quantity && (
            <View style={GLOBAL_STYLES.row_vertical_center}>
              <AppText variant={TextVariant.S_R} color={TextColors.A045}>
                {intl.formatMessage({
                  id: 'product.quantity_label',
                  defaultMessage: 'Qty:',
                })}
              </AppText>
              <AppText variant={TextVariant.S_R} color={TextColors.A100}>
                {props.quantity}
              </AppText>
            </View>
          )}
        </View>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  root: {
    flexDirection: 'row',
    marginBottom: vp(20),
  },
  thcRow: {
    justifyContent: 'space-between',
  },
  img: {
    width: vp(65),
    height: vp(65),
    marginRight: vp(13),
  },
  name: {
    width: '90%',
  },
  grams: {
    marginTop: vp(8),
    marginBottom: vp(8),
  },
  info: {
    justifyContent: 'space-between',
    flexShrink: 1,
    flex: 1,
  },
});
