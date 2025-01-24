import React, {FC} from 'react';
import {TabBarRoutes} from '~/navigation';
import CatalogIcon from '~/assets/images/tabs/catalog.png';
import QrIcon from '~/assets/images/tabs/qr.png';
import CartIcon from '~/assets/images/tabs/cart.png';
import RewardsIcon from '~/assets/images/tabs/rewards.png';
import {Pressable, StyleSheet} from 'react-native';
import Animated, {useAnimatedStyle, withSpring} from 'react-native-reanimated';
import {Counter} from './counter';
import {TabIconSize} from './useBottomTabBarInsets';
import {useAppSelector} from '~/store/hooks';
import {selectStatusForHiddenUi} from '~/store/reducers';
interface TabIconProps {
  onPress: () => void;
  routeName: TabBarRoutes;
  isFocused: boolean;
  index: number;
  isOpen: boolean;
  rewardsCount?: number;
}

const Icons: Record<TabBarRoutes, any> = {
  Catalog: CatalogIcon,
  Cart: CartIcon,
  TabQrScanner: QrIcon,
};
const IconSize = TabIconSize;

const X0 = -vp(84);
const absolutX = Math.abs(X0);
const Y0 = -vp(84);

export const TabIcon: FC<TabIconProps> = ({
  onPress,
  routeName,
  index,
  isOpen,
  rewardsCount,
}) => {
  const shouldBeHidden = useAppSelector(selectStatusForHiddenUi);

  const IconComponent =
    shouldBeHidden && routeName === TabBarRoutes.CartTab
      ? RewardsIcon
      : Icons[routeName];

  const animatedImage = useAnimatedStyle(() => {
    return {
      width: withSpring(isOpen ? IconSize : IconSize / 1.5, {
        damping: 40,
        stiffness: 600,
      }),
      height: withSpring(isOpen ? IconSize : IconSize / 1.5, {
        damping: 40,
        stiffness: 600,
      }),
      opacity: withSpring(isOpen ? 1 : 0.75, {
        damping: 40,
        stiffness: 600,
      }),
    };
  }, [isOpen]);
  const iconAnimatedStyle = useAnimatedStyle(() => {
    const axis = index % 2 === 0;
    if (axis) {
      return {
        left: withSpring(isOpen ? X0 + index * absolutX : 0, {
          damping: 40,
          stiffness: 200,
        }),
        top: withSpring(isOpen ? -25 : 0, {damping: 40, stiffness: 300}),
      };
    }
    return {
      top: withSpring(isOpen ? Y0 : 0, {damping: 40, stiffness: 300}),
      left: 0,
    };
  }, [isOpen]);
  return (
    <Animated.View style={[styles.pressable, iconAnimatedStyle]}>
      <Pressable onPress={onPress}>
        <Animated.Image style={animatedImage} source={IconComponent} />
      </Pressable>
      {isOpen && routeName === TabBarRoutes.CartTab && !!rewardsCount && (
        <Counter count={rewardsCount} />
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  pressable: {
    position: 'absolute',
    width: IconSize,
    height: IconSize,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
