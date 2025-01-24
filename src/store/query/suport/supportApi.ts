import {apiSlice} from '../apiSlice';
import {SendMessageToSupportRequest} from './types';

export const supportApi = apiSlice.injectEndpoints({
  endpoints: builder => ({
    sendMessageToSupport: builder.mutation<void, SendMessageToSupportRequest>({
      query: data => ({
        url: 'support',
        method: 'POST',
        data: data,
      }),
    }),
  }),
});

export const {useSendMessageToSupportMutation} = supportApi;
