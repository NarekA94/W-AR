import {Alert} from 'react-native';
import {ApiError} from './types';

export const isFetchBaseQueryError = <T = string>(error: unknown) => {
  return error as ApiError<T>;
};

export const AlertApiError = (e: unknown) => {
  const err = e as ApiError;
  if (err.data && err.data.message) {
    Alert.alert('Error', err.data.message);
  }
};
