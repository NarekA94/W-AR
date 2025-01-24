import {store} from '.';
import {ThunkAction, Action} from '@reduxjs/toolkit';

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;

export interface ApiResponse<T> {
  code: string;
  data: T;
  message: string;
  status: number;
}

export interface ErrorData {
  message: string;
  statusCode: number;
}
export interface ApiError<T = ErrorData> {
  data: T;
  status: number;
}

export interface LoadableData<T = undefined> {
  data: T;
  status: 'idle' | 'loading' | 'failed';
  error?: unknown;
}

export interface File {
  id: number;
  key: string;
  url: string;
}

export interface Image {
  file: File;
}
