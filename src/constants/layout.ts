import {Dimensions, Platform} from 'react-native';

export const WIDTH = Dimensions.get('window').width;
export const HEIGHT = Dimensions.get('window').height;
export const IS_IOS = Platform.OS === 'ios';
export const IS_ANDROID = Platform.OS === 'android';
export const Tab_Bar_Inset = 22;
export const PHONE_MASK = [
  '+',
  /\d/,
  ' ',
  ' ',
  ' ',
  '(',
  /\d/,
  /\d/,
  /\d/,
  ')',
  ' ',
  /\d/,
  /\d/,
  /\d/,
  '-',
  /\d/,
  /\d/,
  /\d/,
  /\d/,
  /\d/,
  /\d/,
];

export const isScreenSmallerThanIPhone8 = () => {
  return IS_IOS && HEIGHT <= 667;
};

export const isScreenSmallerThenS9 = HEIGHT <= 740;
