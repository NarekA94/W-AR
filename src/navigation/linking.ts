import {LinkingOptions, getStateFromPath} from '@react-navigation/native';
import {Linking} from 'react-native';
import dynamicLinks from '@react-native-firebase/dynamic-links';
import {utils} from '@react-native-firebase/app';
import {MainNavigationParamList} from './navigation';
import {authModel} from '~/storage/models/auth';
import {
  getLastSegmentUrl,
  splitQueryTokenAndUrl,
  splitTokenAndUrl,
} from '~/utils/utils';
import {authenticModel} from '~/storage/models/authentic';
import {gameModel} from '~/storage/models/game';
import {userModel} from '~/storage/models/user';
import messaging from '@react-native-firebase/messaging';
import {NotificationType, getNotificationLink} from './notification-links';
import notifee, {EventType} from '@notifee/react-native';

const BrandWebDeepLinkUrl = 'https://www.weedar.io/loyalty/qr';
const GiftScreenUrl = 'https://www.weedar.io/loginforpoints/qr/';
const RegisterScreen = 'https://www.weedar.io/register';
const PreviewScreen = 'https://www.weedar.io/preview';

export const BrandDeepLink = 'weedar://brand-screen';
export const DeepLinkPrefix = 'weedar://';
export const GameDeepLink = 'weedar://game?id=';
const currentRegistrationScreen = () => {
  return !userModel.getUserRegionId() ? PreviewScreen : RegisterScreen;
};
messaging().setBackgroundMessageHandler(async () => {});

export const linking: LinkingOptions<MainNavigationParamList> = {
  prefixes: [
    DeepLinkPrefix,
    'https://weedar.page.link',
    'https://www.weedar.io',
  ],
  async getInitialURL() {
    const {isAvailable} = utils().playServicesAvailability;

    if (isAvailable) {
      const initialLink = await dynamicLinks().getInitialLink();
      if (initialLink) {
        const authToken = authModel.getAccessToken();
        if (!authToken) {
          const lastSegment = getLastSegmentUrl(initialLink.url);
          if (lastSegment.includes('game')) {
            const {token} = splitQueryTokenAndUrl(initialLink.url, 'id');
            if (token) {
              gameModel.setGameToken(token);
            }
            return currentRegistrationScreen();
          } else {
            const {token, newUrl, redeemed} = splitTokenAndUrl(initialLink.url);
            if (newUrl === BrandWebDeepLinkUrl) {
              authenticModel.setAuthenticTokenAndStatus(token, redeemed);
              if (redeemed) {
                return currentRegistrationScreen();
              }
              return GiftScreenUrl + token;
            }
          }

          return initialLink.url;
        } else {
          return initialLink.url;
        }
      }
    }

    const message = await messaging().getInitialNotification();
    const internalMessage = await notifee.getInitialNotification();
    if (message?.data?.type || internalMessage?.notification?.data?.type) {
      const type = (message?.data?.type ||
        internalMessage?.notification?.data?.type) as NotificationType;
      const url = getNotificationLink(
        type,
        internalMessage?.notification?.data,
      );
      return url;
    }

    const url = await Linking.getInitialURL();
    return url;
  },

  subscribe(listener) {
    // Listen to firebase dynamic links
    const unsubscribeFirebase = dynamicLinks().onLink(({url}) => {
      listener(url);
      const authToken = authModel.getAccessToken();
      if (!authToken) {
        const lastSegment = getLastSegmentUrl(url);

        if (lastSegment.includes('game')) {
          const {token} = splitQueryTokenAndUrl(url, 'id');
          if (token) {
            gameModel.setGameToken(token);
          }
          listener(currentRegistrationScreen());
        } else {
          const {token, newUrl, redeemed} = splitTokenAndUrl(url);
          if (newUrl === BrandWebDeepLinkUrl) {
            authenticModel.setAuthenticTokenAndStatus(token, redeemed);
            if (redeemed) {
              listener(currentRegistrationScreen());
            } else {
              listener(GiftScreenUrl + token);
            }
          } else {
            listener(url);
          }
        }
      } else {
        listener(url);
      }
    });

    const linkingSubscription = Linking.addEventListener('url', ({url}) => {
      listener(url);
    });

    // Listen to firebase push notifications
    const unsubscribeNotification = messaging().onNotificationOpenedApp(
      async message => {
        const type = message?.data?.type as NotificationType;
        const url = getNotificationLink(
          type,
          message?.data,
          message?.notification?.body,
        );
        if (url) {
          listener(url);
        }
      },
    );

    notifee.onBackgroundEvent(async ({type, detail}) => {
      const notificationType = detail?.notification?.data
        ?.type as NotificationType;
      const url = getNotificationLink(
        notificationType,
        detail.notification?.data,
      );
      if (type === EventType.PRESS) {
        listener(url);
      }
    });
    //from app active
    const unsubscribeNotifee = notifee.onForegroundEvent(
      async ({type, detail}) => {
        const notificationType = detail?.notification?.data
          ?.type as NotificationType;
        const url = getNotificationLink(
          notificationType,
          detail?.notification?.data,
          detail?.notification?.body,
        );
        if (type === EventType.PRESS) {
          listener(url);
        }
      },
    );
    return () => {
      unsubscribeNotifee();
      unsubscribeFirebase();
      unsubscribeNotification();
      linkingSubscription.remove();
    };
  },
  config: {
    screens: {
      Auth: {
        screens: {
          LoginForPoints: 'loginforpoints/qr/:qrToken',
          RegisterScreen: 'register',
          PreviewScreen: 'preview',
        },
      },
      Main: {
        initialRouteName: 'TabNavigator',
        screens: {
          BrandScreen: 'brand-screen',
          Rewards: 'rewards/:orderNumber',
          StickerGameScreen: 'game',
        },
      },
    },
  },
  getStateFromPath: (path, options) => {
    let _path = path;
    if (path.includes('/loyalty/qr/')) {
      const redeemToken = getRedeemTokenFromUrl(path);
      _path = 'brand-screen?qrToken=' + redeemToken;
      if (path.includes('redeemed')) {
        _path = _path + '&redeemed=true';
      }
    }
    return getStateFromPath(_path, options);
  },
};

function getRedeemTokenFromUrl(url: string): string {
  const parts = url.split('/');

  const token = parts[3];
  return token;
}
