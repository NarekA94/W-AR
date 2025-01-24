import {File} from '~/store/types';

export interface State {
  id: number;
  name: string;
  icon: Nullable<File>;
}
