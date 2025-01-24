import React, {FC, useCallback, useRef, useState} from 'react';
import {
  GestureResponderEvent,
  Image,
  StyleSheet,
  View,
  TouchableOpacity,
} from 'react-native';
import {AppText} from '~/components';
import LottieView from 'lottie-react-native';
import FastImage from 'react-native-fast-image';
import {useEngine, EngineView} from '@babylonjs/react-native';
import {Camera} from '@babylonjs/core';
import {GLOBAL_STYLES, TextVariant, FontWeight, TextColors} from '~/theme';
import {IS_IOS} from '~/constants/layout';
import {product3DModel} from './3d-model';
import CubePlaceholder from '~/assets/gif/Cube.webp';
import {useFocusEffect} from '@react-navigation/native';
import {useIntl} from 'react-intl';
import {logger} from '~/utils';

const WebPImage = IS_IOS ? Image : FastImage;

interface I3DElement {
  modelUri: string;
  height?: number;
  onLoadEnd?: () => void;
  handlePressIn?: () => void;
  handlePressOut?: () => void;
}
const swipeLimit = 3;

export const Element3D: FC<I3DElement> = ({
  modelUri,
  onLoadEnd,
  handlePressIn,
  handlePressOut,
}) => {
  const engine = useEngine();

  const intl = useIntl();

  const [camera, setCamera] = useState<Camera>();
  const [loading, setLoading] = useState<boolean>(true);

  let touchStartY = useRef<number | null>(null);
  let touchStartX = useRef<number | null>(null);

  const [currentTutorialStep, setCurrentTutorialStep] = useState<number>(0);
  const [showTutorial, setShowTutorial] = useState<boolean>(false);
  const [showSkipButton, setShowSkipButton] = useState<boolean>(false);

  useFocusEffect(
    React.useCallback(() => {
      (async () => {
        if (engine && modelUri) {
          requestAnimationFrame(async () => {
            try {
              product3DModel.init(engine, modelUri);
              await product3DModel.initProductModel();
              if (product3DModel.activeCamera) {
                setCamera(product3DModel.activeCamera);
              }
            } catch (error) {
              setLoading(false);
              logger.warn(error);
            } finally {
              onLoadEnd?.();
            }
          });

          const handleOnLoadChange = () => {
            setLoading(false);
          };
          const handleTutorialStepChange = (newStep: number) => {
            setCurrentTutorialStep(newStep);
          };

          const handleShowTutorialChange = (show: boolean) => {
            setShowTutorial(show);
          };

          const handleShowSkipButtonChange = (show: boolean) => {
            setShowSkipButton(show);
          };
          product3DModel.addOnChangeLoading(handleOnLoadChange);
          product3DModel.addOnChangeStepCallback(handleTutorialStepChange);
          product3DModel.addOnShowTutorialCallback(handleShowTutorialChange);
          product3DModel.addOnChangeSkipButtonCallback(
            handleShowSkipButtonChange,
          );

          return () => {
            product3DModel.removeOnChangeStepCallback(handleTutorialStepChange);
            product3DModel.removeOnShowTutorialCallback(
              handleShowTutorialChange,
            );
            product3DModel.removeOnChangeSkipButtonCallback(
              handleShowSkipButtonChange,
            );
          };
        }
      })();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [engine, modelUri]),
  );

  useFocusEffect(
    React.useCallback(() => {
      return () => {
        product3DModel.killModel();
      };
    }, []),
  );

  const onTouchStart = useCallback(
    (e: GestureResponderEvent) => {
      touchStartY.current = e.nativeEvent.pageY;
      touchStartX.current = e.nativeEvent.pageX;
      handlePressIn?.();
    },
    [handlePressIn],
  );

  const onTouchEnd = useCallback(
    (e: GestureResponderEvent) => {
      if (touchStartY.current !== null && touchStartX.current !== null) {
        const yDelta = Math.abs(touchStartY.current - e.nativeEvent.pageY);
        const xDelta = Math.abs(touchStartX.current - e.nativeEvent.pageX);
        handlePressOut?.();
        if (yDelta > swipeLimit) {
          if (product3DModel.xrSession) {
            product3DModel.animateModel();
          }
          return;
        }

        if (yDelta <= swipeLimit && xDelta <= swipeLimit) {
          if (product3DModel.xrSession) {
            product3DModel.createInputHandling();
          } else {
            product3DModel.animateModel();
          }
          return;
        }
      }
    },
    [handlePressOut],
  );

  const handlePressSkip = useCallback(() => {
    product3DModel.setShowTutorial(false);
    product3DModel.storeData(true);
  }, [product3DModel.showTutorial]);

  return (
    <View style={styles.root}>
      <View
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        style={GLOBAL_STYLES.flex_1}>
        <EngineView
          camera={camera}
          antiAliasing={1}
          isTransparent={IS_IOS}
          displayFrameRate={false}
          androidView="TextureView"
          style={GLOBAL_STYLES.flex_1}
        />
      </View>

      {loading && (
        <View style={styles.placeholder}>
          <WebPImage
            style={{width: vp(232), height: vp(232)}}
            source={CubePlaceholder}
          />
        </View>
      )}
      {showTutorial && (
        <View pointerEvents="none" style={styles.tutorialContainer}>
          <LottieView
            style={styles.lottieAnimation}
            source={product3DModel.tutorialSteps[currentTutorialStep].image}
            autoPlay
            loop
          />

          <AppText style={styles.tutorialTitle} variant={TextVariant['13_4A']}>
            {product3DModel.tutorialSteps[currentTutorialStep].text}
          </AppText>
        </View>
      )}

      {showTutorial && showSkipButton && (
        <View style={styles.skipContainer}>
          <TouchableOpacity style={styles.skipButton} onPress={handlePressSkip}>
            <AppText
              fontWeight={FontWeight.W600}
              variant={TextVariant.S_R}
              color={TextColors.A100}>
              {intl.formatMessage({
                id: 'ar_skip_buttons',
                defaultMessage: 'Skip',
              })}
            </AppText>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    width: '100%',
    flex: 1,
  },
  placeholder: {
    justifyContent: 'center',
    alignItems: 'center',
    ...StyleSheet.absoluteFillObject,
    paddingBottom: vp(50),
  },

  tutorialContainer: {
    justifyContent: 'flex-start',
    alignItems: 'center',

    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    marginBottom: 180,
    marginLeft: 69,
    marginRight: 69,
  },

  tutorialTitle: {
    textAlign: 'center',
    fontSize: 16,
  },

  lottieAnimation: {
    width: 150,
    height: 150,
  },

  skipContainer: {
    flex: 1,
    marginTop: vp(33),
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    position: 'absolute',
    right: 0,
    Top: 0,
    padding: 20,
  },
  skipButton: {
    padding: 10,
    borderRadius: 5,
    fontSize: 16,
  },
});
