import {useMemo} from 'react';
import {useAppSelector} from '~/store/hooks';
import {selectIsAuth} from '~/store/reducers';

export const useIsAuth = () => {
  const isAuth = useAppSelector(selectIsAuth);
  return useMemo(
    () => ({
      isAuth,
    }),
    [isAuth],
  );
};
