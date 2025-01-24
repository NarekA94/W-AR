import React, {FC, memo, useCallback} from 'react';
import {StyleSheet, View} from 'react-native';
import {OR, RadioButton} from '~/components';
import {ProductTabs} from '~/store/query/brand';
import {OrderType} from '~/store/query/order';
import {usePutReceiptTypeMutation} from '~/store/query/v2-cart';

interface ShippingMethodProps {
  availableTypesOfReceipt?: OrderType[];
  currentReceiptType?: OrderType;
  tab: ProductTabs;
}

export const ShippingMethod: FC<ShippingMethodProps> = memo(
  ({availableTypesOfReceipt, currentReceiptType, tab}) => {
    const [putReceiptType] = usePutReceiptTypeMutation();

    const handlePressRadioButton = useCallback(
      (item?: OrderType) => {
        if (typeof item === 'number') {
          putReceiptType({
            type: item,
            tab,
          });
        }
      },
      [putReceiptType, tab],
    );

    const renderTabs = useCallback(
      (item: OrderType) => {
        return (
          <RadioButton<OrderType>
            isSelected={item === currentReceiptType}
            name={item === OrderType.pickup ? 'Pick up' : 'Delivery '}
            key={item}
            item={item}
            onSelectItem={handlePressRadioButton}
          />
        );
      },
      [handlePressRadioButton, currentReceiptType],
    );

    return (
      <View style={styles.root}>
        <OR textSize={14} title="Shipping method" containerStyle={styles.or} />
        <View style={styles.radioGroup}>
          {availableTypesOfReceipt?.map(renderTabs)}
        </View>
      </View>
    );
  },
);

const styles = StyleSheet.create({
  root: {
    marginBottom: vp(28),
  },
  or: {
    marginBottom: vp(20),
  },
  radioGroup: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    justifyContent: 'space-between',
  },
});
