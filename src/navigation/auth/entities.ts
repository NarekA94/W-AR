import {
  NativeStackNavigationProp,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';

export enum AuthStackRoutes {
  PreviewScreen = 'PreviewScreen',
  RegisterScreen = 'RegisterScreen',
  LoginScreen = 'LoginScreen',
  ResetPassword = 'ResetPassword',
  ResetPasswordSuccess = 'ResetPasswordSuccess',
  PhoneNumber = 'PhoneNumber',
  PhoneNumberVerify = 'PhoneNumberVerify',
  LoginForPoints = 'LoginForPoints',
  SelectState = 'SelectState',
  WebViewScreenAuth = 'WebViewScreenAuth',
}

export interface RouteUserData {
  email: string;
  password: string;
}

export type AuthStackParamList = {
  [AuthStackRoutes.PreviewScreen]: undefined;
  [AuthStackRoutes.RegisterScreen]: {showLocationAlert?: boolean} | undefined;
  [AuthStackRoutes.SelectState]: undefined;
  [AuthStackRoutes.LoginScreen]: undefined;
  [AuthStackRoutes.ResetPassword]: undefined;
  [AuthStackRoutes.ResetPasswordSuccess]: undefined;
  [AuthStackRoutes.PhoneNumber]: RouteUserData;
  [AuthStackRoutes.LoginForPoints]: {qrToken: string};
  [AuthStackRoutes.PhoneNumberVerify]: {
    verificationId: string;
    phoneNumber: string;
    user: RouteUserData;
  };
  [AuthStackRoutes.WebViewScreenAuth]: {uri: string};
};

export type AuthScreenNavigationProp =
  NativeStackNavigationProp<AuthStackParamList>;

export type AuthStackParamProps<T extends keyof AuthStackParamList> =
  NativeStackScreenProps<AuthStackParamList, T>;
