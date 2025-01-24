import React, {FC, memo, useCallback, useMemo} from 'react';
import {
  Dimensions,
  ImageBackground,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';
import CartIcon from '~/assets/images/brands/cart.png';
import {AppText} from '~/components';
import {TextVariant, useTheme} from '~/theme';
import Bucket from '~/assets/images/cart.svg';
import Animated, {
  SharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import {useGetCartCountQuery} from '~/store/query/v2-cart';
import {useNavigation} from '@react-navigation/native';
import {UserScreenNavigationProp, UserStackRoutes} from '~/navigation';
import {Gesture, GestureDetector} from 'react-native-gesture-handler';
import {IS_IOS} from '~/constants/layout';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useCartCtx} from '~/context/cart';

interface CartProps {
  translationY?: SharedValue<number>;
  brandId?: number;
}
const screenHeight = Dimensions.get('screen').height;
const windowHeight = Dimensions.get('window').height;
const cartHeight = vp(57);

export const Cart: FC<CartProps> = memo(({brandId}) => {
  const {positionY, contextY} = useCartCtx();
  const {theme} = useTheme();
  const {top, bottom} = useSafeAreaInsets();
  const navigation = useNavigation<UserScreenNavigationProp>();
  const {data: cart} = useGetCartCountQuery();
  const topBottomPosition0 = useMemo(
    () => ({
      top: top + vp(10),
      bottom: IS_IOS
        ? windowHeight - bottom - cartHeight
        : windowHeight - (screenHeight - windowHeight - top),
    }),
    [bottom, top],
  );

  const handlePressGoToCart = useCallback(() => {
    navigation.navigate(UserStackRoutes.ProductCart);
  }, [navigation]);

  const panGesture = Gesture.Pan()
    .onStart(() => {
      contextY.value = positionY!.value;
    })
    .onUpdate(e => {
      positionY.value = e.translationY + contextY.value;
    })
    .onEnd(e => {
      const mass = e.velocityY * 0.1;
      let value = e.translationY + contextY.value + mass;

      if (value > topBottomPosition0.bottom) {
        value = topBottomPosition0.bottom;
      }
      if (value < topBottomPosition0.top) {
        value = topBottomPosition0.top;
      }
      positionY.value = withSpring(value, {
        damping: 20,
        mass: 1,
        stiffness: 200,
      });
    });

  const animatedStyles = useAnimatedStyle(() => {
    return {
      transform: [{translateY: positionY.value}],
    };
  }, []);

  if (!cart?.count || cart.brandId !== brandId) {
    return null;
  }

  return (
    <GestureDetector gesture={panGesture}>
      <Animated.View style={[styles.root, animatedStyles]}>
        <Pressable onPress={handlePressGoToCart}>
          <ImageBackground
            resizeMode="contain"
            source={CartIcon}
            style={styles.img}>
            <Bucket
              width={vp(20)}
              height={vp(16)}
              style={styles.bucket}
              color={theme.colors.primary}
            />
          </ImageBackground>
        </Pressable>

        <View style={styles.circle}>
          <AppText variant={TextVariant.P_M}>{cart?.count}</AppText>
        </View>
      </Animated.View>
    </GestureDetector>
  );
});

const styles = StyleSheet.create({
  root: {
    position: 'absolute',
    right: -5,
    overflow: 'visible',
  },
  img: {
    width: vp(52),
    height: cartHeight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  circle: {
    width: vp(29),
    height: vp(29),
    borderRadius: vp(50),
    position: 'absolute',
    backgroundColor: '#6A77F7',
    justifyContent: 'center',
    alignItems: 'center',
    top: -vp(4),
    left: -vp(4),
  },
  bucket: {
    marginLeft: vp(7),
  },
});
