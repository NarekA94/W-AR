import {ImageStyle, ShadowStyleIOS, TextStyle, ViewStyle} from 'react-native';

export type ThemeContent = 'dark' | 'light';

export enum ButtonVariant {
  PRIMARY = 'primary',
  GRAY = 'gray',
  OUTLINE = 'outline',
  LIGHT = 'light',
  DISABLED = 'disabled',
  RED = 'red',
}

export interface ButtonThemeProps {
  backgroundColor: string;
  borderWidth?: number;
  borderColor?: string;
  textColor?: string;
  fontWeight?: FontWeight;
}

export enum TextVariant {
  H1_L = 'H1_L',
  H1_B = 'H1_B',
  H2_B = 'H2_B',
  H2_A = 'H2_A',
  H3_B = 'H3_B',
  H3_L = 'H3_L',
  H3_A = 'H3_A',
  H4_B = 'H4_B',
  H_5 = 'H_5',
  H5_M = 'H5_M',
  B_B = 'B_B',
  B = 'B',
  M_B = 'M_B',
  M_R = 'M_R',
  R = 'R',
  S_R = 'S_R',
  S_B = 'S_B',
  S_L = 'S_L',
  H4_G = 'H4_G',
  P = 'P',
  P_M = 'P_M',
  H_6_W5 = 'H_6_W5',
  S_5W = 'S_5W',
  '10_4G' = '10_4G',
  '10_4A' = '10_4A',
  '24_5A' = '24_5A',
  '24_4A' = '24_4A',
  '13_4A' = '13_4A',
  O_H1_M = 'O_H1_M',
  D_15_A = 'D_15_A',
}

export enum TextColors {
  G100 = 'G100',
  G090 = 'G090',
  G080 = 'G080',
  G070 = 'G070',
  B100 = 'B100',
  B070 = 'B070',
  B060 = 'B060',
  B040 = 'B040',
  B020 = 'B020',
  E100 = 'E100',
  A060 = 'A060',
  A100 = 'A100',
  A045 = 'A045',
  P100 = 'P100',
  secondary = 'secondary',
  gray = 'gray',
  error = 'error',
  green = 'green',
}

export enum FontWeight {
  W100 = '100',
  W200 = '200',
  W300 = '300',
  W400 = '400',
  W500 = '500',
  W600 = '600',
  W700 = '700',
  W800 = '800',
  W900 = '900',
  OW500 = 'O500',
  DW400 = 'D400',
}

export enum BorderColor {
  E020 = 'E020',
  E01 = 'E01',
  E005 = 'E005',
  A01 = 'A01',
  A020 = 'A020',
  A030 = 'A030',
  success = 'success',
}

export interface TextThemeProps {
  fontFamily: string;
  fontSize: number;
  lineHeight?: number;
  color: string;
}

export interface Shadow extends ShadowStyleIOS {
  elevation?: number | undefined;
}

export type FontFamily = Record<FontWeight, string>;

export type BackgroundColor =
  | 'primary'
  | 'secondary'
  | 'light'
  | 'disabled'
  | 'gray'
  | 'red'
  | 'sheet';
export type PinkColor = 'bold' | 'light' | 'medium' | string;
export type BlueColor = PinkColor;
export type GreenColor = PinkColor;

export interface Content {
  colors: {
    textGradient: string[];
    activityIndicator: string;
    primary: string;
    background: Record<BackgroundColor, string>;
    pink: Record<PinkColor, string>;
    blue: Record<BlueColor, string>;
    green: Record<BlueColor, string>;
    secondary: string;
    negative?: string;
    common: {
      error: string;
      success: string;
    };
    gray: string;
    border: Record<BorderColor, string>;
    textColors: Record<TextColors, string>;
    buttonTextColors: Record<number, string>;
  };
  input: {
    textVariant: TextVariant;
    borderRadius: number;
    colors: {
      base: InputColors;
      focused: InputColors;
    };
    layout: {
      base: {
        height: number;
        paddingHorizontal: number;
      };
      multiline: {
        height: number;
        paddingHorizontal: number;
      };
    };
  };
  fontFamily: FontFamily;
  text: Record<TextVariant, TextThemeProps>;
  button: Record<ButtonVariant, ButtonThemeProps>;
  shadow: Shadow;
}

export type ITheme = Record<ThemeContent, Content>;

export interface InputColors {
  background: string;
  text: string;
  placeholder: string;
  border: string;
}

export type NamedStyles<T> = {
  [key in keyof T]: ViewStyle | TextStyle | ImageStyle;
};
