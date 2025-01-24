import React, {FC} from 'react';
import Background from '~/assets/images/draft/welcome.png';
import {ImageBackground, StatusBar, StyleSheet, View} from 'react-native';
import {HEIGHT, WIDTH} from '~/constants/layout';
import {FocusAwareStatusBar} from '~/components';

interface ImageBackgroundWrapperProps {
  children?: React.ReactNode;
  image?: any;
}

const barHeight = StatusBar?.currentHeight || 0;

export const ImageBackgroundWrapper: FC<ImageBackgroundWrapperProps> = ({
  children,
  image,
}) => {
  return (
    <>
      <FocusAwareStatusBar
        barStyle="dark-content"
        translucent
        backgroundColor={'transparent'}
      />
      <ImageBackground
        imageStyle={{width: WIDTH, height: HEIGHT + 7 + barHeight}}
        source={image || Background}>
        <View style={styles.root}>{children}</View>
      </ImageBackground>
    </>
  );
};

const styles = StyleSheet.create({
  root: {
    width: WIDTH,
    height: HEIGHT + barHeight,
  },
});
