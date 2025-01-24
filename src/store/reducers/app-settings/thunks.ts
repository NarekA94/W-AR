import {IS_IOS} from './../../../constants/layout';
import {httpClient} from '~/api/httpClient';
import {createAsyncThunk} from '@reduxjs/toolkit';
import {AppSettings, VersionsOs} from './types';

export const getAppSettings = createAsyncThunk(
  'user/getAppSettings',
  async () => {
    const res = await httpClient.get<AppSettings>(
      `app-settings/by-version/${
        IS_IOS ? VersionsOs.RN_iOS : VersionsOs.RN_Android
      }`,
    );
    return res;
  },
);
