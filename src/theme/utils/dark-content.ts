// @ts-nocheck
// need to update after finishing light-content
import {Content} from '../entities';
import {fontFamily} from './font-family';
const colors: Content['colors'] = {
  primary: '#000000',
  background: {1: '#FFFFFF', 2: '#F5FAFF'},
  secondary: '#666666',
  common: {
    error: '#ED3C30',
    success: 'green',
  },
  gray: {1: '#E0E0E0', 2: '#999999'},
  textColors: {
    h1: '#000000',
    p: '#666666',
    h4: '#999999',
  },
};

export const darkContent: Content = {
  colors,
  fontFamily,
  input: {
    borderRadius: 0,
    textVariant: 'p',
    layout: {
      base: {
        height: 40,
        paddingHorizontal: 0,
      },
      multiline: {
        height: 104,
        paddingHorizontal: 0,
      },
    },
    colors: {
      base: {
        text: colors.primary,
        placeholder: colors.primary,
        background: colors.background['1'],
        border: colors.gray['1'],
      },
    },
  },
  text: {
    h1: {
      fontFamily: fontFamily['700'],
      fontSize: 20,
      color: colors.textColors.h1,
    },
    h4: {
      fontFamily: fontFamily['400'],
      fontSize: 12,
      color: colors.textColors.h4,
    },
    p: {
      fontFamily: fontFamily['400'],
      fontSize: 16,
      color: colors.textColors.p,
    },
  },
};
