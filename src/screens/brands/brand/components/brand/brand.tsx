import React, {
  FC,
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {StyleSheet, View, Animated as NativeAnimated} from 'react-native';
import {
  AppText,
  FullScreenModal,
  FullScreenModalRef,
  PointsBrand,
  PointsBrandRef,
} from '~/components';
import {useLazyGetBrandQuery} from '~/store/query/brand';
import SkeletonIcon from '~/assets/images/catalog/brand-skeleton.svg';
import {LearnMoreModal} from '../learn-more-modal/learn-more-modal';
import {IS_IOS} from '~/constants/layout';
import LinearGradient from 'react-native-linear-gradient';
import {FontWeight, GLOBAL_STYLES, TextColors, TextVariant} from '~/theme';
import {useIntl} from 'react-intl';
import {ButtonTransparent} from '~/components/cards/button-transparent';
import Animated, {
  Extrapolate,
  SharedValue,
  interpolate,
  useAnimatedStyle,
} from 'react-native-reanimated';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useGetBrandCtx} from '~/context/brand/hooks';

interface BrandProps {
  brandId?: number;
  translationY?: SharedValue<number>;
}

const borderBoxGradientColors = [
  'rgba(255, 255, 255, 1)',
  'rgba(255, 255, 255, .1)',
];
const angleCenter = {x: 0.8, y: 0};

const CardOpened = vp(172);
const CardClosed = vp(107);
const LogoSize = vp(70);

export const Brand: FC<BrandProps> = memo(props => {
  const {translationY} = props;
  const {bottom} = useSafeAreaInsets();
  const intl = useIntl();
  const {brandId, lastPoints, setLastPoints, pendingPoints, setPendingPoints} =
    useGetBrandCtx();

  const fullScreenModalRef = useRef<FullScreenModalRef>(null);
  const pointsAnimatedRef = useRef(new NativeAnimated.Value(0));

  const [pointsState, setPointsState] = useState<number>(0);
  const [pointsAnimation, setPointsAnimation] = useState<boolean>(false);

  const [getBrand, {data, isLoading}] = useLazyGetBrandQuery();
  const pointsBrandRef = useRef<PointsBrandRef>(null);
  const animateNumbers = (newValue: number) => {
    pointsAnimatedRef.current.addListener(pointsTick => {
      setPointsState(Math.round(pointsTick.value));
    });
    pointsAnimatedRef.current.setValue(lastPoints || 0);
    pointsBrandRef.current?.playIconAnimation();
    setPointsAnimation(true);
    NativeAnimated.spring(pointsAnimatedRef.current, {
      toValue: newValue,
      overshootClamping: true,
      useNativeDriver: true,
    }).start(() => {
      setPointsAnimation(false);
      setLastPoints?.(newValue);
    });
  };
  useEffect(() => {
    if (props?.brandId) {
      getBrand({id: props.brandId});
    }
  }, [props?.brandId, getBrand]);
  useEffect(() => {
    if (lastPoints != null) {
      setPendingPoints?.(null);
    }
  }, [data]);
  useEffect(() => {
    if (data) {
      let resultPoints = pendingPoints || data.points;
      if (
        !pointsAnimation &&
        resultPoints &&
        brandId === props.brandId &&
        (lastPoints || lastPoints === 0) &&
        resultPoints !== lastPoints
      ) {
        animateNumbers(resultPoints);
      } else {
        setLastPoints?.(resultPoints || 0);
        setPointsState(resultPoints || 0);
      }
    }
    //setPointsState(pointsAnimatedRef.current);
  }, [data?.points, pendingPoints]);
  const cardStyles = useAnimatedStyle(() => {
    return {
      height: interpolate(
        translationY?.value || 0,
        [0, 100],
        [CardOpened, CardClosed - bottom * 0.35],
        Extrapolate.CLAMP,
      ),
    };
  }, []);

  const logoStyles = useAnimatedStyle(() => {
    return {
      opacity: interpolate(
        translationY?.value || 0,
        [0, 40],
        [1, 0],
        Extrapolate.CLAMP,
      ),
    };
  }, []);

  const handlePressInfo = useCallback(() => {
    fullScreenModalRef.current?.open();
  }, []);

  const closeModal = useCallback(() => {
    fullScreenModalRef.current?.close();
  }, []);

  const gradientColors = useMemo(() => {
    return [
      data?.gradientStartColorHex || 'black',
      data?.gradientEndColorHex || 'black',
    ];
  }, [data]);

  if (isLoading) {
    return (
      <SkeletonIcon style={styles.skeleton} width="100%" height={vp(172)} />
    );
  }
  return (
    <>
      {data && (
        <Animated.View style={[styles.box, cardStyles]}>
          <LinearGradient style={styles.ground} colors={gradientColors}>
            <LinearGradient
              useAngle
              angle={120}
              angleCenter={angleCenter}
              style={styles.borderBox}
              colors={borderBoxGradientColors}>
              <LinearGradient colors={gradientColors} style={styles.root}>
                <View style={styles.body}>
                  <View style={GLOBAL_STYLES.row_between}>
                    <View>
                      <PointsBrand points={pointsState} ref={pointsBrandRef} />
                      <AppText variant={TextVariant.R} color={TextColors.B100}>
                        {intl.formatMessage({
                          id: 'screens.brand.earned_points',
                          defaultMessage: 'Reward Available',
                        })}
                      </AppText>
                    </View>
                    {!!data.rewardAvailable && (
                      <View style={styles.rewardBox}>
                        <AppText
                          size={30}
                          fontWeight={FontWeight.W700}
                          color={TextColors.B100}>
                          {data.rewardAvailable?.toString().padStart(2, '0')}
                        </AppText>
                        <AppText style={styles.reward} color={TextColors.B100}>
                          {intl.formatMessage({
                            id: 'screens.brand.reward_available',
                            defaultMessage: 'Reward Available',
                          })}
                        </AppText>
                      </View>
                    )}
                  </View>
                  <View>
                    <Animated.Image
                      resizeMode="contain"
                      style={[styles.logo, logoStyles]}
                      source={{uri: data.logo.url}}
                    />
                  </View>
                  <Animated.View
                    style={[styles.desc, styles.withDescription, logoStyles]}>
                    <ButtonTransparent
                      withDescription={true}
                      onPress={handlePressInfo}
                    />
                  </Animated.View>
                </View>
              </LinearGradient>
            </LinearGradient>
          </LinearGradient>
        </Animated.View>
      )}
      <FullScreenModal
        transparent={true}
        animationType="fade"
        presentationStyle="overFullScreen"
        ref={fullScreenModalRef}>
        <LearnMoreModal
          description={data?.description}
          logoUri={data?.logo?.url}
          close={closeModal}
          gradientEndColorHex={data?.gradientEndColorHex}
          gradientStartColorHex={data?.gradientStartColorHex}
        />
      </FullScreenModal>
    </>
  );
});

