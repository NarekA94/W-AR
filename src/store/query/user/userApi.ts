import {UserData} from '~/store/reducers';
import {apiSlice, TAGS} from '../apiSlice';
import {
  DeleteDocumentArgs,
  SetDocumentsArgs,
  UpdateEmailRequest,
  UpdatePasswordRequest,
  UpdateUserRequest,
  UpdateUserSettingsRequest,
  VerifyPhoneRequest,
} from './types';
import {resolveHttpHeaders} from '~/utils/headers';

export const userApi = apiSlice.injectEndpoints({
  endpoints: builder => ({
    logOut: builder.mutation({
      query: data => ({
        url: '',
        method: 'post',
        data,
      }),
    }),
    verifyPhone: builder.mutation<void, VerifyPhoneRequest>({
      query: data => ({
        url: `user/${data.userID}/verifyPhone`,
        method: 'put',
        data: {phone: data.phone},
        headers: resolveHttpHeaders(),
      }),
    }),
    getCurrentUser: builder.query<UserData, void>({
      query: () => ({
        url: 'user/current',
        method: 'GET',
      }),
      providesTags: [TAGS.User],
    }),
    checkForceUpdateIOS: builder.mutation<Boolean, {version: string}>({
      query: data => ({
        url: '/versions/check/rn/iOS',
        method: 'POST',
        data: {version: data.version},
      }),
      transformResponse: (response: {valid: boolean}) => response.valid,
      invalidatesTags: [TAGS.User],
    }),

    checkForceUpdateAndroid: builder.mutation<Boolean, {version: string}>({
      query: data => ({
        url: '/versions/check/rn/android',
        method: 'POST',
        data: {version: data.version},
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          Pragma: 'no-cache',
          Expires: '0',
        },
      }),
      transformResponse: (response: {valid: boolean}) => response.valid,
      invalidatesTags: [TAGS.User],
    }),
    updateUser: builder.mutation<UserData, UpdateUserRequest>({
      query: ({id, ...patch}) => ({
        url: `user/${id}`,
        method: 'PUT',
        data: patch,
      }),
      invalidatesTags: [TAGS.User],
    }),
    updateUserSetting: builder.mutation<UserData, UpdateUserSettingsRequest>({
      query: ({id, ...data}) => ({
        url: `user/${id}/settings`,
        method: 'PUT',
        data: data,
      }),
      invalidatesTags: [TAGS.User],
    }),
    deleteAccount: builder.mutation<void, void>({
      query: () => ({
        url: 'user',
        method: 'DELETE',
      }),
    }),
    setDocuments: builder.mutation<void, SetDocumentsArgs>({
      query: ({id, ...data}) => ({
        url: `user/${id}/verifyPassport`,
        method: 'PUT',
        data: data.data,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }),
      invalidatesTags: [TAGS.User],
    }),
    deleteDocuments: builder.mutation<void, DeleteDocumentArgs>({
      query: ({id, data}) => ({
        url: `user/${id}/passportPhoto`,
        method: 'DELETE',
        data,
      }),
      invalidatesTags: [TAGS.User],
    }),
    updateEmail: builder.mutation<void, UpdateEmailRequest>({
      query: ({id, ...data}) => ({
        url: `user/${id}/updateEmail`,
        method: 'PUT',
        data,
      }),
      invalidatesTags: [TAGS.User],
    }),
    updatePassword: builder.mutation<void, UpdatePasswordRequest>({
      query: ({id, ...data}) => ({
        url: `user/${id}/updatePassword`,
        method: 'PUT',
        data,
      }),
    }),
    updatePhone: builder.mutation<void, {phone: string; id: number}>({
      query: ({id, ...data}) => ({
        url: `user/${id}/verifyPhone`,
        method: 'PUT',
        data,
      }),
      invalidatesTags: [TAGS.User],
    }),
    deleteUserAddress: builder.mutation<void, {id: number}>({
      query: ({id}) => ({
        url: `/user/address/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [TAGS.User],
    }),
  }),
});

export const {
  useLogOutMutation,
  useVerifyPhoneMutation,
  useGetCurrentUserQuery,
  useUpdateUserMutation,
  useLazyGetCurrentUserQuery,
  useSetDocumentsMutation,
  useDeleteDocumentsMutation,
  useUpdateUserSettingMutation,
  useDeleteAccountMutation,
  useUpdateEmailMutation,
  useUpdatePasswordMutation,
  useUpdatePhoneMutation,
  useDeleteUserAddressMutation,
  useCheckForceUpdateIOSMutation,
  useCheckForceUpdateAndroidMutation,
} = userApi;
