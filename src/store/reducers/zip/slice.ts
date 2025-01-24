import {createSlice, PayloadAction} from '@reduxjs/toolkit';

import {ZipSliceState} from './types';

const initialState: ZipSliceState = {
  currentZipCode: '00045',
  zipCodeList: ['00045', '00046', '91331'],
};

const zipCodeSlice = createSlice({
  name: 'zipCode',
  initialState,
  reducers: {
    setZipCodeToStore: (state, {payload}: PayloadAction<string>) => {
      state.currentZipCode = payload;
    },
  },
});

export const zipCodeReducer = zipCodeSlice.reducer;
export const {setZipCodeToStore} = zipCodeSlice.actions;
