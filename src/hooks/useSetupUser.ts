import {useLayoutEffect} from 'react';
import {authModel} from '~/storage/models/auth';
import {useAppDispatch} from '~/store/hooks';
import {getAppSettings, setIsAuth} from '~/store/reducers';

export const useSetupUser = () => {
  const dispatch = useAppDispatch();

  useLayoutEffect(() => {
    dispatch(getAppSettings());
    const isAuth = authModel.getAccessToken();
    if (isAuth) {
      dispatch(setIsAuth(true));
    }
  }, []);
};
