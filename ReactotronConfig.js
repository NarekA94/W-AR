import Reactotron from 'reactotron-react-native';
import {NativeModules} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
let scriptHostname;
if (__DEV__) {
  const scriptURL = NativeModules.SourceCode.scriptURL;
  scriptHostname = scriptURL.split('://')[1].split(':')[0];
}
Reactotron.setAsyncStorageHandler(AsyncStorage)
  .configure({host: scriptHostname})
  .useReactNative()
  .connect();
