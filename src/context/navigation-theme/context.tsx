import React, {
  createContext,
  FC,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {NavigationThemes, INavigationThemeContext} from './types';

export const NavigationThemeContext = createContext<INavigationThemeContext>({
  changeTheme: () => {},
  theme: NavigationThemes.Dark,
});

export const NavigationThemeContextProvider: FC<{
  children: React.ReactNode;
}> = ({children}) => {
  const [selectedTheme, setSelectedTheme] = useState<NavigationThemes>(
    NavigationThemes.Dark,
  );
  const changeTheme = (content: NavigationThemes) => {
    setSelectedTheme(content);
  };

  return (
    <NavigationThemeContext.Provider
      value={{theme: selectedTheme, changeTheme}}>
      {children}
    </NavigationThemeContext.Provider>
  );
};

export const useNavigationTheme = (): INavigationThemeContext => {
  const themeContent = useContext(NavigationThemeContext);

  return useMemo(() => themeContent, [themeContent]);
};

export const useSetNavigationTheme = (newTheme: NavigationThemes) => {
  const {changeTheme, theme} = useNavigationTheme();

  useEffect(() => {
    if (newTheme !== theme) {
      changeTheme(newTheme);
    }
  }, [theme, changeTheme, newTheme]);
};
