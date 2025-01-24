import {Content, TextVariant, FontWeight} from '../entities';
import {fontFamily} from './font-family';
const colors: Content['colors'] = {
  primary: '#000000',
  activityIndicator: '#696969',
  background: {
    primary: '#FFFFFF',
    secondary: '#1E1E1F',
    light: '#bcc9cf',
    disabled: 'rgba(0, 0, 0, 0.3)',
    gray: '#333333',
    red: 'rgba(255, 76, 86, 0.1)',
    sheet: '#252525',
  },
  pink: {
    bold: '#F51D78',
    semiBold: '#FFBAF3',
    light: 'rgba(255, 241, 252, 0.45)',
    medium: 'rgba(255, 186, 243, 0.45)',
  },
  blue: {
    bold: '#4B64FF',
    medium: '#B1C7FF',
    light: '#F1F5FF',
  },
  green: {
    bold: '#3CAA6E',
    medium: '#B8FFB8',
    light: '#EDFCED',
  },
  secondary: '#1E1E1F',
  common: {
    error: '#FF4C56',
    success: '#3CAA6E',
  },
  gray: '#999999',
  border: {
    E020: 'rgba(75, 100, 255, 0.2)',
    E01: 'rgba(75, 100, 255, 0.1)',
    E005: 'rgba(75, 100, 255, 0.05)',
    A01: 'rgba(245, 245, 245, 0.1)',
    A020: '#454545',
    A030: '#B9B9B9',
    success: '#B8FFB8',
  },
  buttonTextColors: {1: '#FFFFFF', 2: '#000000'},
  textColors: {
    G100: '#888888',
    G090: '#BBBBBB',
    G080: '#C4C4C4',
    G070: '#BABABA',
    B100: '#000000',
    B070: 'rgba(0, 0, 0, 0.7)',
    B060: 'rgba(0, 0, 0, 0.6)',
    B040: 'rgba(0, 0, 0, 0.4)',
    B020: 'rgba(0, 0, 0, 0.2)',
    E100: '#4B64FF',
    A060: 'rgba(255, 255, 255, 0.6)',
    A100: '#FFFFFF',
    A045: 'rgba(255, 255, 255, 0.45)',
    P100: '#FF4CD8',
    secondary: '#FFFFFF',
    gray: '#999999',
    error: '#FF4C56',
    green: '#BFFFBF',
  },
  textGradient: [
    'rgba(255, 255, 255, 0.3)',
    'rgba(255, 255, 255, 1)',
    'rgba(255, 255, 255, 0.3)',
  ],
};

