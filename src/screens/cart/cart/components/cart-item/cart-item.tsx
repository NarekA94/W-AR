import React, {FC, memo} from 'react';
import {Image, TouchableOpacity, Vibration, View} from 'react-native';
import {useStyles} from './styles';
import {AppText, RadialGradient} from '~/components';
import {GLOBAL_STYLES, TextColors, TextVariant, useTheme} from '~/theme';
import {ToFixNumber} from '~/utils/utils';
import {Swipeable} from 'react-native-gesture-handler';
import TrashIcon from '~/assets/images/trash.svg';
import MinusIcon from '~/assets/images/minus.svg';
import PlusIcon from '~/assets/images/plus.svg';
import {usePutCartProductMutation} from '~/store/query/cart';

interface CategoryListItemProps {
  brandName: string;
  name: string;
  thc: number;
  image: string;
  price: number;
  gramWeight: number;
  ounceWeight: number;
  isSelected?: boolean;
  onPressAdd?: () => void;
  onPress?: () => void;
  strain: string;
  quantity: number;
  id: number;
}

export const CartProductItem: FC<CategoryListItemProps> = memo(props => {
  const styles = useStyles();
  const [addProductToCart, {isLoading}] = usePutCartProductMutation();

  const {theme} = useTheme();
  const removeProduct = () => {
    addProductToCart({product: props.id, quantity: 0});
  };
  const rightSwipeActions = () => {
    return (
      <View style={styles.stylesDeleteBox}>
        <RadialGradient
          colors={[theme.colors.pink.light, theme.colors.pink.medium]}
          width={vp(52)}
          height={vp(103)}>
          <TouchableOpacity
            disabled={isLoading}
            onPress={removeProduct}
            style={GLOBAL_STYLES.flex_1_center}>
            <TrashIcon />
          </TouchableOpacity>
        </RadialGradient>
      </View>
    );
  };
  const incrementProduct = () => {
    Vibration.vibrate(10);
    addProductToCart({product: props.id, quantity: props.quantity + 1});
  };
  const decrementProduct = () => {
    Vibration.vibrate(10);
    addProductToCart({product: props.id, quantity: props.quantity - 1});
  };
  return (
    <Swipeable
      containerStyle={styles.root}
      renderRightActions={rightSwipeActions}>
      <View style={[GLOBAL_STYLES.row_between, styles.firstSection]}>
        <View style={styles.order}>
          <View style={styles.imageBox}>
            <Image
              resizeMode="center"
              style={styles.orderImage}
              source={{uri: props.image}}
            />
          </View>
          <View style={styles.content}>
            <AppText variant={TextVariant.R} color={TextColors.B040}>
              {props.brandName}
            </AppText>
            <AppText variant={TextVariant.S_R} style={styles.title}>
              {props.name}
            </AppText>
            <View style={styles.row}>
              <AppText variant={TextVariant.M_B}>${props.price}.00</AppText>
              <AppText variant={TextVariant.R} style={styles.secondary}>
                {ToFixNumber(props.gramWeight)}g / {props.ounceWeight}oz
              </AppText>
            </View>
          </View>
        </View>
        <View style={styles.vr} />
        <View style={styles.section3}>
          <TouchableOpacity onPress={incrementProduct}>
            <PlusIcon />
          </TouchableOpacity>
          <View style={styles.count}>
            <AppText variant={TextVariant.M_R}>{props.quantity}</AppText>
          </View>
          <TouchableOpacity
            onPress={decrementProduct}
            hitSlop={{top: 20, bottom: 20, left: 20, right: 20}}>
            <MinusIcon />
          </TouchableOpacity>
        </View>
      </View>
    </Swipeable>
  );
});