const styles = StyleSheet.create({
  skeleton: {
    marginBottom: vp(16),
    borderRadius: 30,
  },
  box: {
    height: vp(172),
    marginBottom: vp(16),
    zIndex: 4,
  },
  ground: {
    flex: 1,

    borderRadius: 32,
  },
  borderBox: {
    padding: 1,
    borderRadius: 32,
    flex: 1,
  },
  root: {
    borderRadius: 32,
    flex: 1,
  },
  rewardBox: {
    borderColor: 'rgba(0, 0, 0, 0.12)',
    borderLeftWidth: 1,
    paddingLeft: vp(18),
  },
  reward: {
    marginTop: vp(4),
  },
  desc: {position: 'absolute', right: -vp(90), bottom: 0, zIndex: 9},
  withDescription: {
    right: 0,
  },
  body: {
    flex: 1,
    paddingHorizontal: vp(22),
    paddingVertical: vp(20),
  },
  imageStyle: {
    width: '100%',
    height: vp(172),
  },
  infoBox: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    bottom: vp(14),
    left: 0,
    right: 0,
  },
  diamondIcon: {
    marginRight: vp(12),
    marginTop: IS_IOS ? 0 : 4,
  },
  point: {letterSpacing: -1.5},
  info: {
    fontSize: 10,
    lineHeight: 13,
  },
  logo: {
    height: LogoSize,
    width: LogoSize,
    position: 'absolute',
  },
  badge: {
    position: 'absolute',
    right: 0,
    top: 0,
  },
});
