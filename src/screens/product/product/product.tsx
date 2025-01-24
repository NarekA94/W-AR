import React, {FC, useCallback, useEffect, useMemo, useState} from 'react';
import {
  GradientWrapper,
  DefaultHeader,
  Cart,
  defaultHeaderMarginBottom,
  defaultHeaderHeight,
  defaultHeaderTop,
} from '~/components';
import {
  ScrollView,
  StyleSheet,
  View,
  BackHandler,
  Platform,
  Alert,
  Linking,
} from 'react-native';
import {Description, SwiperEllipse, Element3D, ScreenMode} from './components';
import {UserStackParamProps, UserStackRoutes} from '~/navigation';
import {useGetProductQuery} from '~/store/query/product';
import {product3DModel} from './components/3d-element/3d-model';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {PERMISSIONS, request, RESULTS} from 'react-native-permissions';
import {logger} from '~/utils';
import {useIntl} from 'react-intl';
import {useFocusEffect} from '@react-navigation/native';
import {useDetectScrollEnabled} from '~/hooks/useDetectScrollEnabled';

const headerInset = defaultHeaderMarginBottom + defaultHeaderTop;

const cameraPermission = Platform.select({
  ios: PERMISSIONS.IOS.CAMERA,
  android: PERMISSIONS.ANDROID.CAMERA,
});
export const ProductScreen: FC<
  UserStackParamProps<UserStackRoutes.ProductScreen>
> = ({route}) => {
  const {productId, tab, color} = route.params;
  const intl = useIntl();
  const [isModelLoading, setIsModelLoading] = useState<boolean>(true);
  const [screenMode, setScreenMode] = useState<ScreenMode>(ScreenMode['3D']);
  const {data} = useGetProductQuery({id: productId, tab});
  const {top} = useSafeAreaInsets();
  const [isArInitializing, setIsArInitializing] = useState<boolean>(false);

  const {scrollEnabled, ...pressHandlers} = useDetectScrollEnabled();

  useEffect(() => {
    const backAction = () => {
      if (product3DModel.xrSession?.inXRSession) {
        product3DModel.stopAR();
        setScreenMode(ScreenMode['3D']);
        return true;
      } else {
        return false;
      }
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, []);

  const handlePressSwiperIcon = (type: ScreenMode) => {
    if (type === screenMode) {
      return;
    }
    requestAnimationFrame(() => {
      if (type === ScreenMode.AR) {
        request(cameraPermission!)
          .then(result => {
            if (result === RESULTS.GRANTED) {
              setIsArInitializing(true);
              setScreenMode(type);
              requestAnimationFrame(async () => {
                await product3DModel.startAR();
                setTimeout(() => {
                  setIsArInitializing(false);
                }, 300);
              });
            } else {
              Alert.alert(
                intl.formatMessage({
                  id: 'permission.camera.title',
                }),
                intl.formatMessage({
                  id: 'permission.camera.message',
                }),
                [
                  {
                    text: 'Not right now',
                  },
                  {text: 'Go to Settings', onPress: Linking.openSettings},
                ],
                {
                  cancelable: true,
                },
              );
            }
          })
          .catch(e => logger.warn(e));
      } else {
        setScreenMode(type);

        if (product3DModel.xrSession?.inXRSession) {
          product3DModel.stopAR();
        }
      }
    });
  };

  const onLoadEnd = useCallback(() => {
    setTimeout(() => {
      setIsModelLoading(false);
    }, 200);
  }, [setIsModelLoading]);

  useFocusEffect(
    useCallback(() => {
      setIsModelLoading(true);
    }, []),
  );
  const handleBackPressed = useCallback(() => {
    if (screenMode !== ScreenMode['3D']) {
      handlePressSwiperIcon(ScreenMode['3D']);
      return true;
    }
    return false;
  }, [screenMode]);

  const gradientCover = useMemo(() => {
    return [
      color || data?.primaryColor || 'rgba(0, 0, 0, 1)',
      'rgba(0, 0, 0, 1)',
      'rgba(0, 0, 0, 1)',
    ];
  }, [color, data?.primaryColor]);

  return (
    <>
      <GradientWrapper colors={gradientCover}>
        <DefaultHeader
          handleBackPressed={handleBackPressed}
          headerMarginBottom={0}
          paddingHorizontal={20}
          withSafeZone
          disabled={isModelLoading}
          styles={[
            styles.headerStyle,
            isModelLoading && styles.transparentHeader,
          ]}
        />

        <ScrollView
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          scrollEnabled={scrollEnabled && screenMode === ScreenMode['3D']}
          contentContainerStyle={[
            styles.contentContainerStyle,
            {paddingTop: top + headerInset},
            screenMode === ScreenMode.AR && styles.AR,
          ]}>
          <View
            style={[
              styles.model,
              screenMode !== ScreenMode.AR && styles.bottom_45,
            ]}>
            {data?.modelGlb.url && (
              <Element3D
                onLoadEnd={onLoadEnd}
                modelUri={data?.modelGlb.url}
                {...(!isModelLoading ? pressHandlers : {})}
              />
            )}

            <SwiperEllipse
              screenMode={screenMode}
              onPressSwiperIcon={handlePressSwiperIcon}
              disabled={isModelLoading || isArInitializing}
            />
          </View>

          {screenMode === ScreenMode['3D'] && (
            <Description
              tab={tab}
              product={data}
              isModelLoading={isModelLoading}
            />
          )}
        </ScrollView>
      </GradientWrapper>
      {screenMode !== ScreenMode.AR && !isModelLoading && (
        <Cart brandId={data?.brand.id} />
      )}
    </>
  );
};

const styles = StyleSheet.create({
  contentContainerStyle: {
    flexGrow: 1,
    paddingTop: vp(26),
    overflow: 'visible',
  },
  model: {
    minHeight: vp(402) + defaultHeaderHeight,
    flex: 1,
  },
  bottom_45: {
    marginBottom: vp(45),
  },
  headerStyle: {
    backgroundColor: 'transparent',
    position: 'absolute',
    zIndex: 9,
  },
  AR: {
    paddingTop: 0,
  },
  transparentHeader: {
    zIndex: -9,
    opacity: 0,
  },
});
