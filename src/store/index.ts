import {configureStore} from '@reduxjs/toolkit';

import {apiSlice} from './query/apiSlice';

import {rootReducer} from './rootReducer';

export const store = configureStore({
  reducer: rootReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({serializableCheck: false}).concat(
      apiSlice.middleware,
    ),
});
