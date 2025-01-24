import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {TabBar} from '~/components/blocks';
import {CatalogNavigator} from '~/navigation';
import {TabBarParamList, TabBarRoutes} from './entities';

const Tab = createBottomTabNavigator<TabBarParamList>();

const MockProfile = () => {
  return null;
};

const TabQrScanner = () => {
  return null;
};

export const TabNavigation = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
      }}
      tabBar={props => <TabBar {...props} />}>
      <Tab.Screen component={CatalogNavigator} name={TabBarRoutes.CatalogTab} />
      <Tab.Screen component={TabQrScanner} name={TabBarRoutes.TabQrScanner} />
      <Tab.Screen component={MockProfile} name={TabBarRoutes.CartTab} />
    </Tab.Navigator>
  );
};
