import {yupResolver} from '@hookform/resolvers/yup';
import {useCallback, useMemo, useState} from 'react';
import {useForm, UseFormReturn} from 'react-hook-form';
import {UseFormHandleSubmit} from 'react-hook-form/dist/types/form';
import {Keyboard} from 'react-native';
import * as yup from 'yup';
import YupPassword from 'yup-password';
import {logger} from '~/utils';
import {getValidNumber, unMaskPhoneNumber} from '~/utils/form';
import auth from '@react-native-firebase/auth';
import {useGetAuthUser} from '~/hooks/useGetAuthUser';

YupPassword(yup);

interface PhoneNumberForm {
  phone: string;
}

interface UseLoginFormReturn {
  form: UseFormReturn<PhoneNumberForm>;
  handleSubmit: ReturnType<UseFormHandleSubmit<PhoneNumberForm>>;
  isLoading: boolean;
}

export const phoneNumberFormValidation = yup.object({
  phone: yup
    .string()
    .required()
    .test('getValidNumber', 'Invalid phone number.', function (value) {
      const res = getValidNumber(value || '');
      return res;
    }),
});

export function usePhoneNumberForm(
  onSuccessSubmit: (phoneNumber: string, verificationId: string) => void,
): UseLoginFormReturn {
  const {authUser} = useGetAuthUser();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const form = useForm<PhoneNumberForm>({
    defaultValues: {
      phone: authUser?.phone || '',
    },
    mode: 'onChange',
    resolver: yupResolver(phoneNumberFormValidation),
  });

  const handleSubmit = useCallback(
    async (values: PhoneNumberForm) => {
      Keyboard.dismiss();
      try {
        setIsLoading(true);
        auth()
          .verifyPhoneNumber(unMaskPhoneNumber(values.phone))
          .on(
            'state_changed',
            phoneAuthSnapshot => {
              setIsLoading(false);
              if (phoneAuthSnapshot.state === auth.PhoneAuthState.CODE_SENT) {
                onSuccessSubmit(values.phone, phoneAuthSnapshot.verificationId);
                return Promise.resolve();
              }
            },
            error => {
              setIsLoading(false);
              if (error.code === 'auth/invalid-phone-number') {
                form.setError('phone', {
                  message: 'Invalid phone number',
                  type: 'server',
                });
              }
              if (error.code === 'auth/too-many-requests') {
                form.setError('phone', {
                  message: error.message || '',
                  type: 'server',
                });
              }
              return Promise.reject();
            },
            () => {
              setIsLoading(false);
            },
          );
      } catch (error) {
        setIsLoading(false);
        logger.error(error);
      }
    },
    [onSuccessSubmit],
  );

  return useMemo(
    () => ({
      form,
      handleSubmit: form.handleSubmit(handleSubmit),
      isLoading,
    }),
    [form, handleSubmit, isLoading],
  );
}
