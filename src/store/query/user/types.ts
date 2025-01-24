import {AxiosProgressEvent} from 'axios';
import {UserData} from '~/store/reducers';

export interface VerifyPhoneRequest {
  phone: string;
  userID: string;
  accessToken: string;
}

export interface SetDocumentsArgs {
  id: number;
  onUploadProgress?: (progressEvent: AxiosProgressEvent) => void;
  data: FormData;
}

export interface DeleteDocumentRequest {
  passportPhotoLink: boolean;
  physicianRecPhotoLink: boolean;
}
export interface DeleteDocumentArgs {
  id: number;
  data: DeleteDocumentRequest;
}

export type UpdateUserRequest = Omit<Partial<UserData>, 'territoryState'> &
  Pick<UserData, 'id'> & {territoryState?: number};

export interface UpdateUserSettingsRequest {
  id: number;
  enableNotifications?: boolean;
  showDiscountBanner?: number;
}

export interface UpdateEmailRequest {
  id: number;
  email: string;
  password: string;
}

export interface UpdatePasswordRequest {
  id: number;
  oldPassword: string;
  password: string;
}
