import {StackScreenProps, StackNavigationProp} from '@react-navigation/stack';
import {
  CompositeScreenProps,
  NavigatorScreenParams,
} from '@react-navigation/native';
import {TabBarParamList, TabStackParamProps} from '~/navigation';
import {UserAddress} from '~/hooks/useGetUserAddress';
import {OrderCollectibleType} from '~/store/query/rewards';
import {ImageRequireSource} from 'react-native';
import {DispensaryTabInfo, ProductTabs} from '~/store/query/brand';

export enum UserStackRoutes {
  TabNavigator = 'TabNavigator',
  Profile = 'Profile',
  ProfileDocumentCenter = 'ProfileDocumentCenter',
  NewZip = 'NewZip',
  ZipCode = 'ZipCode',
  PhoneNumber = 'PhoneNumber',
  PhoneNumberVerify = 'PhoneNumberVerify',
  OrderDetails = 'OrderDetails',
  DocumentCenter = 'DocumentCenter',
  DocumentCenterForCollectibles = 'DocumentCenterForCollectibles',
  OrderReview = 'OrderReview',
  OrderSuccess = 'OrderSuccess',
  SerachBrands = 'SerachBrands',
  SearchProducts = 'SearchProducts',
  ProductScreen = 'ProductScreen',
  CollectibleScreen = 'CollectibleScreen',
  SerachCollectibles = 'SerachCollectibles',
  QrScanner = 'QrScanner',
  Authentic = 'Authentic',
  BrandScreen = 'BrandScreen',
  Dispensaries = 'Dispensaries',
  Dispensary = 'Dispensary',
  Rewards = 'Rewards',
  RewardQr = 'RewardQr',
  RewardSuccess = 'RewardSuccess',
  CollectiblesShippingMethod = 'CollectiblesShippingMethod',
  CollectibleOrderConfirmation = 'CollectibleOrderConfirmation',
  CollectibleDispensary = 'CollectibleDispensary',
  CartDispensary = 'CartDispensary',
  ShippingAddress = 'ShippingAddress',
  MyStateScreen = 'MyStateScreen',
  ChangeEmail = 'ChangeEmail',
  ChangePhone = 'ChangePhone',
  Congratulations = 'Congratulations',
  ChangePassword = 'ChangePassword',
  ContactUs = 'ContactUs',
  VerifyUpdatedNumber = 'VerifyUpdatedNumber',
  ProductCart = 'ProductCart',
  CartOrderConfirmation = 'CartOrderConfirmation',
  CartOrderSuccess = 'CartOrderSuccess',
  DocumentCenterForCart = 'DocumentCenterForCart',
  StickerGameScreen = 'StickerGameScreen',
  FinishGameScreen = 'FinishGameScreen',
  AlreadyPlayedGameScreen = 'AlreadyPlayedGameScreen',
  Settings = 'Settings',
  MarketingNotification = 'MarketingNotification',
  WebViewScreen = 'WebViewScreen',
  PushHistoryScreen = 'PushHistoryScreen',
}

export interface PhoneConfirmParams {
  phone: string;
  country_code: string;
  password: string;
}

export interface EmailConfirmParams {
  email: string;
  password: string;
}

export enum ShippingVariant {
  Dispensary = 'dispensary',
  Address = 'address',
  Both = 'both',
}
export interface CollectibleShippingMethod {
  type: 'collectible';
  dropId: number;
  productId: number;
  address?: UserAddress;
  variant: ShippingVariant;
}

export interface OrderShippingMethod {
  type: 'cart';
  address?: UserAddress;
  tab: ProductTabs;
  variant: ShippingVariant;
  brandId: number;
}

