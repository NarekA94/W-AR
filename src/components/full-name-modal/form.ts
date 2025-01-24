import {yupResolver} from '@hookform/resolvers/yup';
import {useCallback, useMemo, useRef} from 'react';
import {useForm} from 'react-hook-form';
import {Keyboard} from 'react-native';
import * as yup from 'yup';
import {useGetAuthUser} from '~/hooks/useGetAuthUser';
import {useUpdateUserMutation} from '~/store/query/user/userApi';
import {BottomSheetRef} from '../bottom-sheet/bottom-sheet';

interface FullNameForm {
  name: string;
}

const defaultValues: FullNameForm = {
  name: '',
};

export const loginFormValidation = yup.object({
  name: yup.string().required(),
});

export function useFullNameForm() {
  const {authUser} = useGetAuthUser();
  const bottomSheetRef = useRef<BottomSheetRef>(null);

  const [updateUser, {isLoading}] = useUpdateUserMutation({
    fixedCacheKey: 'update_user_name',
  });

  const form = useForm<FullNameForm>({
    defaultValues,
    mode: 'onChange',
    resolver: yupResolver(loginFormValidation),
  });

  const handleSubmit = useCallback(
    async ({name}: FullNameForm) => {
      Keyboard.dismiss();
      try {
        if (authUser) {
          await updateUser({
            name: name.replace(/\s+/g, ' ').trim(),
            id: authUser.id,
          }).unwrap();
          bottomSheetRef.current?.close();
        }
      } catch {}
    },
    [authUser, updateUser],
  );

  return useMemo(
    () => ({
      form,
      handleSubmit: form.handleSubmit(handleSubmit),
      isLoading,
      bottomSheetRef,
    }),
    [form, handleSubmit, isLoading],
  );
}
