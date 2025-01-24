import {apiSlice, TAGS} from '../apiSlice';
import {
  CartEntity,
  GetCartCountResponse,
  IncrementCartProduct,
  PutReceiptTypeRequest,
  SetCartRequest,
} from './types';

export const v2CartApi = apiSlice.injectEndpoints({
  endpoints: builder => ({
    getCart: builder.query<CartEntity[], void>({
      query: () => ({
        url: 'v2/cart',
        method: 'GET',
      }),
      providesTags: [TAGS.V2Cart],
    }),
    setCart: builder.mutation<void, SetCartRequest>({
      query: data => ({
        url: 'v2/cart',
        method: 'POST',
        data: data,
      }),
      invalidatesTags: [TAGS.V2Cart, TAGS.V2CartCount],
    }),
    deleteCart: builder.mutation<void, void>({
      query: () => ({
        url: 'v2/cart',
        method: 'DELETE',
      }),
      invalidatesTags: [TAGS.V2Cart],
    }),
    getCartCount: builder.query<GetCartCountResponse, void>({
      query: () => ({
        url: 'v2/cart/count',
        method: 'GET',
      }),
      providesTags: [TAGS.V2CartCount],
    }),
    incrementCartProduct: builder.mutation<void, IncrementCartProduct>({
      query: data => ({
        url: 'v2/cart/increment',
        method: 'POST',
        data: data,
      }),
      invalidatesTags: [TAGS.V2Cart, TAGS.V2CartCount],
    }),
    putReceiptType: builder.mutation<void, PutReceiptTypeRequest>({
      query: data => ({
        url: 'v2/cart/receipt-type',
        method: 'PUT',
        data,
      }),
      invalidatesTags: [TAGS.V2Cart],
    }),
  }),
});

export const {
  useGetCartQuery,
  useSetCartMutation,
  useGetCartCountQuery,
  useDeleteCartMutation,
  useIncrementCartProductMutation,
  usePutReceiptTypeMutation,
} = v2CartApi;
