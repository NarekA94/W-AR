import {Platform} from 'react-native';
import axios, {AxiosRequestConfig} from 'axios';
import moment from 'moment';
import Config from '~/config/api';
import {authModel} from '~/storage/models/auth';
import mem from 'mem/dist';
import {store} from '~/store';
import {logOut} from '~/store/reducers';
import DeviceInfo from 'react-native-device-info';

export const httpClient = axios.create({
  baseURL: Config.API_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    'x-timezone-offset': moment().format('Z'),
    'x-platform': `${Platform.OS}/${DeviceInfo.getSystemVersion()}`,
    AppVersion: DeviceInfo.getVersion(),
  },
});

export const resetHeaders: () => void = () => {
  httpClient.defaults.headers.common.Authorization = '';
};

httpClient.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    const token = authModel.getAccessToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  error => {
    return Promise.reject(error);
  },
);

async function renewToken() {
  const refreshToken = authModel.getRefreshToken();
  if (!refreshToken) {
    throw 'refresh token does not exist';
  }
  try {
    const res = await httpClient.post('/auth/refresh-token', {
      refreshToken,
    });
    if (res.status === 200 && res.data) {
      return {
        accessToken: res.data.accessToken,
        refreshToken: res.data.refreshToken,
      };
    } else {
      throw 'invalid token';
    }
  } catch (error) {
    throw error;
  }
}

const memoizedRenewToken = mem(renewToken, {maxAge: 20000});
httpClient.interceptors.response.use(
  res => {
    return res;
  },
  async error => {
    const originalRequest = error.config;
    if (error?.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const {accessToken, refreshToken} = await memoizedRenewToken();

        httpClient.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
        authModel.setAccessToken(accessToken);
        authModel.setRefreshToken(refreshToken);
        return httpClient(originalRequest);
      } catch {
        store.dispatch(logOut());
      }
      store.dispatch(logOut());
    }
    return Promise.reject(error);
  },
);
