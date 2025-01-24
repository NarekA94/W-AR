import {UserScreenNavigationProp, UserStackRoutes} from '~/navigation';
import {useNavigation} from '@react-navigation/native';
import {useGetAuthUser} from '~/hooks/useGetAuthUser';
import {useUpdateEmailMutation} from '~/store/query/user/userApi';
import {yupResolver} from '@hookform/resolvers/yup';
import {useCallback, useMemo} from 'react';
import {useForm, UseFormReturn} from 'react-hook-form';
import {UseFormHandleSubmit} from 'react-hook-form/dist/types/form';
import {Keyboard} from 'react-native';
import * as yup from 'yup';
import YupPassword from 'yup-password';
import {ApiError} from '~/store/types';
import {logger} from '~/utils';
import ChangeEmailSuccessIcon from '~/assets/images/profile/change-email.png';

YupPassword(yup);

interface ChangeEmailForm {
  email: string;
  password: string;
}

interface UseChangeEmailFormReturn {
  form: UseFormReturn<ChangeEmailForm>;
  handleSubmit: ReturnType<UseFormHandleSubmit<ChangeEmailForm>>;
  isLoading: boolean;
}

const defaultValues: ChangeEmailForm = {
  email: '',
  password: '',
};

export const emailFormValidation = yup.object({
  email: yup.string().required().email(),
  password: yup.string().required(),
});

export function useChangeEmailForm(): UseChangeEmailFormReturn {
  const navigation = useNavigation<UserScreenNavigationProp>();
  const [updateEmail, {isLoading}] = useUpdateEmailMutation();
  const {authUser} = useGetAuthUser();
  const form = useForm<ChangeEmailForm>({
    defaultValues,
    mode: 'onChange',
    resolver: yupResolver(emailFormValidation),
  });

  const handleSubmit = useCallback(async (values: ChangeEmailForm) => {
    Keyboard.dismiss();
    try {
      if (authUser) {
        await updateEmail({
          id: authUser.id,
          email: values.email,
          password: values.password,
        }).unwrap();
        navigation.navigate(UserStackRoutes.Congratulations, {
          infoI18nKey: 'screens.profile.change_email.congratulations',
          file: ChangeEmailSuccessIcon,
        });
      }
    } catch (error) {
      logger.error(error);
      const err = error as ApiError<{message: string[]}> & ApiError<string>;
      if (Array.isArray(err.data.message)) {
        form.setError('password', {
          message: err.data.message?.[0] || '',
          type: 'server',
        });
      }
      if (typeof err.data === 'string') {
        form.setError(err.data.includes('password') ? 'password' : 'email', {
          message: err.data || '',
          type: 'server',
        });
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
