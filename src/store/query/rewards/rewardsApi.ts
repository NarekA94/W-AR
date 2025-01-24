import {TAGS, apiSlice} from '../apiSlice';
import {ProductTabs} from '../brand';
import {
  CartOrderInfoRequest,
  CartOrderInfoRes,
  CartOrderReview,
  GetRewardsCountRes,
  GetRewardsResponse,
  SetCollectibleRewardRequest,
  SetOrderFromCartRes,
  SetRewardsRequest,
} from './types';

export const rewardsApi = apiSlice.injectEndpoints({
  endpoints: builder => ({
    getRewards: builder.query<GetRewardsResponse, void>({
      query: () => ({
        url: 'v2/order/with-tabs',
        method: 'GET',
      }),
      providesTags: [TAGS.Rewards],
    }),
    setRewards: builder.mutation<void, SetRewardsRequest>({
      query: data => ({
        url: 'v2/order',
        method: 'POST',
        data,
      }),
      invalidatesTags: [TAGS.Rewards],
    }),
    getRewardsCount: builder.query<GetRewardsCountRes, void>({
      query: () => ({
        url: 'v2/order/count',
        method: 'GET',
      }),
      providesTags: [TAGS.Rewards],
    }),
    setCollectibleReward: builder.mutation<void, SetCollectibleRewardRequest>({
      query: data => ({
        url: 'v2/order-collectibles',
        method: 'POST',
        data,
      }),
      invalidatesTags: [TAGS.Rewards],
    }),
    cancelCollectibleReward: builder.mutation<void, {id: number}>({
      query: ({id}) => ({
        url: `v2/order-collectibles/${id}/cancel`,
        method: 'PUT',
      }),
      invalidatesTags: [TAGS.Rewards],
    }),
    cartOrderReview: builder.mutation<CartOrderReview, {tab: ProductTabs}>({
      query: data => ({
        url: 'v2/order/review',
        method: 'POST',
        data,
      }),
    }),
    cartOrderInfo: builder.query<CartOrderInfoRes, CartOrderInfoRequest>({
      query: data => ({
        url: 'v2/order/info',
        method: 'POST',
        data,
      }),
    }),
    setOrderFromCart: builder.mutation<
      SetOrderFromCartRes,
      CartOrderInfoRequest
    >({
      query: data => ({
        url: 'v2/order/from-cart',
        method: 'POST',
        data,
      }),
      invalidatesTags: [TAGS.Rewards],
    }),
    cancelReward: builder.mutation<void, {id: number}>({
      query: ({id}) => ({
        url: `v2/order/${id}`,
        method: 'PUT',
        data: {state: 4},
      }),
      invalidatesTags: [TAGS.Rewards],
    }),
  }),
});

export const {
  useGetRewardsQuery,
  useSetRewardsMutation,
  useGetRewardsCountQuery,
  useSetCollectibleRewardMutation,
  useCancelCollectibleRewardMutation,
  useLazyCartOrderInfoQuery,
  useCartOrderInfoQuery,
  useSetOrderFromCartMutation,
  useCartOrderReviewMutation,
  useCancelRewardMutation,
} = rewardsApi;
