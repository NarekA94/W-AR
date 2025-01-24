import {Alert} from 'react-native';
import {apiSlice} from '../apiSlice';
import {GetCartProductsResponse, PutCartProductRequest} from './types';

export const cartApi = apiSlice.injectEndpoints({
  endpoints: builder => ({
    getCartProducts: builder.query<GetCartProductsResponse, void>({
      query: () => ({
        url: 'cart',
        method: 'GET',
      }),
    }),
    putCartProduct: builder.mutation<
      GetCartProductsResponse,
      PutCartProductRequest
    >({
      query: data => ({
        url: 'cart',
        method: 'PUT',
        data: data,
      }),
      async onQueryStarted(_, {dispatch, queryFulfilled}) {
        queryFulfilled
          .then(({data}) => {
            dispatch(
              cartApi.util.updateQueryData(
                'getCartProducts',
                undefined,
                () => data,
              ),
            );
          })
          .catch(err => {
            const serverError = err.error as {data?: string; status?: number};
            if (serverError?.data && serverError?.status) {
              Alert.alert('Ooops', serverError.data);
            }
          });
      },
    }),
    deleteCartProducts: builder.mutation({
      query: () => ({
        url: 'cart',
        method: 'DELETE',
      }),
      async onQueryStarted(_, {dispatch}) {
        try {
          dispatch(
            cartApi.util.updateQueryData('getCartProducts', undefined, () => ({
              cartDetails: [],
              deliverySum: 0,
              discount: null,
              giftProducts: [],
              minOrderSum: 50,
              priceCorresponds: false,
              productsSum: 0,
              sum: 0,
              totalSum: 0,
              totalWeight: 0,
              userCash: 0,
            })),
          );
        } catch {}
      },
    }),
  }),
});

export const {
  useGetCartProductsQuery,
  usePutCartProductMutation,
  useDeleteCartProductsMutation,
} = cartApi;
