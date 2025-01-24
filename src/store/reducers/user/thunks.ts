import {createAsyncThunk} from '@reduxjs/toolkit';
import {httpClient} from '~/api/httpClient';
import {apiSlice} from '~/store/query/apiSlice';
import {store} from '~/store';
import {RootState} from '~/store/types';
import messaging from '@react-native-firebase/messaging';
import {authModel} from '~/storage/models/auth';
import {brandApi} from '~/store/query/brand';
import {nftDropApi} from '~/store/query/nft-drop';
import {resolveHttpHeaders} from '~/utils/headers';

export const getCurrentUser = createAsyncThunk('user/getCurrent', async () => {
  const response = await httpClient.get(
    `user/current?test=${new Date().getTime()}`,
  );
  return response.data;
});

export const logOut = createAsyncThunk('user/logOut', async (_, {dispatch}) => {
  const {user} = store.getState() as RootState;
  const fcmToken = await messaging().getToken();
  if (user.data?.id) {
    httpClient({
      url: `/user/${user.data.id}/token`,
      method: 'DELETE',
      data: {firebaseToken: fcmToken},
      headers: resolveHttpHeaders(),
    });
  }

  dispatch(apiSlice.util.resetApiState());
  dispatch(brandApi.util.resetApiState());
  dispatch(nftDropApi.util.resetApiState());
  authModel.removeFcmSuccessfullySaved();
  authModel.removeAccessToken();
  authModel.removeRefreshToken();
});
