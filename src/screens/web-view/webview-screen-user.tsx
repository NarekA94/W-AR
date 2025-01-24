import React, {FC} from 'react';
import {UserStackParamProps, UserStackRoutes} from '~/navigation';

import {WebViewComponent} from '~/components';

export const WebViewScreenUser: FC<
  UserStackParamProps<UserStackRoutes.WebViewScreen>
> = ({route}) => {
  const {params} = route;
  return <WebViewComponent uri={params.uri} />;
};
