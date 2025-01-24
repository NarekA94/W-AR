import type {BaseQueryFn} from '@reduxjs/toolkit/query';
import type {AxiosRequestConfig, AxiosError} from 'axios';
import {httpClient} from './httpClient';

export const axiosBaseQuery: BaseQueryFn<
  AxiosRequestConfig,
  unknown,
  unknown
> = async ({url, method, data, params, headers, ...rest}) => {
  try {
    const result = await httpClient({
      url,
      method,
      data,
      params,
      headers,
      ...rest,
    });
    return {data: result.data};
  } catch (axiosError) {
    let err = axiosError as AxiosError;
    return {
      error: {
        status: err.response?.status,
        data: err.response?.data || err.message,
      },
    };
  }
};
