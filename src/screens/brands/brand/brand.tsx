import React, {
  FC,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  AppText,
  BottomSheet,
  BottomSheetRef,
  Cart,
  DefaultHeader,
} from '~/components';
import SearchIcon from '~/assets/images/searchIcon.svg';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {FontWeight, GLOBAL_STYLES, TextColors, useTheme} from '~/theme';
import {HEIGHT, IS_IOS, WIDTH} from '~/constants/layout';
import {
  Categories,
  SuccessfullyGetPointsModal,
  Brand,
  FilterSheet,
} from './components';
import {UserStackRoutes, UserStackParamProps} from '~/navigation';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import {useGetBrandCtx} from '~/context/brand/hooks';

const BackGradientHeight = HEIGHT * 0.7;
const headerClosed = vp(122);
const headerOpened = vp(300);

const snapPoints = ['75%'];

export const BrandScreen: FC<
  UserStackParamProps<UserStackRoutes.BrandScreen>
> = ({navigation, route}) => {
  const {params} = route;
  const scrollRef = useRef<Animated.ScrollView>(null);
  const {bottom} = useSafeAreaInsets();
  const filterSheetRef = useRef<BottomSheetRef>(null);
  const styles = useStyles();
  const [brandID, setBrandID] = useState<number | undefined>(params?.brandId);
  const {theme} = useTheme();
  const translationY = useSharedValue(0);
  const {setBrandId: setContextBrandId} = useGetBrandCtx();
  const scrollHandler = useAnimatedScrollHandler(event => {
    translationY.value = event.contentOffset.y;
  });

  useEffect(() => {
    setContextBrandId?.(brandID || null);
  }, [brandID]);

  const styleHeader = useAnimatedStyle(() => {
    return {
      opacity: interpolate(
        translationY.value,
        [0, 40],
        [1, 0],
        Extrapolate.CLAMP,
      ),
      marginTop: interpolate(
        translationY.value,
        [0, 48],
        [2, -50],
        Extrapolate.CLAMP,
      ),
    };
  });

  const styleDispensary = useAnimatedStyle(() => {
    return {
      opacity: interpolate(
        translationY.value,
        [0, 86],
        [1, 0],
        Extrapolate.CLAMP,
      ),
      marginTop: interpolate(
        translationY.value,
        [0, 118],
        [2, -55],
        Extrapolate.CLAMP,
      ),
    };
  });

  const rBlockerStyle = useAnimatedStyle(() => {
    return {
      zIndex: translationY.value < 65 ? -1 : 1,
    };
  });

  const headerBoxAnimation = useAnimatedStyle(() => {
    return {
      height: interpolate(
        translationY.value,
        [0, 118],
        [headerOpened, headerClosed],
        Extrapolate.CLAMP,
      ),
    };
  });

  const handlePressSearch = useCallback(() => {
    if (params?.brandId) {
      navigation.navigate(UserStackRoutes.SearchProducts, {
        brandId: params?.brandId,
      });
    }
  }, [params?.brandId, navigation]);

  const handlePressWhereToBuy = useCallback(() => {
    if (brandID) {
      navigation.navigate(UserStackRoutes.Dispensaries, {
        brandId: brandID,
        hasPoints: false,
        screenTitle: 'Dispensaries',
      });
    }
  }, [brandID, navigation]);

  const handleSelectCategory = useCallback(() => {
    scrollRef.current?.scrollToEnd();
  }, []);

  return (
    <>
      <View style={styles.top} />
      <View style={{marginBottom: bottom}}>
        <Animated.View style={[styles.header, headerBoxAnimation]}>
          <Animated.View style={styleHeader}>
            <DefaultHeader
              right={
                <View style={GLOBAL_STYLES.row}>
                  <TouchableOpacity
                    onPress={handlePressSearch}
                    style={styles.search}>
                    <SearchIcon color={theme.colors.background.primary} />
                  </TouchableOpacity>
                </View>
              }
              paddingHorizontal={vp(20)}
              headerMarginBottom={vp(15)}
            />
          </Animated.View>

          <View style={GLOBAL_STYLES.horizontal_20}>
            <Brand translationY={translationY} brandId={brandID} />
            <Animated.View style={[styles.dispensary, styleDispensary]}>
              <TouchableOpacity
                style={GLOBAL_STYLES.flex_1_center}
                onPress={handlePressWhereToBuy}>
                <AppText color={TextColors.G070} fontWeight={FontWeight.W600}>
                  DISPENSARIES
                </AppText>
              </TouchableOpacity>
              <Animated.View style={[styles.blocker, rBlockerStyle]} />
            </Animated.View>
          </View>
        </Animated.View>

        <Animated.ScrollView
          ref={scrollRef}
          scrollEventThrottle={16}
          onScroll={scrollHandler}
          stickyHeaderHiddenOnScroll={true}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.contentContainerStyle}>
          <Categories
            onSelectCategory={handleSelectCategory}
            brandId={brandID}
          />
        </Animated.ScrollView>
      </View>
      <SuccessfullyGetPointsModal
        brandId={brandID}
        onGetBrandId={setBrandID}
        redeemed={params?.redeemed}
        token={params?.qrToken}
        gameId={params?.gameId}
      />
      <BottomSheet
        withCloseIcon
        title="Filters"
        snapPoints={snapPoints}
        ref={filterSheetRef}>
        <FilterSheet />
      </BottomSheet>
      <Cart brandId={brandID} />
    </>
  );
};

const useStyles = () => {
  const {top, bottom} = useSafeAreaInsets();
  return useMemo(() => {
    return StyleSheet.create({
      gradientBox: {
        position: 'absolute',
        alignItems: 'center',
        overflow: 'hidden',
        width: WIDTH,
        zIndex: -9,
      },
      gradinet: {
        width: '100%',
        height: BackGradientHeight,
        opacity: 0.5,
      },
      gradientTop: {
        width: '100%',
        height: BackGradientHeight,
        position: 'absolute',
        top: 0,
      },
      search: {
        marginRight: vp(17),
      },
      brandBox: {width: '100%', height: vp(306)},
      brandBoxInner: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-end',
      },
      diamondIcon: {
        marginRight: vp(12),
        marginTop: IS_IOS ? 0 : vp(10),
      },
      point: {letterSpacing: -1.5, fontSize: vp(42), marginLeft: vp(10)},
      pointBox: {
        alignItems: 'center',
        width: '100%',
        marginBottom: vp(19),
      },
      brandSection: {height: vp(301), width: '100%', marginBottom: vp(25)},
      contentContainerStyle: {
        paddingTop: headerOpened,
        paddingBottom: bottom + vp(40),
      },
      dispensary: {
        borderRadius: 18,
        height: vp(42),
        backgroundColor: 'rgba(51, 51, 51, 0.39)',
        borderWidth: 1,
        borderColor: 'rgba(145, 145, 145, 0.21)',
        marginTop: -vp(2),
        position: 'relative',
      },
      blocker: {
        position: 'absolute',
        width: '100%',
        height: '100%',
      },
      header: {
        height: headerOpened,
        position: 'absolute',
        left: 0,
        right: 0,
        zIndex: 1,
        backgroundColor: 'black',
      },
      top: {height: top, backgroundColor: 'black', zIndex: 2},
    });
  }, []);
};
