import React, {FC, memo, useCallback} from 'react';
import {Image, StyleSheet, TouchableOpacity, View} from 'react-native';
import {AppText, CartCounter, HR} from '~/components';
import {GLOBAL_STYLES, TextColors, TextVariant} from '~/theme';
import TrashIcon from '~/assets/images/trash.svg';
import {ProductTabs} from '~/store/query/brand';

interface ProductItemProps {
  imageUri: string;
  name: string;
  totalCashSum: number;
  quantity: number;
  gramWeight: number;
  thc: number;
  ounceWeight: number;
  hr?: boolean;
  onChangeQuantity?: (quantity: number, productId: number) => void;
  id: number;
  tab: ProductTabs;
  onPressDelete: (productId: number) => void;
}

export const ProductItem: FC<ProductItemProps> = memo(props => {
  const {onChangeQuantity, id, onPressDelete} = props;

  const handleChangeQuantity = useCallback(
    (quantity: number) => {
      onChangeQuantity?.(quantity, id);
    },
    [id, onChangeQuantity],
  );

  const handlePressDeleteIcon = useCallback(() => {
    onPressDelete(id);
  }, [onPressDelete, id]);

  return (
    <>
      <View style={styles.root}>
        <View style={styles.infoBox}>
          <Image
            resizeMode="contain"
            style={styles.img}
            source={{uri: props.imageUri}}
          />
          <View style={[GLOBAL_STYLES.flexShrink_1, GLOBAL_STYLES.flex_1]}>
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
            <View style={GLOBAL_STYLES.row_vertical_center}>
              <AppText variant={TextVariant.S_R} color={TextColors.A045}>
                THC{' '}
              </AppText>
              <AppText variant={TextVariant.S_R} color={TextColors.A100}>
                {props.thc} %
              </AppText>
            </View>
          </View>
          <TouchableOpacity onPress={handlePressDeleteIcon}>
            <TrashIcon opacity={0.45} />
          </TouchableOpacity>
        </View>
        <View style={styles.counter}>
          <CartCounter
            onChangeQuantity={handleChangeQuantity}
            quantity={props.quantity}
          />
          <AppText variant={TextVariant['24_5A']}>
            ${props.totalCashSum}
          </AppText>
        </View>
      </View>
      {props.hr && <HR style={styles.hr} />}
    </>
  );
});

const styles = StyleSheet.create({
  root: {
    marginTop: vp(22),

    paddingHorizontal: vp(24),
  },
  infoBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  img: {
    width: vp(50),
    height: vp(50),
    marginRight: vp(13),
    alignSelf: 'center',
  },
  name: {
    width: '90%',
  },
  grams: {
    marginTop: vp(8),
    marginBottom: vp(8),
  },
  counter: {
    ...GLOBAL_STYLES.row_between,
    marginTop: vp(19),
    marginBottom: vp(34),
  },
  hr: {
    width: '100%',
    marginLeft: 0,
    marginTop: 0,
  },
});
