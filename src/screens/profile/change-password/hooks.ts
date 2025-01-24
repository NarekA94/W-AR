import {UserScreenNavigationProp, UserStackRoutes} from '~/navigation';
import {useNavigation} from '@react-navigation/native';
import {useGetAuthUser} from '~/hooks/useGetAuthUser';
import {useUpdatePasswordMutation} from '~/store/query/user/userApi';
import {yupResolver} from '@hookform/resolvers/yup';
import {useCallback, useMemo} from 'react';
import {useForm, UseFormReturn} from 'react-hook-form';
import {UseFormHandleSubmit} from 'react-hook-form/dist/types/form';
import {Keyboard} from 'react-native';
import * as yup from 'yup';
import YupPassword from 'yup-password';
import {ApiError} from '~/store/types';
import {logger} from '~/utils';
import ChangePasswordSuccessIcon from '~/assets/images/profile/change_password.png';

YupPassword(yup);

interface ChangePasswordForm {
  oldPassword: string;
  password: string;
  repeatPassword: string;
}

interface UseChangePasswordFormReturn {
  form: UseFormReturn<ChangePasswordForm>;
  handleSubmit: ReturnType<UseFormHandleSubmit<ChangePasswordForm>>;
  isLoading: boolean;
}

const defaultValues: ChangePasswordForm = {
  oldPassword: '',
  password: '',
  repeatPassword: '',
};

export const passwordFormValidation = yup.object({
  oldPassword: yup.string().required(),
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
  repeatPassword: yup
    .string()
    .required('confirm password is a required field')
    .oneOf([yup.ref('password'), null], 'Passwords do not match.'),
});

export function useChangePasswordForm(): UseChangePasswordFormReturn {
  const navigation = useNavigation<UserScreenNavigationProp>();
  const [updatePassword, {isLoading}] = useUpdatePasswordMutation();
  const {authUser} = useGetAuthUser();
  const form = useForm<ChangePasswordForm>({
    defaultValues,
    mode: 'onChange',
    resolver: yupResolver(passwordFormValidation),
  });

  const handleSubmit = useCallback(async (values: ChangePasswordForm) => {
    Keyboard.dismiss();
    try {
      if (authUser) {
        await updatePassword({
          id: authUser.id,
          oldPassword: values.oldPassword,
          password: values.password,
        }).unwrap();
        navigation.navigate(UserStackRoutes.Congratulations, {
          infoI18nKey: 'screens.profile.change_password.congratulations',
          file: ChangePasswordSuccessIcon,
        });
      }
    } catch (error) {
      logger.error(error);
      const err = error as ApiError<string>;
      if (typeof err.data === 'string') {
        form.setError('oldPassword', {message: err.data || '', type: 'server'});
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
