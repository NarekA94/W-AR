import {BottomSheetRef} from '~/components';
import {yupResolver} from '@hookform/resolvers/yup';
import {RefObject, useCallback, useMemo, useRef} from 'react';
import {useForm, UseFormReturn} from 'react-hook-form';
import {UseFormHandleSubmit} from 'react-hook-form/dist/types/form';
import {Keyboard} from 'react-native';
import * as yup from 'yup';
import YupPassword from 'yup-password';
import {ApiError} from '~/store/types';
import {logger} from '~/utils';
import {useSendMessageToSupportMutation} from '~/store/query/suport';

YupPassword(yup);

interface ContactUsForm {
  title: string;
  message: string;
}

interface ContactUsFormReturn {
  form: UseFormReturn<ContactUsForm>;
  handleSubmit: ReturnType<UseFormHandleSubmit<ContactUsForm>>;
  isLoading: boolean;
  bottomSheetModalRef: RefObject<BottomSheetRef>;
}

const defaultValues: ContactUsForm = {
  title: '',
  message: '',
};

export const emailFormValidation = yup.object({
  title: yup.string().required(),
  message: yup.string().required(),
});

export function useContactUsForm(): ContactUsFormReturn {
  const [sendMessageToSupport, {isLoading}] = useSendMessageToSupportMutation();
  const bottomSheetModalRef = useRef<BottomSheetRef>(null);

  const form = useForm<ContactUsForm>({
    defaultValues,
    mode: 'onChange',
    resolver: yupResolver(emailFormValidation),
  });

  const handleSubmit = useCallback(async (values: ContactUsForm) => {
    Keyboard.dismiss();
    try {
      await sendMessageToSupport({
        title: values.title,
        message: values.message,
      }).unwrap();
      bottomSheetModalRef.current?.open();
    } catch (error) {
      logger.error(error);
      const err = error as ApiError<string>;
      if (typeof err.data === 'string') {
        form.setError('title', {message: err.data || '', type: 'server'});
      }
    }
  }, []);

  return useMemo(
    () => ({
      form,
      handleSubmit: form.handleSubmit(handleSubmit),
      isLoading,
      bottomSheetModalRef,
    }),
    [form, handleSubmit, isLoading, bottomSheetModalRef],
  );
}
