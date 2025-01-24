import messaging from '@react-native-firebase/messaging';
import {logger} from './logger';
import {httpClient} from '~/api/httpClient';
import {Platform} from 'react-native';
import {authModel} from '~/storage/models/auth';
import {PERMISSIONS, request, RESULTS} from 'react-native-permissions';

export const getFcmToken = async (): Promise<string | undefined> => {
  try {
    if (Platform.OS === 'android') {
      const res = await request(PERMISSIONS.ANDROID.POST_NOTIFICATIONS);
      if (res === RESULTS.BLOCKED) {
        return;
      }
    }
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;
    if (enabled) {
      await messaging().registerDeviceForRemoteMessages();
      const fcmToken = await messaging().getToken();
      return fcmToken;
    } else {
      throw 'notification permission denied';
    }
  } catch (error) {
    logger.warn(error);
  }
};

export const registerUserForMessaging = async (id: number) => {
  try {
    const fcmSaved = authModel.getFcmSuccessfullySaved();
    if (fcmSaved) {
      return;
    }
    const fcmToken = await getFcmToken();

    if (fcmToken) {
      httpClient.put(`/user/${id}/token`, {firebaseToken: fcmToken});
      authModel.setFcmSuccessfullySaved(true);
    }
  } catch (error) {
    logger.warn(error);
  }
};
