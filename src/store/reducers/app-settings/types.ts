export type AppSettings = Record<string, any>;

export interface AppSettingsState {
  data: Nullable<AppSettings>;
}

export enum VersionsOs {
  'iOS' = 0,
  'Android' = 1,
  'RN_iOS' = 2,
  'RN_Android' = 3,
}
