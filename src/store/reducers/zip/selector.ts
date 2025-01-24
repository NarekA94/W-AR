import {createSelector, Selector} from '@reduxjs/toolkit';
import {RootState} from '~/store/types';

import {ZipSliceState} from './types';

export const selectZipCodeState: Selector<RootState, ZipSliceState> = state =>
  state.zipCode;

export const selectZipCode = createSelector(
  selectZipCodeState,
  state => state.currentZipCode,
);
export const selectZipCodeList = createSelector(
  selectZipCodeState,
  state => state.zipCodeList,
);
