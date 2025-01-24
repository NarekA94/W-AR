import {RootState} from '~/store/types';

export const selectAuthUser = (state: RootState) => state.user.data;
export const selectIsAuth = (state: RootState) => state.user.isAuth;
