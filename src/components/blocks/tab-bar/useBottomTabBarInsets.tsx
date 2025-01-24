import {useMemo} from 'react';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

export const TabIconSize = vp(68);

export const useBottomTabBarInsets = () => {
  const {bottom} = useSafeAreaInsets();

  const bottomInset = bottom === 0 ? vp(10) : bottom;
  const tabBarHeight = bottomInset + TabIconSize;
  return useMemo(
    () => ({tabBarHeight, bottomInset}),
    [tabBarHeight, bottomInset],
  );
};
