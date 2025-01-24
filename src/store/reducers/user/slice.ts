import {createSlice, PayloadAction} from '@reduxjs/toolkit';

import {UserData, UserState} from './types';
import {userApi} from '~/store/query/user/userApi';
import {zipCodeModel} from '~/storage';
import {logOut} from './thunks';

const initialState: UserState = {
  isAuth: false,
  data: null,
  needToHideUi: false,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setIsAuth: (state, {payload}: PayloadAction<boolean>) => {
      state.isAuth = payload;
    },
    setUser: (state, {payload}: PayloadAction<UserData>) => {
      state.data = payload;
    },
  },
  extraReducers: builder => {
    builder.addCase(logOut.fulfilled, state => {
      state.isAuth = false;
      state.data = null;
    });
    builder.addMatcher(
      userApi.endpoints.getCurrentUser.matchFulfilled,
      (state, {payload}: PayloadAction<UserData>) => {
        if (payload.catalogZipCode) {
          zipCodeModel.setUserSelectedZipCode(payload.catalogZipCode);
        } else {
          zipCodeModel.removeUserSelectedZipCode();
        }
        state.data = payload;
      },
    );
  },
});

export const userReducer = userSlice.reducer;
export const {setIsAuth, setUser} = userSlice.actions;
