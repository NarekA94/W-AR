import {Dimensions, Platform, PixelRatio} from 'react-native';

const Design_WIDTH = 375;

const {height, width} = Dimensions.get('window');

const defaultAspectRatio = 16 / 9;
const currentScreenAspectRatio = height / width;

const k =
  Platform.OS === 'ios'
    ? 1
    : defaultAspectRatio < currentScreenAspectRatio
    ? 1
    : 0.94;

export const getResponsiveValue = (size: number): number => {
  return PixelRatio.roundToNearestPixel((width * size * k) / Design_WIDTH);
};
