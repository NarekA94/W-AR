import {useContext, useMemo} from 'react';
import {ThemeContext, IThemeContext} from '~/context/theme';

export const useTheme = (): IThemeContext => {
  const themeContent = useContext(ThemeContext);

  return useMemo(() => themeContent, [themeContent]);
};
