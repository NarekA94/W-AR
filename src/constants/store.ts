import {Platform} from 'react-native';
export const APP_STORE_URL =
  'https://apps.apple.com/us/app/weelar/id1601307559';
export const PLAY_MARKET_URL = 'market://details?id=io.weedar.app';

export const STORE_URL = Platform.select({
  ios: APP_STORE_URL,
  android: PLAY_MARKET_URL,
});
