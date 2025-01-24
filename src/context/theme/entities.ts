import type {Content, ThemeContent} from '~/theme';

export interface IThemeContext {
  theme: Content;
  changeTheme: (e: ThemeContent) => void;
}
