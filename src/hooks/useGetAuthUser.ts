import {useMemo} from 'react';
import {useAppSelector} from '~/store/hooks';
import {selectAuthUser} from '~/store/reducers';

export const useGetAuthUser = () => {
  const authUser = useAppSelector(selectAuthUser);
  return useMemo(
    () => ({
      authUser,
    }),
    [authUser],
  );
};
