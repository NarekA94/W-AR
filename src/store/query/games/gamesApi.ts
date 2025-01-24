import {apiSlice} from '../apiSlice';
import {ArStickerGame} from './types';

export const gamesApi = apiSlice.injectEndpoints({
  endpoints: builder => ({
    getArStickerGame: builder.query<ArStickerGame, {id: string}>({
      query: ({id}) => ({
        url: `/ar-sticker-game/${id}`,
        method: 'GET',
      }),
    }),
    passStep: builder.mutation<
      ArStickerGame,
      {gameId: string; order: number; answer?: number}
    >({
      query: data => ({
        url: '/ar-sticker-game/pass',
        method: 'POST',
        data,
      }),
      async onQueryStarted(data, {dispatch, queryFulfilled}) {
        queryFulfilled.then(res => {
          dispatch(
            gamesApi.util.updateQueryData(
              'getArStickerGame',
              {id: data.gameId},
              () => res.data,
            ),
          );
        });
      },
    }),
    resetGame: builder.mutation<void, {gameId: string}>({
      query: ({gameId}) => ({
        url: `/ar-sticker-game/replay/${gameId}`,
        method: 'POST',
      }),
    }),
  }),
});

export const {
  useGetArStickerGameQuery,
  usePassStepMutation,
  useResetGameMutation,
} = gamesApi;
