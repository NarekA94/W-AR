import React, {createContext, FC, useState} from 'react';
import {theme} from '~/theme';
import type {Content, ThemeContent} from '~/theme';
import type {IThemeContext} from './entities';

export const ThemeContext = createContext<IThemeContext>({
  changeTheme: () => {},
  theme: theme.light,
});

export const ThemeContextProvider: FC<{children: React.ReactNode}> = ({
  children,
}) => {
  const [selectedTheme, setSelectedTheme] = useState<Content>(theme.light);
  const changeTheme = (content: ThemeContent) => {
    setSelectedTheme(theme[content]);
  };

  return (
    <ThemeContext.Provider value={{theme: selectedTheme, changeTheme}}>
      {children}
    </ThemeContext.Provider>
  );
};
