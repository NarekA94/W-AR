import {combineReducers} from 'redux';
import {apiSlice} from './query/apiSlice';
import {zipCodeReducer, userReducer} from './reducers';
import {appSettingsReducer} from './reducers/app-settings';

const appReducer = combineReducers({
  zipCode: zipCodeReducer,
  user: userReducer,
  appSettings: appSettingsReducer,
  [apiSlice.reducerPath]: apiSlice.reducer,
});

export const rootReducer: typeof appReducer = (state, action) => {
  if (action.type === 'user/logOut') {
    state = undefined;
  }
  return appReducer(state, action);
};