export const lightContent: Content = {
  colors,
  fontFamily,
  input: {
    borderRadius: 13,
    textVariant: TextVariant.S_R,
    layout: {
      base: {
        height: vp(50),
        paddingHorizontal: 12,
      },
      multiline: {
        height: 104,
        paddingHorizontal: 0,
      },
    },
    colors: {
      base: {
        text: colors.textColors.A100,
        placeholder: colors.textColors.G100,
        background: colors.primary,
        border: colors.border.A020,
      },
      focused: {
        text: colors.primary,
        placeholder: colors.textColors.G100,
        background: colors.background.primary,
        border: colors.primary,
      },
    },
  },
  button: {
    primary: {
      backgroundColor: colors.primary,
      textColor: colors.textColors.A100,
    },
    gray: {
      backgroundColor: colors.background.gray,
      textColor: colors.textColors.A100,
    },
    disabled: {
      backgroundColor: colors.background.disabled,
      textColor: colors.textColors.A100,
    },
    outline: {
      backgroundColor: 'transparent',
      borderWidth: 1,
      borderColor: colors.primary,
      textColor: colors.buttonTextColors['2'],
    },
    light: {
      backgroundColor: colors.background.light,
      textColor: colors.buttonTextColors['2'],
      fontWeight: FontWeight.W500,
    },
    red: {
      backgroundColor: colors.background.red,
      textColor: colors.textColors.error,
    },
  },
  shadow: {
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    shadowColor: colors.primary,
  },
  text: {
    H1_B: {
      fontFamily: fontFamily[FontWeight.W600],
      fontSize: 40,
      color: colors.textColors.B100,
      lineHeight: 50,
    },
    H1_L: {
      fontFamily: fontFamily[FontWeight.W300],
      fontSize: 40,
      color: colors.textColors.B100,
    },
    H2_B: {
      fontFamily: fontFamily[FontWeight.W600],
      fontSize: 32,
      color: colors.textColors.B100,
    },
    H2_A: {
      fontFamily: fontFamily[FontWeight.W500],
      fontSize: 32,
      color: colors.textColors.A100,
    },
    H3_B: {
      fontFamily: fontFamily[FontWeight.W600],
      fontSize: 24,
      color: colors.textColors.B100,
    },
    H3_L: {
      fontFamily: fontFamily[FontWeight.W300],
      fontSize: 28,
      color: colors.textColors.B100,
    },
    H3_A: {
      fontFamily: fontFamily[FontWeight.W500],
      fontSize: 28,
      color: colors.textColors.A100,
    },
    H4_G: {
      fontFamily: fontFamily[FontWeight.W600],
      fontSize: 22,
      color: colors.textColors.G100,
    },
    H4_B: {
      fontFamily: fontFamily[FontWeight.W600],
      fontSize: 20,
      color: colors.textColors.B100,
    },
    H_5: {
      fontFamily: fontFamily[FontWeight.W600],
      fontSize: 18,
      color: colors.textColors.A100,
    },
    H5_M: {
      fontFamily: fontFamily[FontWeight.W400],
      fontSize: 18,
      color: colors.textColors.A100,
    },
    H_6_W5: {
      fontFamily: fontFamily[FontWeight.W500],
      fontSize: 15,
      color: colors.textColors.A100,
    },
    B_B: {
      fontFamily: fontFamily[FontWeight.W600],
      fontSize: 20,
      color: colors.textColors.B100,
    },
    B: {
      fontFamily: fontFamily[FontWeight.W400],
      fontSize: 12,
      color: colors.textColors.G100,
    },
    M_B: {
      fontFamily: fontFamily[FontWeight.W600],
      fontSize: 16,
      color: colors.textColors.B100,
    },
    M_R: {
      fontFamily: fontFamily[FontWeight.W400],
      fontSize: 16,
      color: colors.textColors.B100,
    },
    R: {
      fontFamily: fontFamily[FontWeight.W400],
      fontSize: vp(12),
      color: colors.textColors.B040,
    },
    S_R: {
      fontFamily: fontFamily[FontWeight.W400],
      fontSize: 14,
      color: colors.textColors.B100,
      lineHeight: 15,
    },
    S_B: {
      fontFamily: fontFamily[FontWeight.W600],
      fontSize: 14,
      color: colors.textColors.B100,
    },
    S_5W: {
      fontFamily: fontFamily[FontWeight.W500],
      fontSize: 14,
      color: colors.textColors.A100,
    },
    S_L: {
      fontFamily: fontFamily[FontWeight.W300],
      fontSize: 14,
      color: colors.textColors.G100,
    },
    P_M: {
      fontFamily: fontFamily[FontWeight.W400],
      fontSize: 12,
      color: colors.textColors.A100,
    },
    P: {
      fontFamily: fontFamily[FontWeight.W300],
      fontSize: 12,
      color: colors.textColors.G080,
    },
    O_H1_M: {
      fontFamily: fontFamily[FontWeight.OW500],
      fontSize: 28,
      color: colors.textColors.B100,
    },
    D_15_A: {
      fontFamily: fontFamily[FontWeight.DW400],
      fontSize: 15,
      color: colors.textColors.A100,
    },
    '10_4A': {
      fontFamily: fontFamily[FontWeight.W400],
      fontSize: 10,
      color: colors.textColors.A100,
    },
    '10_4G': {
      fontFamily: fontFamily[FontWeight.W400],
      fontSize: 10,
      color: colors.textColors.G090,
    },
    '24_5A': {
      fontFamily: fontFamily[FontWeight.W500],
      fontSize: 24,
      color: colors.textColors.A100,
    },
    '24_4A': {
      fontFamily: fontFamily[FontWeight.W400],
      fontSize: 24,
      color: colors.textColors.A100,
    },
    '13_4A': {
      fontFamily: fontFamily[FontWeight.W400],
      fontSize: 13,
      color: colors.textColors.A100,
    },
  },
};
