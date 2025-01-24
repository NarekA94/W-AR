import {Platform} from 'react-native';
import Config from '~/config/api';

const isAndroid = Platform.OS === 'android';
const assetPrefix = isAndroid ? 'custom/' : '';

/**
 * Workaround for different path between OS
 *
 * https://github.com/unimonkiez/react-native-asset/issues/25
 *
 * @param path relative path from asset directory
 * @returns Sanitized Uri with app:// scheme
 */
export function resolveAssetUri(path: string) {
  return `app:///${assetPrefix}${path}`;
}
export function resolvePrivateImageUrl(path: string) {
  return `${Config.API_URL}private/img/${path}`;
}
export function ToFixNumber(e?: number, fixed = 2): string {
  if (!e) {
    return '';
  }
  return Number(e).toFixed(fixed);
}

export const delay = (timeout: number) => {
  return new Promise(res => {
    setTimeout(() => {
      res('');
    }, timeout);
  });
};

export const getLastSegmentUrl = (url: string) => {
  const urlParts = url.split('/');
  return urlParts[urlParts.length - 1];
};

export const splitQueryTokenAndUrl = (url: string, tokenName: string) => {
  const urlObject = new URL(url);
  let token = urlObject.searchParams.get(tokenName);
  return {token, url};
};

export const splitTokenAndUrl = (url: string) => {
  const urlObject = new URL(url);
  const pathName = urlObject.pathname;
  const urlParts = pathName.split('/');
  let token: string = '';
  let redeemed: boolean = false;
  if (pathName.includes('redeemed')) {
    token = urlParts[urlParts.length - 2];
    redeemed = true;
    urlParts.pop();
  } else {
    token = urlParts[urlParts.length - 1];
    redeemed = false;
  }

  urlParts.pop();
  const newUrl = urlObject.origin + urlParts.join('/');
  return {token, newUrl, redeemed};
};
