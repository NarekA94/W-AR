import {apiSlice} from '../apiSlice';
import {cartApi} from '../cart';
import {
  ConfirmOrderRequest,
  CreateDeliveryOrderRequest,
  CreateDeliveryOrderResponse,
} from './types';

export const orderApi = apiSlice.injectEndpoints({
  endpoints: builder => ({
    createOrder: builder.mutation<
      CreateDeliveryOrderResponse,
      CreateDeliveryOrderRequest
    >({
      query: data => ({
        url: 'order',
        method: 'POST',
        data,
      }),
    }),
    confirmOrder: builder.mutation<void, ConfirmOrderRequest>({
      query: ({id}) => ({
        url: `order/${id}/confirm`,
        method: 'PUT',
      }),
      async onQueryStarted(_, {dispatch, queryFulfilled}) {
        queryFulfilled.then(() => {
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
        });
      },
    }),
  }),
});

export const {useCreateOrderMutation, useConfirmOrderMutation} = orderApi;
