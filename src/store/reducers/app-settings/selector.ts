import {RootState} from '~/store/types';

export const selectAppSettings = (state: RootState) => state.appSettings.data;
export const selectStatusForHiddenUi = (state: RootState) =>
  state.appSettings?.data?.rnComponentsStatus;
