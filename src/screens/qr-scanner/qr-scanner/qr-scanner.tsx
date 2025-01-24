import React, {FC, useCallback, useEffect, useRef, useState} from 'react';
import {
  Alert,
  Linking,
  StyleSheet,
  TouchableOpacity,
  Vibration,
  View,
} from 'react-native';
import {runOnJS} from 'react-native-reanimated';
import {
  useCameraDevices,
  Camera,
  useFrameProcessor,
} from 'react-native-vision-camera';
import {BarcodeFormat, scanBarcodes, Barcode} from 'vision-camera-code-scanner';
import {UserStackParamProps, UserStackRoutes} from '~/navigation';
import {useCheckQrCodeMutation} from '~/store/query/qrcode';
import {GLOBAL_STYLES, TextColors, TextVariant} from '~/theme';
import Box from '~/assets/images/qrscanner/box.svg';
import ArrowBackImage from '~/assets/images/arrowLeft.svg';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {AppText} from '~/components';
import {ApiError} from '~/store/types';

const getUniqueString = (url: string) => {
  const segments = url.split('/');
  return segments[segments.length - 1];
};

const BoxSize = vp(276);

export const QrScannerScreen: FC<
  UserStackParamProps<UserStackRoutes.QrScanner>
> = ({navigation}) => {
  const devices = useCameraDevices();
  const device = devices.back;
  const [error, setError] = useState<string>('');
  const {top} = useSafeAreaInsets();
  let qrChecking = useRef(false).current;

  const [checkQrCode] = useCheckQrCodeMutation({
    fixedCacheKey: 'authentic_product',
  });
  const [hasPermission, setHasPermission] = useState(false);

  const handleBarCodes = (qrCodes: Barcode[]) => {
    if (qrChecking) {
      return;
    }
    qrChecking = true;
    const firstQrResponse = qrCodes?.[0].rawValue;
    if (firstQrResponse) {
      const token = getUniqueString(firstQrResponse);
      Vibration.vibrate();
      checkQrCode({uniqueString: token || ''})
        .unwrap()
        .then(() => {
          navigation.reset({
            index: 0,
            routes: [
              {name: UserStackRoutes.TabNavigator},
              {name: UserStackRoutes.Authentic, params: {qrToken: token}},
            ],
          });
        })
        .catch(err => {
          const typedError = err as ApiError<string>;
          if (typedError?.data) {
            setError(typedError?.data);
          }
          setTimeout(() => {
            qrChecking = false;
          }, 2000);
        });
    }
  };

  const frameProcessor = useFrameProcessor(frame => {
    'worklet';
    const detectedBarcodes = scanBarcodes(frame, [BarcodeFormat.QR_CODE], {
      checkInverted: true,
    });
    if (detectedBarcodes.length > 0) {
      runOnJS(handleBarCodes)(detectedBarcodes);
    }
  }, []);

  useEffect(() => {
    (async () => {
      const status = await Camera.requestCameraPermission();
      setHasPermission(status === 'authorized');
      if (status === 'denied') {
        Alert.alert(
          'Camera permission denied',
          "To unlock an immersive Augmented Reality experience or utilize QR code scanning, kindly grant access to your device's camera in the settings.",
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
    })();
  }, []);

  const handlePressBack = useCallback(() => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    }
  }, []);

  return (
    <>
      {device != null && hasPermission && (
        <Camera
          style={StyleSheet.absoluteFill}
          device={device}
          isActive={true}
          video={false}
          photo={false}
          audio={false}
          frameProcessor={frameProcessor}
          frameProcessorFps={0.5}
        />
      )}
      <View style={[StyleSheet.absoluteFill]}>
        <TouchableOpacity
          onPress={handlePressBack}
          style={[styles.backButton, {marginTop: top + vp(23)}]}
          hitSlop={20}>
          <ArrowBackImage />
        </TouchableOpacity>
        <View style={GLOBAL_STYLES.flex_1_center}>
          <View>
            <Box width={BoxSize} height={BoxSize} />
            <View style={styles.error}>
              {/* {isFetchBaseQueryError(error) &&
                isFetchBaseQueryError(error).data && (
                  <AppText variant={TextVariant.S_R} color={TextColors.error}>
                    {isFetchBaseQueryError(error).data}
                  </AppText>
                )} */}
              {error && (
                <AppText variant={TextVariant.S_R} color={TextColors.error}>
                  {error}
                </AppText>
              )}
            </View>
          </View>
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  backButton: {
    position: 'absolute',
    marginLeft: 20,
    zIndex: 9,
  },
  error: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
    bottom: -vp(95),
  },
});
