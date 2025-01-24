import {apiSlice} from '../apiSlice';
import {State} from './type';

export const stateApi = apiSlice.injectEndpoints({
  endpoints: builder => ({
    getActiveStateList: builder.query<State[], void>({
      query: () => ({
        url: 'territory-state/actives',
        method: 'GET',
      }),
    }),
  }),
});

export const {useGetActiveStateListQuery} = stateApi;
