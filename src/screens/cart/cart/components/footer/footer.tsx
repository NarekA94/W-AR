import {useNavigation} from '@react-navigation/native';
import React, {FC, memo, useCallback, useMemo} from 'react';
import {Pressable, StyleSheet, View} from 'react-native';
import {
  AppText,
  RadialGradient,
  RowItem,
  Table,
  DefaultRowHeight,
  Button,
} from '~/components';
import {WIDTH} from '~/constants/layout';
import {UserScreenNavigationProp, UserStackRoutes} from '~/navigation';
import {DiscountType, useGetCartProductsQuery} from '~/store/query/cart';
import {GLOBAL_STYLES, TextColors, TextVariant, useTheme} from '~/theme';
import {ToFixNumber} from '~/utils/utils';
import {PromoComponents} from './promo';
interface TableRowProps {
  value?: number | string;
  name: string;
  discount?: boolean;
}

export const Footer: FC = memo(() => {
  const {data: products} = useGetCartProductsQuery();
  const navigation = useNavigation<UserScreenNavigationProp>();
  const {theme} = useTheme();
  const tableData = useMemo(() => {
    const tableList: TableRowProps[] = [
      {
        name: 'Total weight',
        value: `${ToFixNumber(products?.totalWeight)}g`,
      },
      {
        name: 'Product price',
        value: `$${ToFixNumber(products?.productsSum)}`,
      },
      {
        name: 'Subtotal',
        value: `$${ToFixNumber(products?.sum)}`,
      },
    ];
    if (products?.discount) {
      tableList.splice(2, 0, {
        name: 'Promo code discount',
        value: `-$${ToFixNumber(products.discount.value)}`,
        discount: true,
      });
    }

    return tableList;
  }, [products]);

  const handlePressCheckout = useCallback(() => {
    navigation.navigate(UserStackRoutes.OrderDetails);
  }, []);

  const renderItem = (item: TableRowProps, index: number) => {
    return (
      <View
        key={index}
        style={[
          styles.tableRow,
          index < tableData.length - 1 && styles.separator,
          {borderColor: theme.colors.border.E01},
        ]}>
        <AppText
          variant={TextVariant.M_R}
          style={item.discount && {color: theme.colors.green.bold}}>
          {item.name}
        </AppText>
        <AppText
          variant={TextVariant.M_B}
          style={item.discount && {color: theme.colors.green.bold}}>
          {item.value}
        </AppText>
      </View>
    );
  };
  return (
    <View style={styles.root}>
      <View style={styles.promoSection}>
        <RadialGradient
          containerStyle={GLOBAL_STYLES.center}
          width={WIDTH - 48}
          height={48}
          colors={['#EDFCED', '#B8FFB8']}>
          <Pressable>
            {
              PromoComponents[
                products?.discount?.type || DiscountType.promoCode
              ]
            }
          </Pressable>
        </RadialGradient>
      </View>
      <AppText
        style={styles.details}
        variant={TextVariant.S_B}
        color={TextColors.B040}>
        Order details
      </AppText>
      <Table data={tableData} renderItem={renderItem} />
      {!products?.priceCorresponds && (
        <AppText
          style={styles.error}
          variant={TextVariant.S_R}
          color={TextColors.P100}>
          Minimum order amount is ${products?.minOrderSum}.
        </AppText>
      )}
      <RowItem
        title="Delivery fee"
        value={`$${ToFixNumber(products?.deliverySum)}`}
      />
      <RowItem title="Total" value={`$${ToFixNumber(products?.totalSum)}`} />
      <Button
        onPress={handlePressCheckout}
        disabled={!products?.priceCorresponds}
        containerStyle={styles.button}
        width={'100%'}
        title="Proceed to checkout"
      />
    </View>
  );
});

const styles = StyleSheet.create({
  root: {
    paddingHorizontal: 24,
  },
  promo: {
    color: '#3CAA6E',
  },
  promoSection: {
    marginTop: vp(40),
    marginBottom: vp(23),
  },
  details: {
    marginBottom: 8,
    marginLeft: 12,
  },
  tableRow: {
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: DefaultRowHeight,
  },
  separator: {
    borderBottomWidth: 1,
  },
  button: {marginTop: vp(24), marginBottom: vp(36)},
  error: {
    marginTop: 10,
    marginBottom: 11,
  },
});
