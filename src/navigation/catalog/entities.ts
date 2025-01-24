import {CompositeScreenProps} from '@react-navigation/native';
import {
  NativeStackNavigationProp,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';
import {UserStackParamList, UserStackParamProps} from '../user';

export enum CatalogStackRoutes {
  CatalogScreen = 'CatalogScreen',
  CollectiblesScreen = 'CollectiblesScreen',
  BrandsScreen = 'BrandsScreen',
  CategoryScreen = 'CategoryScreen',
}

export type CatalogStackParamList = {
  [CatalogStackRoutes.CatalogScreen]: undefined;
  [CatalogStackRoutes.CollectiblesScreen]: undefined;

  [CatalogStackRoutes.BrandsScreen]: undefined;

  [CatalogStackRoutes.CategoryScreen]: {categoryName: string; id: number};
};

export type CatalogStackParamProps<T extends keyof CatalogStackParamList> =
  NativeStackScreenProps<CatalogStackParamList, T>;

export type CatalogScreenNavigationProp =
  NativeStackNavigationProp<CatalogStackParamList>;

export type CatalogUserComposite<T extends keyof CatalogStackParamList> =
  CompositeScreenProps<
    CatalogStackParamProps<T>,
    UserStackParamProps<keyof UserStackParamList>
  >;
