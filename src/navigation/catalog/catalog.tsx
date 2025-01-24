import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {
  CatalogScreen,
  CategoryScreen,
  BrandsScreen,
  CollectiblesScreen,
} from '~/screens';
import {CatalogStackRoutes, CatalogStackParamList} from './entities';

const Stack = createStackNavigator<CatalogStackParamList>();

export const CatalogNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen
        name={CatalogStackRoutes.CatalogScreen}
        component={CatalogScreen}
      />
      <Stack.Screen
        name={CatalogStackRoutes.CollectiblesScreen}
        component={CollectiblesScreen}
      />
      <Stack.Screen
        name={CatalogStackRoutes.BrandsScreen}
        component={BrandsScreen}
      />
      <Stack.Screen
        name={CatalogStackRoutes.CategoryScreen}
        component={CategoryScreen}
      />
    </Stack.Navigator>
  );
};
