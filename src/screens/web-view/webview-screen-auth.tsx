import React, {FC} from 'react';
import {AuthStackParamProps, AuthStackRoutes} from '~/navigation';
import {WebViewComponent} from '~/components';

export const WebViewScreenAuth: FC<
  AuthStackParamProps<AuthStackRoutes.WebViewScreenAuth>
> = ({route}) => {
  const {params} = route;
  return <WebViewComponent uri={params.uri} />;
};
