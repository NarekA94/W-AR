import {yupResolver} from '@hookform/resolvers/yup';
import {useCallback, useMemo, useState} from 'react';
import {useForm, UseFormReturn} from 'react-hook-form';
import {UseFormHandleSubmit} from 'react-hook-form/dist/types/form';
import {Keyboard} from 'react-native';
import * as yup from 'yup';
import YupPassword from 'yup-password';
import {authModel} from '~/storage/models/auth';
import {UserCachedRegisterStep, userModel} from '~/storage/models/user';
import {useAppDispatch} from '~/store/hooks';
import {
  useLoginMutation,
  useSignUpMutation,
} from '~/store/query/sign_up/signUpApi';
import {useUpdateUserMutation, userApi} from '~/store/query/user/userApi';
import {setIsAuth} from '~/store/reducers';
import {ApiError} from '~/store/types';
import {logger} from '~/utils';
import {RegistrationForm} from './types';

YupPassword(yup);

interface UseAuthFormReturn {
  form: UseFormReturn<RegistrationForm>;
  handleSubmit: ReturnType<UseFormHandleSubmit<RegistrationForm>>;
  isLoading: boolean;
}

const defaultValues: RegistrationForm = {
  email: '',
  password: '',
};

export const emailFormValidation = yup.object({
  email: yup.string().required().email(),
  password: yup
    .string()
    .required('No password provided.')
    .min(8, 'Password is too short - should be 8 chars minimum.')
    .minLowercase(1)
    .minUppercase(1)
    .minNumbers(1),
  uppercase: yup.string().minUppercase(1),
  minCharacters: yup.string().min(8),
  lowercase: yup.string().minLowercase(1),
  digit: yup.string().minNumbers(1),
});

export function useAuthForm(): UseAuthFormReturn {
  const [updateUser] = useUpdateUserMutation();
  const prefetchUser = userApi.usePrefetch('getCurrentUser');
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(false);

  const [signUpUserMutation] = useSignUpMutation({
    fixedCacheKey: 'sign_up_mutation',
  });
  const [loginUserMutation] = useLoginMutation({
    fixedCacheKey: 'login_mutation',
  });
  const form = useForm<RegistrationForm>({
    defaultValues,
    mode: 'onChange',
    resolver: yupResolver(emailFormValidation),
  });

  const handleSubmit = useCallback(async (values: RegistrationForm) => {
    Keyboard.dismiss();
    try {
      setIsLoading(true);
      await signUpUserMutation({
        email: values.email,
        password: values.password,
      }).unwrap();
      const res = await loginUserMutation({
        email: values.email,
        password: values.password,
      }).unwrap();
      userModel.setUserCachedRegisterStep(UserCachedRegisterStep.PHONE_NUMBER);
      authModel.setAccessToken(res.accessToken);
      authModel.setRefreshToken(res.refreshToken);
      const regionId = userModel.getUserRegionId();
      if (regionId) {
        await updateUser({id: res.id, territoryState: regionId}).unwrap();
      }
      prefetchUser(undefined, {force: true});
      setIsLoading(false);

      dispatch(setIsAuth(true));
    } catch (error) {
      setIsLoading(false);

      logger.error(error);
      const err = error as ApiError<string>;
      if (typeof err.data === 'string') {
        form.setError('email', {message: err.data || '', type: 'server'});
      }
    }
  }, []);

  return useMemo(
    () => ({
      form,
      handleSubmit: form.handleSubmit(handleSubmit),
      isLoading,
    }),
    [form, handleSubmit, isLoading],
  );
}
