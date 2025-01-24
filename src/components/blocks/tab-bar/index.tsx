import React, {FC, Fragment, useEffect, useState} from 'react';
import {View, StyleSheet, Pressable, Image} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import {TabBarParamList, TabBarRoutes, UserStackRoutes} from '~/navigation';
import {WIDTH} from '~/constants/layout';
import {TabIcon} from './tab-icon';
import {BottomTabBarProps} from '@react-navigation/bottom-tabs';

import CentralIcon from '~/assets/images/tabs/closed-tab.png';
import Animated, {
  Easing,
  useAnimatedProps,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import {Path, Svg} from 'react-native-svg';
import {TabIconSize, useBottomTabBarInsets} from './useBottomTabBarInsets';
import {Counter} from './counter';
import {useGetRewardsCountQuery} from '~/store/query/rewards';
import {triggerHapticFeedback} from '~/plugins/hapticFeedback';
import {useNavigationState} from '@react-navigation/native';

const TabBottomShadowColors = [
  'rgba(0, 0, 0, 1)',
  'rgba(0, 0, 0, 0.9)',
  'rgba(0, 0, 0, 0)',
];
const TabBottomShadowStart = {x: 0, y: 1.5};
const TabBottomShadowEnd = {x: 0, y: 0};
const IconSize = TabIconSize + 4;
const CloseIconSize = IconSize - 2;
const AnimatedPath = Animated.createAnimatedComponent(Path);

const TabBar: FC<BottomTabBarProps> = ({state, navigation}) => {
  const {bottomInset} = useBottomTabBarInsets();
  const {data: rewards} = useGetRewardsCountQuery();

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const handlePressToggleIcon = () => {
    triggerHapticFeedback();
    setIsOpen(!isOpen);
  };
  const routes = useNavigationState(navState => navState.routes);
  useEffect(() => {
    if (isOpen) {
      setIsOpen(false);
    }
  }, [routes]);

  const animatedSvgProps = useAnimatedProps(() => {
    return {
      strokeWidth: withTiming(isOpen ? '1.5' : '0', {
        duration: 220,
        easing: Easing.linear,
      }),
    };
  }, [isOpen]);

  const animatedCloseIcon = useAnimatedStyle(() => {
    return {
      width: withTiming(isOpen ? CloseIconSize : 0, {
        duration: 220,
        easing: Easing.out(Easing.quad),
      }),
      height: withTiming(isOpen ? CloseIconSize : 0, {
        duration: 220,
        easing: Easing.inOut(Easing.quad),
      }),
      transform: [
        {
          rotate: withTiming(isOpen ? '0deg' : '-180deg', {
            duration: 220,
            easing: Easing.linear,
          }),
        },
      ],
    };
  }, [isOpen]);

  return (
    <Fragment>
      <View style={[styles.body, {paddingBottom: bottomInset}]}>
        <View>
          {state.routes.map((route: any, index: number) => {
            const routeName = route.name as keyof TabBarParamList;

            const isFocused = state.index === index;

            const onPress = () => {
              triggerHapticFeedback();

              const event = navigation.emit({
                type: 'tabPress',
                target: route.key,
                canPreventDefault: true,
              });

              if (!isFocused && !event.defaultPrevented) {
                setIsOpen(false);
                if (route.name === TabBarRoutes.TabQrScanner) {
                  navigation.navigate(UserStackRoutes.QrScanner);
                } else if (route.name === TabBarRoutes.CartTab) {
                  navigation.navigate(UserStackRoutes.Rewards);
                } else {
                  navigation.navigate(route.name);
                }
              }
            };

            return (
              <TabIcon
                key={route.key}
                onPress={onPress}
                isFocused={isFocused}
                routeName={routeName}
                index={index}
                isOpen={isOpen}
                rewardsCount={rewards?.count}
              />
            );
          })}
          <Pressable onPress={handlePressToggleIcon}>
            <Image style={styles.centerIcon} source={CentralIcon} />
            <View style={styles.closeBox}>
              <Animated.View style={[styles.closeIcon, animatedCloseIcon]}>
                <Svg width="16" height="16" viewBox="0 0 16 16" fill="white">
                  <AnimatedPath
                    animatedProps={animatedSvgProps}
                    d="M1 1L15 15M1.00003 15L8.00003 8L15 1"
                    stroke="white"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </Svg>
              </Animated.View>
            </View>
            {!isOpen && !!rewards?.count && <Counter count={rewards?.count} />}
          </Pressable>
        </View>
      </View>
      <View style={styles.root} pointerEvents="none">
        <LinearGradient
          pointerEvents="none"
          colors={TabBottomShadowColors}
          start={TabBottomShadowStart}
          end={TabBottomShadowEnd}
          style={styles.linearGradient}
        />
      </View>
    </Fragment>
  );
};

const styles = StyleSheet.create({
  root: {
    position: 'absolute',
    borderColor: 'red',
    bottom: 0,
    height: vp(147),
    width: WIDTH,
    overflow: 'visible',
  },
  linearGradient: {
    flex: 1,
    overflow: 'visible',
  },
  body: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    overflow: 'visible',
    position: 'absolute',
    bottom: 0,
    width: WIDTH,
    zIndex: 9,
  },
  centerIcon: {
    width: IconSize,
    height: IconSize,
  },
  closeBox: {
    width: IconSize,
    height: IconSize,
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeIcon: {
    width: IconSize - 2,
    height: IconSize - 2,
    borderRadius: 100,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default TabBar;
