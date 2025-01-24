import React, {FC, useCallback, useRef, useState} from 'react';
import {StyleSheet, View, Pressable, Animated, Easing} from 'react-native';
import {AppText} from '~/components';
import {WIDTH} from '~/constants/layout';
import {GLOBAL_STYLES, TextColors, TextVariant, useTheme} from '~/theme';
import ArrowIcon from '~/assets/images/arrowDown.svg';
import {
  Defs,
  Rect,
  Stop,
  Svg,
  RadialGradient as SvgRadialGradient,
} from 'react-native-svg';
import {ProductItem} from './product-item';
import {CreateDeliveryOrderResponse} from '~/store/query/order';
import {ToFixNumber} from '~/utils/utils';

const AnimatedRect = Animated.createAnimatedComponent(Rect);
const AnimatedSvg = Animated.createAnimatedComponent(Svg);

const ClosedHeight = vp(62);
const OpenHeight = vp(289);
const BlockWidth = Math.round(WIDTH - 48);
const colors = ['#fbfcff', '#e4ecfe'];

interface TotalInfoProps {
  order: CreateDeliveryOrderResponse | undefined;
}

export const TotalInfo: FC<TotalInfoProps> = props => {
  const isDwopDownOpenAnimatedValue = useRef(new Animated.Value(0)).current;
  const [isDropdownOpen, setIsdDropDownOpen] = useState(false);
  const {theme} = useTheme();

  const fadeIn = () => {
    Animated.timing(isDwopDownOpenAnimatedValue, {
      toValue: 1,
      duration: 200,
      useNativeDriver: false,
      easing: Easing.ease,
    }).start();
  };

  const fadeOut = () => {
    Animated.timing(isDwopDownOpenAnimatedValue, {
      toValue: 0,
      duration: 200,
      useNativeDriver: false,
      easing: Easing.ease,
    }).start();
  };

  const handlePressToggle = () => {
    if (!isDropdownOpen) {
      setIsdDropDownOpen(true);
      fadeIn();
    } else {
      setIsdDropDownOpen(false);
      fadeOut();
    }
  };

  const renderColors = useCallback(
    (item: string, index: number) => (
      <Stop key={index} offset={index} stopColor={item} stopOpacity="1" />
    ),
    [],
  );

  return (
    <View style={styles.root}>
      <Animated.View
        style={[
          {
            width: BlockWidth,
            height: isDwopDownOpenAnimatedValue.interpolate({
              inputRange: [0, 1],
              outputRange: [ClosedHeight, OpenHeight],
            }),
          },
        ]}>
        <AnimatedSvg
          width={BlockWidth}
          height={isDwopDownOpenAnimatedValue.interpolate({
            inputRange: [0, 1],
            outputRange: [ClosedHeight, OpenHeight],
          })}>
          <Defs>
            <SvgRadialGradient
              id="grad"
              cx="50%"
              cy="50%"
              rx="100%"
              ry="100%"
              fx="50%"
              fy="50%"
              gradientUnits="userSpaceOnUse">
              {colors.map(renderColors)}
            </SvgRadialGradient>
          </Defs>
          <AnimatedRect
            x="0.5"
            y="0"
            width={BlockWidth}
            height={isDwopDownOpenAnimatedValue.interpolate({
              inputRange: [0, 1],
              outputRange: [ClosedHeight, OpenHeight],
            })}
            rx={12}
            fill="url(#grad)"
          />
        </AnimatedSvg>
        <View style={[styles.child]}>
          <View style={styles.section}>
            <Pressable
              onPress={handlePressToggle}
              style={[GLOBAL_STYLES.row_between, styles.button]}>
              <View>
                <AppText variant={TextVariant.M_B}>Total</AppText>
                <AppText color={TextColors.B040}>
                  {ToFixNumber(props.order?.gramWeight)}g
                </AppText>
              </View>

              <View style={GLOBAL_STYLES.row_between}>
                <View style={styles.price}>
                  <AppText variant={TextVariant.M_B}>
                    ${ToFixNumber(props.order?.totalSum)}
                  </AppText>
                  <AppText color={TextColors.B040}>Tax included</AppText>
                </View>
                <Animated.View
                  style={[
                    styles.arrowIcon,
                    {
                      transform: [
                        {
                          rotate: isDwopDownOpenAnimatedValue.interpolate({
                            inputRange: [0, 1],
                            outputRange: ['0deg', '180deg'],
                          }),
                        },
                      ],
                    },
                  ]}>
                  <ArrowIcon />
                </Animated.View>
              </View>
            </Pressable>
            <Animated.View
              style={[
                styles.separator,
                {
                  backgroundColor: theme.colors.border.E01,
                  height: isDwopDownOpenAnimatedValue,
                },
              ]}
            />
            {isDropdownOpen && (
              <View style={[styles.informSection]}>
                <View>
                  <ProductItem name="Product price" price={props?.order?.sum} />
                  <ProductItem
                    name="Excise tax"
                    price={props.order?.exciseTaxSum}
                  />
                  <ProductItem
                    name="Sale tax"
                    price={props.order?.salesTaxSum}
                  />
                  <ProductItem
                    name="Local tax"
                    price={props.order?.cityTaxSum}
                  />
                  <ProductItem
                    name="Delivery fee"
                    price={props.order?.deliverySum}
                  />
                  {props?.order?.discount && (
                    <ProductItem
                      discount
                      minus
                      name="First order discount"
                      price={props?.order?.discount?.value}
                    />
                  )}
                </View>
              </View>
            )}
          </View>
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  section: {flex: 1},
  informSection: {
    paddingHorizontal: 16,
    flex: 1,
    paddingVertical: vp(8),
  },
  button: {
    height: ClosedHeight,
    padding: 16,
  },
  root: {
    marginTop: vp(22),
  },
  price: {alignItems: 'flex-end'},
  arrowIcon: {
    marginLeft: 12,
  },
  child: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  separator: {
    width: '100%',
    height: 1,
    backgroundColor: 'red',
  },
});
