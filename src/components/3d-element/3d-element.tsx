import React, {FC, useCallback, useRef, useState} from 'react';
import {GestureResponderEvent, Image, StyleSheet, View} from 'react-native';

import {useEngine, EngineView} from '@babylonjs/react-native';
import {Camera} from '@babylonjs/core';
import '@babylonjs/loaders/glTF';
import {GLOBAL_STYLES} from '~/theme';
import {IS_IOS} from '~/constants/layout';
import CubePlaceholder from '~/assets/gif/Cube.webp';
import FastImage from 'react-native-fast-image';
import {useFocusEffect} from '@react-navigation/native';
import {model3d} from './3d-model';
import {logger} from '~/utils';

const WebPImage = IS_IOS ? Image : FastImage;

interface I3DElement {
  modelUri?: string;
  height?: number;
  onLoadEnd?: () => void;
  handlePressIn?: () => void;
  handlePressOut?: () => void;
}
const swipeLimit = 3;

export const Element3D: FC<I3DElement> = ({
  modelUri,
  height = vp(302),
  onLoadEnd,
  handlePressIn,
  handlePressOut,
}) => {
  const engine = useEngine();
  const [camera, setCamera] = useState<Camera>();
  let touchStartY = useRef<number | null>(null);
  let touchStartX = useRef<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useFocusEffect(
    React.useCallback(() => {
      (async () => {
        if (engine && modelUri) {
          requestAnimationFrame(async () => {
            try {
              model3d.init(engine, modelUri);
              await model3d.initModel();
              if (model3d.activeCamera) {
                setCamera(model3d.activeCamera);
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

          model3d.addOnChangeLoading(handleOnLoadChange);
        }
      })();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [engine, modelUri]),
  );

  useFocusEffect(
    useCallback(() => {
      return () => {
        model3d.killModel();
        setLoading(true);
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
        if (yDelta <= swipeLimit && xDelta <= swipeLimit) {
          model3d.animate();
          return;
        }
      }
    },
    [handlePressOut],
  );

  return (
    <View
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      style={[styles.root, {height: height}]}>
      <EngineView
        camera={camera}
        antiAliasing={1}
        isTransparent={IS_IOS}
        displayFrameRate={false}
        androidView="TextureView"
        style={[GLOBAL_STYLES.flex_1]}
      />
      {loading && (
        <View style={styles.placeholder}>
          <WebPImage
            style={{width: vp(232), height: vp(232)}}
            source={CubePlaceholder}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    width: '100%',
  },
  placeholder: {
    justifyContent: 'center',
    alignItems: 'center',
    ...StyleSheet.absoluteFillObject,
  },
});
