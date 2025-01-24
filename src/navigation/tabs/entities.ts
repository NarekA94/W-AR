import {
  BottomTabScreenProps,
  BottomTabNavigationProp,
} from '@react-navigation/bottom-tabs';
import {NavigatorScreenParams} from '@react-navigation/native';
import {CatalogStackParamList} from '~/navigation';
export enum TabBarRoutes {
  CatalogTab = 'Catalog',
  CartTab = 'Cart',
  TabQrScanner = 'TabQrScanner',
}

export type TabBarParamList = {
  [TabBarRoutes.CatalogTab]:
    | NavigatorScreenParams<CatalogStackParamList>
    | undefined;
  [TabBarRoutes.CartTab]: undefined;
  [TabBarRoutes.TabQrScanner]: undefined;
};

export type TabStackParamProps<T extends keyof TabBarParamList> =
  BottomTabScreenProps<TabBarParamList, T>;

export type TabStackNavigationProp = BottomTabNavigationProp<TabBarParamList>;

export const HIDDEN_TAB_SCREEN: TabBarRoutes[] = [TabBarRoutes.TabQrScanner];
