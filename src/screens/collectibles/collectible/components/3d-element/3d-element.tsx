import React, {FC, useEffect, useState} from 'react';
import {Image, StyleSheet, View} from 'react-native';
import FastImage from 'react-native-fast-image';

import {useEngine, EngineView} from '@babylonjs/react-native';
import {Camera} from '@babylonjs/core';
import {GLOBAL_STYLES} from '~/theme';
import {IS_IOS} from '~/constants/layout';
import {model3d} from './3d-model';
import CubePlaceholder from '~/assets/gif/Cube.webp';
import {useFocusEffect} from '@react-navigation/native';

const WebPImage = IS_IOS ? Image : FastImage;

interface I3DElement {
  modelUri: string;
  height?: number;
}

export const Element3D: FC<I3DElement> = ({modelUri}) => {
  const engine = useEngine();
  const [camera, setCamera] = useState<Camera>();
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (engine) {
      setLoading(true);
      const activeCamera = model3d.init(engine, modelUri, onLoadEnd);
      if (activeCamera) {
        setCamera(activeCamera);
      }
    }
    function onLoadEnd() {
      setLoading(false);
    }
  }, [engine]);

  useFocusEffect(
    React.useCallback(() => {
      return () => {
        model3d.killModel();
      };
    }, []),
  );

  return (
    <View style={[styles.root]}>
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
    flex: 1,
  },
  placeholder: {
    justifyContent: 'center',
    alignItems: 'center',
    ...StyleSheet.absoluteFillObject,
    paddingBottom: vp(50),
  },
});
