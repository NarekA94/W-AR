import {createSlice} from '@reduxjs/toolkit';
import {verifyPhoneNumber} from './thunks';
import {LoadableData} from '~/store/types';
import {VerifyPhoneStateData} from './types';

const initialState: LoadableData<VerifyPhoneStateData | null> = {
  data: null,
  status: 'idle',
  error: null,
};

const userSlice = createSlice({
  name: 'verifyPhone',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(verifyPhoneNumber.fulfilled, (state, {payload}) => {
        state.data = {
          state: payload.state,
          verificationId: payload.verificationId,
          code: payload.code,
          error: payload.error,
        };
      })
      .addCase(verifyPhoneNumber.rejected, (state, action) => {
        state.status = 'failed';
        if (action?.payload) {
          state.error = action?.payload;
        } else {
          state.error = action.error;
        }
      });
  },
});

export const userReducer = userSlice.reducer;
