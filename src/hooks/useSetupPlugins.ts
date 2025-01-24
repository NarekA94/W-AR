import {useEffect, useRef} from 'react';
import messaging from '@react-native-firebase/messaging';
import {httpClient} from '~/api/httpClient';
import {useGetAuthUser} from './useGetAuthUser';
import {registerUserForMessaging} from '~/utils/firebase';
import {AppState} from 'react-native';

export const useSetupPlugins = () => {
  const {authUser} = useGetAuthUser();
  const appState = useRef(AppState.currentState);

  useEffect(() => {
    if (authUser && authUser.phone) {
      setTimeout(() => {
        registerUserForMessaging(authUser.id);
      }, 1000);
    }

    const subscription = AppState.addEventListener('change', nextAppState => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        if (authUser && authUser.phone) {
          registerUserForMessaging(authUser.id);
        }
      }
      appState.current = nextAppState;
    });

    const unsubscribeMessaging = messaging().onTokenRefresh(async fcmToken => {
      httpClient.put(`/user/${authUser?.id}/token`, {firebaseToken: fcmToken});
    });
    return () => {
      unsubscribeMessaging();
      subscription.remove();
    };
  }, [authUser]);
};
