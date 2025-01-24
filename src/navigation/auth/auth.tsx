import React, {useMemo} from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {
  LoginForpoints,
  RegisterScreen,
  LoginScreen,
  ResetPassword,
  PreviewScreen,
  SelectStateScreen,
  ResetPasswordSuccess,
  WebViewScreenAuth,
} from '~/screens';
import {AuthStackParamList, AuthStackRoutes} from './entities';
import {userModel} from '~/storage/models/user';

const Stack = createStackNavigator<AuthStackParamList>();
export const AuthNavigator = () => {
  const currentInitialRouteName = useMemo(() => {
    if (!userModel.getUserRegionId()) {
      return AuthStackRoutes.PreviewScreen;
    }
    return AuthStackRoutes.RegisterScreen;
  }, []);
  return (
    <Stack.Navigator
      initialRouteName={currentInitialRouteName}
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen
        name={AuthStackRoutes.PreviewScreen}
        component={PreviewScreen}
      />
      <Stack.Screen
        name={AuthStackRoutes.SelectState}
        component={SelectStateScreen}
      />

      <Stack.Screen
        name={AuthStackRoutes.RegisterScreen}
        component={RegisterScreen}
      />
      <Stack.Screen
        name={AuthStackRoutes.LoginScreen}
        component={LoginScreen}
      />
      <Stack.Screen
        name={AuthStackRoutes.ResetPassword}
        component={ResetPassword}
      />
      <Stack.Screen
        name={AuthStackRoutes.ResetPasswordSuccess}
        component={ResetPasswordSuccess}
      />
      <Stack.Screen
        name={AuthStackRoutes.LoginForPoints}
        component={LoginForpoints}
      />
      <Stack.Screen
        name={AuthStackRoutes.WebViewScreenAuth}
        component={WebViewScreenAuth}
      />
    </Stack.Navigator>
  );
};
