import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {CartScreen} from '~/screens';
import {CartStackParamList, CartStackRoutes} from './entities';

const Stack = createStackNavigator<CartStackParamList>();

export const CartNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name={CartStackRoutes.CartScreen} component={CartScreen} />
    </Stack.Navigator>
  );
};
