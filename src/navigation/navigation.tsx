import React, {useEffect} from 'react';
import {Alert, StatusBar} from 'react-native';
import DeviceInfo from 'react-native-device-info';
import {
  useCheckForceUpdateIOSMutation,
  useCheckForceUpdateAndroidMutation,
} from '~/store/query/user/userApi';
import {IS_ANDROID, IS_IOS} from '~/constants/layout';
import {BottomSheetModalProvider} from '@gorhom/bottom-sheet';
import {
  DefaultTheme,
  DarkTheme,
  NavigationContainer,
  NavigatorScreenParams,
  NavigationContainerRef,
} from '@react-navigation/native';
import {
  AuthNavigator,
  AuthStackParamList,
  UserNavigation,
  UserStackParamList,
} from '~/navigation';
import {CodePushScreen, ForceUpdateScreen} from '~/components';
import {useIsAuth} from '~/hooks/useIsAuth';
import {useSetupUser} from '~/hooks/useSetupUser';
import {useNavigationTheme, NavigationThemes} from '~/context/navigation-theme';
import {linking} from './linking';
import {createStackNavigator} from '@react-navigation/stack';
import RNBootSplash from 'react-native-bootsplash';
import {requestTrackingPermission} from 'react-native-tracking-transparency';

export type MainNavigationParamList = {
  Main: NavigatorScreenParams<UserStackParamList>;
  Auth: NavigatorScreenParams<AuthStackParamList>;
};

export const navigationRef =
  React.createRef<NavigationContainerRef<MainNavigationParamList>>();

const Stack = createStackNavigator<MainNavigationParamList>();
export const Navigation = () => {
  useSetupUser();
  const {isAuth} = useIsAuth();
  const {theme} = useNavigationTheme();
  const [checkForceUpdateIOS, {data: iosUpdateRequired = true}] =
    useCheckForceUpdateIOSMutation();
  const [checkForceUpdateAndroid, {data: androidUpdateRequired = true}] =
    useCheckForceUpdateAndroidMutation();

  useEffect(() => {
    async function checkUpdate() {
      const appVersion = DeviceInfo.getVersion();
      if (IS_IOS) {
        checkForceUpdateIOS({version: appVersion});
      } else if (!IS_IOS) {
        checkForceUpdateAndroid({version: appVersion});
      }
    }

    const requestUserTrackingPermission = async () => {
      try {
        const status = await requestTrackingPermission();
        if (status === 'authorized' || status === 'unavailable') {
          //tracking is allowed
        } else {
          //tracking is not allowed
        }
      } catch (error) {
        Alert.alert('Error', (error as Error).message);
      }
    };

    checkUpdate();
    requestUserTrackingPermission();
  }, []);
  return (
    <NavigationContainer
      ref={navigationRef}
      onReady={RNBootSplash.hide}
      linking={linking}
      theme={theme === NavigationThemes.Dark ? DarkTheme : DefaultTheme}>
      <BottomSheetModalProvider>
        <StatusBar
          translucent
          backgroundColor="transparent"
          barStyle="light-content"
        />
        <Stack.Navigator screenOptions={{headerShown: false}}>
          {isAuth ? (
            <Stack.Screen component={UserNavigation} name="Main" />
          ) : (
            <Stack.Screen component={AuthNavigator} name="Auth" />
          )}
        </Stack.Navigator>

        {!iosUpdateRequired && IS_IOS && <ForceUpdateScreen />}
        {!androidUpdateRequired && IS_ANDROID && <ForceUpdateScreen />}
        {!__DEV__ && <CodePushScreen />}
      </BottomSheetModalProvider>
    </NavigationContainer>
  );
};
