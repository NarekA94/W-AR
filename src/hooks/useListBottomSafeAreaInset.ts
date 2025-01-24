import {useMemo} from 'react';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

export const useListBottomSafeAreaInset = () => {
  const {bottom} = useSafeAreaInsets();
  return useMemo(() => ({bottom: bottom + vp(25)}), [bottom]);
};
