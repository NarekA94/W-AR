import {apiSlice} from '../apiSlice';
import {
  SignUpRequest,
  LoginRequest,
  LoginResponse,
  PhoneRequest,
} from './types';

export const signUpApi = apiSlice.injectEndpoints({
  endpoints: builder => ({
    signUp: builder.mutation<void, SignUpRequest>({
      query: data => ({
        url: 'user/register',
        method: 'post',
        data: data,
      }),
    }),
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: data => ({
        url: 'auth/login',
        method: 'post',
        data: data,
      }),
    }),
    phone: builder.mutation<void, PhoneRequest>({
      query: data => ({
        url: 'auth/login/phone',
        method: 'post',
        data: data,
      }),
    }),
    resetPassword: builder.mutation<void, {email: string}>({
      query: data => ({
        url: 'user/resetPassword',
        method: 'PUT',
        data,
      }),
    }),
  }),
});

export const {
  useSignUpMutation,
  useLoginMutation,
  usePhoneMutation,
  useResetPasswordMutation,
} = signUpApi;
