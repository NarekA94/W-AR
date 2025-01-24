import {createApi} from '@reduxjs/toolkit/query/react';
import {axiosBaseQuery} from '~/api/axiosBaseQuery';

export enum TAGS {
  User = 'User',
  Cart = 'Cart',
  Rewards = 'Rewards',
  BrandHistory = 'BrandHistory',
  ProductHistory = 'ProductHistory',
  CollectibleHistory = 'CollectibleHistory',
  V2Cart = 'V2Cart',
  V2CartCount = 'V2CartCount',
}

export const apiSlice = createApi({
  reducerPath: 'api',
  keepUnusedDataFor: 30,
  baseQuery: axiosBaseQuery,
  endpoints: () => ({}),
  tagTypes: [
    TAGS.User,
    TAGS.Cart,
    TAGS.Rewards,
    TAGS.BrandHistory,
    TAGS.ProductHistory,
    TAGS.CollectibleHistory,
    TAGS.V2Cart,
    TAGS.V2CartCount,
  ],
});
