import React, {FC, useEffect, useState, useCallback} from 'react';
import {StyleSheet, View} from 'react-native';

import {useEngine, EngineView} from '@babylonjs/react-native';
import {Camera} from '@babylonjs/core';
import {GLOBAL_STYLES} from '~/theme';
import {IS_IOS} from '~/constants/layout';
import {useFocusEffect} from '@react-navigation/native';
import {arScene} from './ar-scene';
import {IArScanner} from '../interfaces/i-ar-scanner';
import {IScannerListener} from '../interfaces/i-scanner-listener';
import {ScannerMarker} from '../data/scanner-marker';
import {ISceneTouchListener} from '../interfaces/scene-touch-listener';
import {ISceneListener} from '../interfaces/i-scene-listener';
import {PinchGestureHandler} from 'react-native-gesture-handler';

interface SceneElement {
  children?: React.ReactNode;
  scanner?: IArScanner;
  scannerListener?: IScannerListener;
  scannerData?: ScannerMarker[];
  sceneTouchListener?: ISceneTouchListener;
  sceneListener?: ISceneListener;
}
export const SceneView: FC<SceneElement> = ({
  children,
  scanner,
  scannerListener,
  scannerData,
  sceneTouchListener,
  sceneListener,
}) => {
  const engine = useEngine();
  const [camera, setCamera] = useState<Camera>();

  useEffect(() => {
    if (engine) {
      const scene = arScene.init(
        engine,
        scanner,
        scannerData,
        scannerListener,
        sceneTouchListener,
        sceneListener,
      );
      if (scene.activeCamera) {
        setCamera(scene.activeCamera);
      }
    }
  }, [engine]);
  useEffect(() => {
    if (engine && scannerData) {
      scanner?.setMarkers(scannerData);
    }
  }, [engine, scannerData]);
  useFocusEffect(
    useCallback(() => {
      return () => {
        arScene.clearScene();
      };
    }, []),
  );

  const onPinchStart = () => {
    sceneTouchListener?.onPinchStart();
  };
  const onPinchGestureEvent = (e: any) => {
    sceneTouchListener?.onPinch(e.nativeEvent.scale);
  };
  const onPinchEnd = () => {
    sceneTouchListener?.onPinchEnd();
  };
  return (
    <PinchGestureHandler
      onGestureEvent={onPinchGestureEvent}
      onBegan={onPinchStart}
      onEnded={onPinchEnd}>
      <View style={[styles.root]}>
        <EngineView
          camera={camera}
          antiAliasing={1}
          isTransparent={IS_IOS}
          displayFrameRate={false}
          androidView="TextureView"
          style={[GLOBAL_STYLES.flex_1]}
        />

        {children}
      </View>
    </PinchGestureHandler>
  );
};

const styles = StyleSheet.create({
  root: {
    width: '100%',
    flex: 1,
  },
});
