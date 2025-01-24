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
import {useLoginMutation} from '~/store/query/sign_up/signUpApi';
import {useLazyGetCurrentUserQuery} from '~/store/query/user/userApi';
import {setIsAuth} from '~/store/reducers';
import {ApiError} from '~/store/types';
import {logger} from '~/utils';
import {RegistrationForm} from './types';
import {useUpdateUserMutation} from '~/store/query/user/userApi';

YupPassword(yup);

interface UseLoginFormReturn {
  form: UseFormReturn<RegistrationForm>;
  handleSubmit: ReturnType<UseFormHandleSubmit<RegistrationForm>>;
  isLoading: boolean;
}

// QA login pass
// mironovo18@gmail.com
// Vbhjytyrj97
// max2@max.com
// Testpass1

const defaultValues: RegistrationForm = {
  email: __DEV__ ? 'narekmher94@gmail.com' : '',
  password: __DEV__ ? 'narekAVAN94' : '',
};

export const loginFormValidation = yup.object({
  email: yup.string().required().email(),
  password: yup.string().required(),
});

export function useLoginForm(): UseLoginFormReturn {
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useAppDispatch();
  const [fetchUser] = useLazyGetCurrentUserQuery();
  const [loginUserMutation] = useLoginMutation({
    fixedCacheKey: 'login_mutation',
  });
  const [updateUser] = useUpdateUserMutation();
  const form = useForm<RegistrationForm>({
    defaultValues,
    mode: 'onChange',
    reValidateMode: 'onChange',
    resolver: yupResolver(loginFormValidation),
  });

  const handleSubmit = useCallback(async (values: RegistrationForm) => {
    Keyboard.dismiss();
    try {
      setIsLoading(true);
      const res = await loginUserMutation({
        email: values.email,
        password: values.password,
      }).unwrap();
      authModel.setAccessToken(res.accessToken);
      authModel.setRefreshToken(res.refreshToken);
      if (res.phone === null) {
        userModel.setUserCachedRegisterStep(
          UserCachedRegisterStep.PHONE_NUMBER,
        );
      } else {
        userModel.removeUserCachedRegisterStep();
      }
      const regionId = userModel.getUserRegionId();
      if (regionId) {
        await updateUser({id: res.id, territoryState: regionId}).unwrap();
      }
      await fetchUser().unwrap();
      setIsLoading(false);
      dispatch(setIsAuth(true));
    } catch (error) {
      setIsLoading(false);
      logger.error(error);
      const err = error as ApiError;
      if (err.data) {
        form.setError('password', {
          message: 'Incorrect email or password',
          type: 'server',
        });
        form.setError('email', {message: '', type: 'server'});
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
