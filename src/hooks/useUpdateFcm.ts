import {useEffect} from 'react';
import messaging from '@react-native-firebase/messaging';
import {authModel} from '~/storage/models/auth';
import {useGetAuthUser} from './useGetAuthUser';
import {httpClient} from '~/api/httpClient';

export const useUpdateFcm = () => {
  const {authUser} = useGetAuthUser();
  useEffect(() => {
    if (authUser) {
      messaging().onTokenRefresh(token => {
        const currentToken = authModel.getFcmToken();
        // console.log('currentToken', currentToken);
        // console.log('token', token);
        if (currentToken !== token) {
          authModel.setFcmToken(token);
          httpClient.put(`/user/${authUser.id}/token`, {firebaseToken: token});
        }
      });
    }
  }, [authUser]);
};
