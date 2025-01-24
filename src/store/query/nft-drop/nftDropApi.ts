import {TAGS, apiSlice} from '../apiSlice';
import {Dispensary} from '../brand';
import {NFTDrop, GetDispensariesWithDistanceRequest} from './types';

export const nftDropApi = apiSlice.injectEndpoints({
  endpoints: builder => ({
    getNftDropList: builder.query<NFTDrop[], void>({
      query: () => ({
        url: 'nft-drop',
        method: 'GET',
      }),
    }),
    getNftDrop: builder.query<NFTDrop, {id: number}>({
      query: ({id}) => ({
        url: `nft-drop/${id}`,
        method: 'GET',
      }),
    }),
    searchNftDrop: builder.query<NFTDrop[], {search: string}>({
      query: ({search}) => ({
        url: `nft-drop?search=${search}`,
        method: 'GET',
      }),
    }),
    getSearchNftDropHistory: builder.query<NFTDrop[], void>({
      query: () => ({
        url: '/v2/search-history/collectibles',
        method: 'GET',
      }),
      providesTags: [TAGS.CollectibleHistory],
    }),
    setSearchNftDropHistory: builder.mutation<void, {id: number}>({
      query: data => ({
        url: 'v2/search-history/collectibles',
        method: 'POST',
        data,
      }),
      invalidatesTags: [TAGS.CollectibleHistory],
    }),
    getDispensariesWithDistanceM: builder.mutation<
      Dispensary[],
      GetDispensariesWithDistanceRequest
    >({
      query: data => ({
        url: 'v2/brand-dispensary/with-distance/collectibles',
        method: 'POST',
        data: data,
      }),
    }),
    getDispensariesWithDistance: builder.query<
      Dispensary[],
      GetDispensariesWithDistanceRequest
    >({
      query: data => ({
        url: 'v2/brand-dispensary/with-distance/collectibles',
        method: 'POST',
        data: data,
      }),
    }),
  }),
});

export const {
  useSetSearchNftDropHistoryMutation,
  useGetSearchNftDropHistoryQuery,
  useGetNftDropListQuery,
  useGetNftDropQuery,
  useSearchNftDropQuery,
  useLazyGetDispensariesWithDistanceQuery,
  useGetDispensariesWithDistanceMMutation,
} = nftDropApi;
