import React, {FC} from 'react';
import Background from '~/assets/images/draft/welcome.png';
import {
  ColorValue,
  ImageBackground,
  StyleSheet,
  View,
  StatusBarStyle,
  StyleProp,
  ViewStyle,
  ImageSourcePropType,
} from 'react-native';
import {FocusAwareStatusBar} from '~/components';

interface ImageColorBackgroundWrapperProps {
  children?: React.ReactNode;
  image?: ImageSourcePropType;
  backgroundColor?: ColorValue;
  statusBarStyle: StatusBarStyle;
  containerStyle?: StyleProp<ViewStyle>;
}

export const ImageColorBackgroundWrapper: FC<
  ImageColorBackgroundWrapperProps
> = ({children, image, backgroundColor, statusBarStyle, containerStyle}) => {
  return (
    <View style={containerStyle}>
      <FocusAwareStatusBar
        barStyle={statusBarStyle}
        translucent
        backgroundColor={'transparent'}
      />

      {image ? (
        <ImageBackground
          style={[styles.container, {backgroundColor: backgroundColor}]}
          source={image || Background}>
          <View style={styles.container}>{children}</View>
        </ImageBackground>
      ) : (
        <View style={[styles.container, {backgroundColor: backgroundColor}]}>
          {children}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
