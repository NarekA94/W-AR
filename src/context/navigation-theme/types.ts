export enum NavigationThemes {
  Dark = 'Dark',
  Light = 'Light',
}

export interface INavigationThemeContext {
  theme: NavigationThemes;
  changeTheme: (e: NavigationThemes) => void;
}
