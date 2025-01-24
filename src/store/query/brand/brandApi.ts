import {TAGS, apiSlice} from '../apiSlice';
import type {
  Brand,
  BrandCategory,
  Dispensary,
  DispensaryWithDistanceRequest,
} from './types';

export const brandApi = apiSlice.injectEndpoints({
  endpoints: builder => ({
    getBrandsList: builder.query<Brand[], {showHidden?: string}>({
      query: ({showHidden = 'false'} = {}) => ({
        url: `/v2/brand?showHidden=${showHidden}`,
        method: 'GET',
      }),
    }),
    getBrand: builder.query<Brand, {id: number}>({
      query: ({id}) => ({
        url: `/v2/brand/${id}`,
        method: 'GET',
      }),
    }),
    getBrandCategories: builder.query<BrandCategory[], {id: number}>({
      query: ({id}) => ({
        url: `/v2/product-type/brand/${id}`,
        method: 'GET',
      }),
    }),
    getBrandDispensaries: builder.query<Dispensary[], {id: number}>({
      query: ({id}) => ({
        url: `/v2/brand-dispensary/brand/${id}`,
        method: 'GET',
      }),
    }),
    getDispensary: builder.query<Dispensary, {id: number}>({
      query: ({id}) => ({
        url: `/v2/brand-dispensary/${id}`,
        method: 'GET',
      }),
    }),
    getDispensaryWithDistance: builder.query<
      Dispensary[],
      DispensaryWithDistanceRequest
    >({
      query: data => ({
        url: '/v2/brand-dispensary/with-distance',
        method: 'POST',
        data,
      }),
    }),
    toggleFavoriteDispensary: builder.mutation<
      {isFavourite: boolean},
      {id: number}
    >({
      query: ({id}) => ({
        url: `/v2/brand-dispensary/favourite/${id}`,
        method: 'POST',
      }),
    }),
    searchBrands: builder.query<Brand[], {search: string}>({
      query: ({search}) => ({
        url: `/v2/brand?search=${search}`,
        method: 'GET',
      }),
    }),
    searchHistoryBrands: builder.query<Brand[], void>({
      query: () => ({
        url: 'v2/search-history/brand',
        method: 'GET',
      }),
      providesTags: [TAGS.BrandHistory],
    }),
    addToSerachHistoryBrands: builder.mutation<void, {id: number}>({
      query: data => ({
        url: 'v2/search-history/brand',
        method: 'POST',
        data,
      }),
      invalidatesTags: [TAGS.BrandHistory],
    }),
  }),
});

export const {
  useGetBrandsListQuery,
  useLazyGetBrandQuery,
  useGetBrandQuery,
  useLazyGetBrandCategoriesQuery,
  usePrefetch,
  useGetBrandDispensariesQuery,
  useGetDispensaryQuery,
  useToggleFavoriteDispensaryMutation,
  useLazyGetDispensaryWithDistanceQuery,
  useSearchBrandsQuery,
  useSearchHistoryBrandsQuery,
  useAddToSerachHistoryBrandsMutation,
} = brandApi;
