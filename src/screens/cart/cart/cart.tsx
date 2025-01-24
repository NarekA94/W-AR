import {AppText, Wrapper} from '~/components';
import React, {FC, useMemo} from 'react';
import {useIntl} from 'react-intl';
import {Alert, Animated, FlatList, Pressable, View} from 'react-native';
import {TextColors, TextVariant, useTheme} from '~/theme';
import {styles} from './styles';
import {
  CartProduct,
  useDeleteCartProductsMutation,
  useGetCartProductsQuery,
} from '~/store/query/cart';
import {CartProductItem, EmptyCart, Footer, Loader} from './components';

export const CartScreen: FC = () => {
  const intl = useIntl();
  const scrollY = React.useRef(new Animated.Value(0)).current;
  const {theme} = useTheme();
  const {data: products, isLoading} = useGetCartProductsQuery();
  const [deleteCart] = useDeleteCartProductsMutation();
  const renderProducts = ({
    item: {product, quantity},
  }: FlatListItem<CartProduct>) => (
    <CartProductItem
      brandName={product.brand.name}
      strain={product.strain?.name}
      image={product.images?.[0]?.file?.url || ''}
      ounceWeight={product.ounceWeight}
      gramWeight={product.gramWeight}
      price={product.price}
      name={product.name}
      thc={product.thc}
      quantity={quantity}
      id={product.id}
    />
  );

  if (isLoading) {
    return <Loader />;
  }

  if (products?.cartDetails && products?.cartDetails?.length === 0) {
    return <EmptyCart />;
  }

  const openDeleteAlert = () => {
    Alert.alert(
      intl.formatMessage({
        id: 'cart.clearCart',
        defaultMessage: 'Clear cart',
      }),
      intl.formatMessage({
        id: 'cart.clearCartDescription',
        defaultMessage:
          'All items will be removed. Are you sure you want to clear the Cart?',
      }),
      [
        {text: 'Cancel', style: 'cancel'},
        {text: 'Clear', style: 'destructive', onPress: deleteCart},
      ],
      {cancelable: true},
    );
  };

  const ListHeaderComponent = () =>
    useMemo(() => {
      return (
        <View style={styles.horizontal_24}>
          <AppText style={styles.title} variant={TextVariant.H2_B}>
            {intl.formatMessage({
              id: 'cart.title',
              defaultMessage: 'Cart',
            })}
          </AppText>
          <AppText color={TextColors.B040} variant={TextVariant.S_R}>
            {intl.formatMessage({
              id: 'cart.description',
              defaultMessage: 'Only cash is accepted as a payment method',
            })}
          </AppText>
        </View>
      );
    }, []);
  return (
    <Wrapper withTabBottomInset horizontalPadding={0} withStatusBar>
      <View style={[styles.header]}>
        <Animated.Text
          style={{
            ...styles.headerTitle,
            color: theme.colors.primary,
            opacity: scrollY.interpolate({
              inputRange: [20, 60],
              outputRange: [0, 1],
            }),
          }}>
          {intl.formatMessage({
            id: 'cart.header',
            defaultMessage: 'Cart',
          })}
        </Animated.Text>
        <Pressable
          style={styles.clearCart}
          onPress={openDeleteAlert}
          hitSlop={20}>
          <AppText color={TextColors.P100} variant={TextVariant.M_R}>
            {intl.formatMessage({
              id: 'cart.clearCart',
              defaultMessage: 'Clear cart',
            })}
          </AppText>
        </Pressable>
      </View>
      <Animated.View
        style={{
          backgroundColor: theme.colors.border.E01,
          height: scrollY.interpolate({
            inputRange: [20, 60],
            outputRange: [0, 0.5],
            extrapolate: 'clamp',
          }),
        }}
      />
      <FlatList
        ListHeaderComponent={ListHeaderComponent}
        showsVerticalScrollIndicator={false}
        ListFooterComponent={Footer}
        renderItem={renderProducts}
        keyExtractor={item => item.product.id.toString()}
        data={products?.cartDetails}
        onScroll={Animated.event(
          [{nativeEvent: {contentOffset: {y: scrollY}}}],
          {
            useNativeDriver: false,
          },
        )}
      />
    </Wrapper>
  );
};