export type UserStackParamList = {
  [UserStackRoutes.TabNavigator]: NavigatorScreenParams<TabBarParamList>;
  [UserStackRoutes.Profile]: undefined;
  [UserStackRoutes.MyStateScreen]: undefined;
  [UserStackRoutes.NewZip]: undefined;
  [UserStackRoutes.ZipCode]: undefined;
  [UserStackRoutes.PhoneNumber]: undefined;
  [UserStackRoutes.PhoneNumberVerify]: {
    verificationId: string;
    phoneNumber: string;
  };
  [UserStackRoutes.OrderDetails]: undefined;
  [UserStackRoutes.DocumentCenter]: {
    productId?: number;
    dispensaryId?: number;
    isThirdParty?: boolean;
  };
  [UserStackRoutes.DocumentCenterForCollectibles]: {
    productId: number;
    dispensaryId?: number;
    address?: UserAddress;
    addressType: OrderCollectibleType;
  };

  [UserStackRoutes.OrderReview]: undefined;
  [UserStackRoutes.OrderSuccess]: undefined;
  [UserStackRoutes.SerachBrands]: undefined;
  [UserStackRoutes.SearchProducts]: {brandId: number};
  [UserStackRoutes.ProductScreen]: {
    productId: number;
    tab?: ProductTabs;
    color?: string;
  };
  [UserStackRoutes.QrScanner]: undefined;
  [UserStackRoutes.Authentic]: {qrToken: string};
  [UserStackRoutes.CollectibleScreen]: {id: number};
  [UserStackRoutes.SerachCollectibles]: undefined;
  [UserStackRoutes.BrandScreen]:
    | {qrToken?: string; brandId?: number; gameId?: string; redeemed?: boolean}
    | undefined;
  [UserStackRoutes.Dispensaries]: {
    brandId: number;
    productId?: number;
    hasPoints: boolean;
    screenTitle?: string;
  };
  [UserStackRoutes.Dispensary]: {
    id: number;
    productId: number;
    tabInfo: DispensaryTabInfo;
  };
  [UserStackRoutes.Rewards]: {orderNumber?: string} | undefined;
  [UserStackRoutes.RewardQr]: {
    dispensaryName?: string;
    qr: string;
    orderNumber: string;
  };
  [UserStackRoutes.RewardSuccess]: {
    isThirdParty?: boolean;
    infoI18nKey: string;
    infoI18nParams?: Record<string, string | number>;
  };
  [UserStackRoutes.CollectiblesShippingMethod]:
    | CollectibleShippingMethod
    | OrderShippingMethod;
  [UserStackRoutes.CollectibleOrderConfirmation]: {
    addressType: OrderCollectibleType;
    dropId: number;
    dispensaryId?: number;
    productId: number;
    address?: UserAddress;
  };
  [UserStackRoutes.CollectibleDispensary]: {dropId: number; productId: number};
  [UserStackRoutes.ShippingAddress]:
    | CollectibleShippingMethod
    | OrderShippingMethod;
  [UserStackRoutes.ChangeEmail]: undefined;
  [UserStackRoutes.ChangePhone]: undefined;
  [UserStackRoutes.Congratulations]: {
    infoI18nKey: string;
    file: ImageRequireSource;
  };
  [UserStackRoutes.ChangePassword]: undefined;
  [UserStackRoutes.ContactUs]: undefined;
  [UserStackRoutes.VerifyUpdatedNumber]: {
    phoneNumber: string;
    verificationId: string;
  };
  [UserStackRoutes.ProductCart]: undefined;
  [UserStackRoutes.CartDispensary]: {
    brandId: number;
    tab: ProductTabs;
  };
  [UserStackRoutes.CartOrderConfirmation]: {
    brandId: number;
    addressType: OrderCollectibleType;
    dispensaryId?: number;
    address?: UserAddress;
    tab: ProductTabs;
  };
  [UserStackRoutes.CartOrderSuccess]: {
    title: string;
    info: string;
  };
  [UserStackRoutes.DocumentCenterForCart]: {
    brandId: number;
    addressType: OrderCollectibleType;
    dispensaryId?: number;
    address?: UserAddress;
    tab: ProductTabs;
  };
  [UserStackRoutes.ProfileDocumentCenter]: undefined;
  [UserStackRoutes.StickerGameScreen]: {
    id: string;
  };
  [UserStackRoutes.FinishGameScreen]: {
    id: string;
  };
  [UserStackRoutes.AlreadyPlayedGameScreen]: {
    id: string;
  };
  [UserStackRoutes.Settings]: undefined;
  [UserStackRoutes.MarketingNotification]: undefined;
  [UserStackRoutes.WebViewScreen]: {uri: string};
  [UserStackRoutes.PushHistoryScreen]: undefined;
};

export type UserStackParamProps<T extends keyof UserStackParamList> =
  StackScreenProps<UserStackParamList, T>;

export type UserScreenNavigationProp = StackNavigationProp<UserStackParamList>;

export type UserTabScreenProps<T extends keyof TabBarParamList> =
  CompositeScreenProps<
    TabStackParamProps<T>,
    UserStackParamProps<keyof UserStackParamList>
  >;
