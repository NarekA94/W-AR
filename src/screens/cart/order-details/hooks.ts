import {yupResolver} from '@hookform/resolvers/yup';
import {useEffect, useMemo} from 'react';
import {useController, useForm, UseFormReturn} from 'react-hook-form';
import * as yup from 'yup';

export interface OrderDetailsForm {
  name: string;
}

interface UseOrderDetailsFormReturn {
  form: UseFormReturn<OrderDetailsForm>;
}

const defaultValues: OrderDetailsForm = {
  name: '',
};

export const orderDetailsFormValidation = yup.object({
  name: yup.string().required('Please enter Full name').trim(),
});

export function useOrderDetailsForm(): UseOrderDetailsFormReturn {
  const form = useForm<OrderDetailsForm>({
    defaultValues,
    mode: 'onChange',
    resolver: yupResolver(orderDetailsFormValidation),
  });
  const controller = useController({name: 'name', control: form.control});

  useEffect(() => {
    if (controller.fieldState.error) {
      form.setError('name', {
        message: controller.fieldState.error.message,
        type: 'server',
      });
    }
  }, [controller.fieldState.error?.message]);

  return useMemo(
    () => ({
      form,
    }),
    [form],
  );
}
