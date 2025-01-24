import React, {FC, PropsWithChildren} from 'react';
import {useAppSelector} from '~/store/hooks';
import {selectStatusForHiddenUi} from '~/store/reducers';

export const HiddenUIWrapper: FC<PropsWithChildren> = ({children}) => {
  const shouldBeHidden = useAppSelector(selectStatusForHiddenUi);
  if (shouldBeHidden) {
    return null;
  }
  return <>{children}</>;
};
