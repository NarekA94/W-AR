import {authModel} from '~/storage/models/auth';

export function resolveHttpHeaders() {
  const token = authModel.getAccessToken();

  return {
    Authorization: `Bearer ${token}`,
  };
}
