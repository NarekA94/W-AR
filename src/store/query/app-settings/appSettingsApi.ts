import {Platform} from 'react-native';
import {apiSlice} from '../apiSlice';
import {AppSettingsResponse} from './types';

export const appSettingsApi = apiSlice.injectEndpoints({
  endpoints: builder => ({
    getAppSettings: builder.query<AppSettingsResponse, void>({
      query: data => ({
        url: `app-settings/${Platform.OS}`,
        method: 'GET',
        data: data,
      }),
    }),
  }),
});

export const {useGetAppSettingsQuery} = appSettingsApi;
