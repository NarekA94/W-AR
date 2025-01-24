import {apiSlice} from '../apiSlice';
import {AreaBlock} from './types';

export const areaApi = apiSlice.injectEndpoints({
  endpoints: builder => ({
    getAreaList: builder.query<AreaBlock[], void>({
      query: data => ({
        url: 'area',
        method: 'GET',
        data: data,
      }),
    }),
  }),
});

export const {useGetAreaListQuery} = areaApi;
