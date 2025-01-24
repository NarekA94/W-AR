import {TAGS, apiSlice} from '../apiSlice';
import {ProductTabs} from '../brand';
import {GetProductRequest, GetProductsResponse, Product} from './types';

export const productApi = apiSlice.injectEndpoints({
  endpoints: builder => ({
    getProducts: builder.query<GetProductsResponse, GetProductRequest>({
      keepUnusedDataFor: 30,
      query: data => ({
        url: `v2/product?brand=${data.brandId}&tab=${data.tab}`,
        method: 'GET',
      }),
    }),
    getProduct: builder.query<Product, {id: number; tab?: ProductTabs}>({
      query: ({id, tab}) => ({
        url: `/v2/product/${id}`,
        method: 'GET',
        params: {
          tab,
        },
      }),
    }),
    searchProducts: builder.query<
      GetProductsResponse,
      {brandId: number; search: string; tab?: ProductTabs}
    >({
      query: data => ({
        url: `v2/product?search=${data.search}&brand=${data.brandId}&tab=${data.tab}`,
        method: 'GET',
      }),
    }),
    searchProductHistory: builder.query<
      Product[],
      {brandId: number; tab?: ProductTabs}
    >({
      query: ({brandId, tab}) => ({
        url: `v2/search-history/product/${brandId}/brand`,
        params: {
          tab,
        },
      }),
      providesTags: [TAGS.ProductHistory],
    }),
    setSearchProductHistory: builder.mutation<
      void,
      {id: number; tab?: ProductTabs}
    >({
      query: data => ({
        url: 'v2/search-history/product',
        method: 'POST',
        data,
      }),
      invalidatesTags: [TAGS.ProductHistory],
    }),
  }),
});

export const {
  useGetProductsQuery,
  useLazyGetProductsQuery,
  useGetProductQuery,
  useSearchProductsQuery,
  useLazySearchProductsQuery,
  useSearchProductHistoryQuery,
  useSetSearchProductHistoryMutation,
} = productApi;
