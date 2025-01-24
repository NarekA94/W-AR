import React from 'react';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {Navigation} from '~/navigation';
import {I18nWrapper} from '~/i18n/wrapper';
import {Provider} from 'react-redux';
import {store} from '~/store';
import {gestureHandlerRootHOC} from 'react-native-gesture-handler';
import '~/utils/responsiveLayout';
import {NavigationThemeContextProvider} from './context/navigation-theme';
import {withCodePush} from './plugins/withCodePush';

const App = () => {
  return (
    <I18nWrapper>
      <Provider store={store}>
        <SafeAreaProvider>
          <NavigationThemeContextProvider>
            <Navigation />
          </NavigationThemeContextProvider>
        </SafeAreaProvider>
      </Provider>
    </I18nWrapper>
  );
};

export default withCodePush(gestureHandlerRootHOC(App));
