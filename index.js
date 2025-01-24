/**
 * @format
 */
import 'react-native-gesture-handler';
import 'react-native-url-polyfill/auto';
import 'react-native-reanimated';

import {AppRegistry} from 'react-native';
import App from './src/App';
import {name as appName} from './app.json';

if (__DEV__) {
  import('./ReactotronConfig').then(() => {});
}

AppRegistry.registerComponent(appName, () => App);
