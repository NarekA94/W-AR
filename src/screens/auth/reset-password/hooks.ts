import {yupResolver} from '@hookform/resolvers/yup';
import {useNavigation} from '@react-navigation/native';
import {useCallback, useMemo} from 'react';
import {useForm, UseFormReturn} from 'react-hook-form';
import {UseFormHandleSubmit} from 'react-hook-form/dist/types/form';
import {Keyboard} from 'react-native';
import * as yup from 'yup';
import YupPassword from 'yup-password';
import {AuthScreenNavigationProp, AuthStackRoutes} from '~/navigation';
import {useResetPasswordMutation} from '~/store/query/sign_up/signUpApi';
import {ApiError} from '~/store/types';
import {logger} from '~/utils';

YupPassword(yup);

export interface ResetPasswordForm {
  email: string;
}

interface UseResetPasswordReturn {
  form: UseFormReturn<ResetPasswordForm>;
  handleSubmit: ReturnType<UseFormHandleSubmit<ResetPasswordForm>>;
  isLoading: boolean;
}

const defaultValues: ResetPasswordForm = {
  email: '',
};

export const resetPasswordFormValidation = yup.object({
  email: yup.string().required().email(),
});

export function useResetPasswordForm(): UseResetPasswordReturn {
  const [resetPassword, {isLoading}] = useResetPasswordMutation();
  const navigation = useNavigation<AuthScreenNavigationProp>();
  const form = useForm<ResetPasswordForm>({
    defaultValues,
    mode: 'onChange',
    reValidateMode: 'onChange',
    resolver: yupResolver(resetPasswordFormValidation),
  });

  const handleSubmit = useCallback(async (values: ResetPasswordForm) => {
    Keyboard.dismiss();
    try {
      await resetPassword({email: values.email}).unwrap();
      navigation.reset({
        index: 0,
        routes: [
          {name: AuthStackRoutes.RegisterScreen},
          {name: AuthStackRoutes.ResetPasswordSuccess},
        ],
      });
    } catch (error) {
      logger.error(error);
      const err = error as ApiError<string>;
      if (err.data) {
        form.setError('email', {message: err.data, type: 'server'});
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
