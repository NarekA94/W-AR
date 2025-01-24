import {apiSlice} from '../apiSlice';
import {CustomerNotification} from './types';

export const notificationsApi = apiSlice.injectEndpoints({
  endpoints: builder => ({
    getNotifications: builder.query<CustomerNotification[], void>({
      query: () => ({
        url: '/customer-notification',
        method: 'GET',
      }),
    }),
  }),
});

export const {useGetNotificationsQuery} = notificationsApi;
