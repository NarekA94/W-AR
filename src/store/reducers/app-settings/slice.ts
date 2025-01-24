import {createSlice} from '@reduxjs/toolkit';

import {getAppSettings} from './thunks';
import {AppSettingsState} from './types';

const initialState: AppSettingsState = {
  data: null,
};

const appSettingsSlice = createSlice({
  name: 'appSettings',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(getAppSettings.fulfilled, (state, action) => {
      state.data = action.payload.data;
    });
  },
});

export const appSettingsReducer = appSettingsSlice.reducer;
