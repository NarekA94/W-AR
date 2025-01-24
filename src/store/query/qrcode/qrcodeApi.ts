import {apiSlice} from '../apiSlice';
import {brandApi} from '../brand';
import {
  CheckQrCodeReq,
  CheckQrCodeRes,
  QrCodeRedeemReq,
  QrCodeRedeemRes,
} from './types';

export const qrcodeApi = apiSlice.injectEndpoints({
  endpoints: builder => ({
    checkQrCode: builder.mutation<CheckQrCodeRes, CheckQrCodeReq>({
      query: data => ({
        url: 'v2/product-qr-code/check',
        method: 'POST',
        data: data,
      }),
    }),
    qrCodeRedeem: builder.mutation<QrCodeRedeemRes, QrCodeRedeemReq>({
      query: data => ({
        url: 'v2/product-qr-code/redeem',
        method: 'POST',
        data: data,
      }),
      async onQueryStarted(_, {dispatch, queryFulfilled}) {
        queryFulfilled.then(() => {
          dispatch(brandApi.util.prefetch('getBrandsList', {}, {force: true}));
        });
      },
    }),
  }),
});

export const {useCheckQrCodeMutation, useQrCodeRedeemMutation} = qrcodeApi;
