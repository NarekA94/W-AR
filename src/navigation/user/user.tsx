import React, {FC, useMemo} from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {UserStackParamList, UserStackRoutes} from './entities';
import {TabNavigation} from '~/navigation/tabs';
import {
  NewZipScreen,
  PhoneNumberScreen,
  PhoneNumberVerifyScreen,
  ZipCodeScreen,
  OrderDetails,
  DocumentCenterScreen,
  DocumentCenterForCollectiblesScreen,
  OrderReviewScreen,
  OrderSuccessScreen,
  SerachBrandsScreen,
  SearchProductsScreen,
  ProductScreen,
  CollectibleScreen,
  QrScannerScreen,
  AuthenticScreen,
  BrandScreen,
  DispensariesScreen,
  DispensaryScreen,
  RewardsScreen,
  RewardQr,
  RewardSuccessScreen,
  SerachCollectiblesScreen,
  CollectiblesShippingMethodScreen,
  OrderConfirmationScreen,
  CollectibleDispensaryScreen,
  ShippingAddressScreen,
  ProfileScreen,
  MyStateScreen,
  ChangeEmailScreen,
  ChangePhoneScreen,
  CongratulationsScreen,
  ChangePasswordScreen,
  ContactUsScreen,
  VerifyUpdatedNumberScreen,
  ProductCartScreen,
  CartDispensaryScreen,
  CartOrderConfirmationScreen,
  CartOrderSuccessScreen,
  DocumentCenterForCartScreen,
  ProfileDocumentCenterScreen,
  StickerGameScreen,
  FinishGameScreen,
  AlreadyPlayedGameScreen,
  SettingsScreen,
  MarketingNotifications,
  WebViewScreenUser,
  PushHistoryScreen,
} from '~/screens';
import {useGetCurrentUserQuery} from '~/store/query/user/userApi';
import {UserCachedRegisterStep, userModel} from '~/storage/models/user';
import {useGetCategoriesQuery} from '~/store/query/catalog';
import {authenticModel} from '~/storage/models/authentic';
import {Linking} from 'react-native';
import {BrandDeepLink, GameDeepLink} from '../linking';
import '~/utils/notifee';
import {
  BrandContextProvider,
  BrandSearchContextProvider,
} from '~/context/brand';
import {CartContextProvider} from '~/context/cart';
import {FullNameModal} from '~/components/full-name-modal/full-name-modal';
import {gameModel} from '~/storage/models/game';
import {useSetupPlugins} from '~/hooks/useSetupPlugins';

const Stack = createStackNavigator<UserStackParamList>();

export const UserNavigation: FC = () => {
  useGetCurrentUserQuery();
  useGetCategoriesQuery();
  useSetupPlugins();
  const currentInitialRouteName = useMemo(() => {
    const userStep = userModel.getUserCachedRegisterStep();
    if (userStep === UserCachedRegisterStep.PHONE_NUMBER) {
      return UserStackRoutes.PhoneNumber;
    }

    const authenticToken = authenticModel.getAuthenticToken();
    const gameToken = gameModel.getGameToken();
    if (authenticToken) {
      Linking.openURL(`${BrandDeepLink}?qrToken=${authenticToken}`);
    } else if (gameToken) {
      Linking.openURL(GameDeepLink + gameToken);
    }
    return UserStackRoutes.TabNavigator;
  }, []);

  return (
    <>
      <CartContextProvider>
        <BrandContextProvider>
          <BrandSearchContextProvider>
            <Stack.Navigator
              screenOptions={{headerShown: false}}
              initialRouteName={currentInitialRouteName}>
              <Stack.Screen
                name={UserStackRoutes.TabNavigator}
                component={TabNavigation}
              />
              <Stack.Screen
                name={UserStackRoutes.Profile}
                component={ProfileScreen}
              />
              <Stack.Screen
                name={UserStackRoutes.ProfileDocumentCenter}
                component={ProfileDocumentCenterScreen}
              />
              <Stack.Screen
                name={UserStackRoutes.NewZip}
                component={NewZipScreen}
              />
              <Stack.Screen
                name={UserStackRoutes.ZipCode}
                component={ZipCodeScreen}
              />
              <Stack.Screen
                name={UserStackRoutes.MyStateScreen}
                component={MyStateScreen}
              />
              <Stack.Screen
                name={UserStackRoutes.PhoneNumber}
                component={PhoneNumberScreen}
              />
              <Stack.Screen
                name={UserStackRoutes.PhoneNumberVerify}
                component={PhoneNumberVerifyScreen}
              />
              <Stack.Screen
                name={UserStackRoutes.OrderDetails}
                component={OrderDetails}
              />
              <Stack.Screen
                name={UserStackRoutes.DocumentCenter}
                component={DocumentCenterScreen}
              />
              <Stack.Screen
                name={UserStackRoutes.DocumentCenterForCollectibles}
                component={DocumentCenterForCollectiblesScreen}
              />
              <Stack.Screen
                name={UserStackRoutes.OrderReview}
                component={OrderReviewScreen}
              />
              <Stack.Screen
                name={UserStackRoutes.OrderSuccess}
                component={OrderSuccessScreen}
              />
              <Stack.Screen
                name={UserStackRoutes.SerachBrands}
                component={SerachBrandsScreen}
              />
              <Stack.Screen
                name={UserStackRoutes.ProductScreen}
                component={ProductScreen}
              />
              <Stack.Screen
                name={UserStackRoutes.SearchProducts}
                component={SearchProductsScreen}
              />
              <Stack.Screen
                name={UserStackRoutes.CollectibleScreen}
                component={CollectibleScreen}
              />
              <Stack.Screen
                name={UserStackRoutes.SerachCollectibles}
                component={SerachCollectiblesScreen}
              />
              <Stack.Screen
                name={UserStackRoutes.QrScanner}
                component={QrScannerScreen}
              />
              <Stack.Screen
                name={UserStackRoutes.Authentic}
                component={AuthenticScreen}
              />
              <Stack.Screen
                name={UserStackRoutes.BrandScreen}
                component={BrandScreen}
              />
              <Stack.Screen
                name={UserStackRoutes.Dispensaries}
                component={DispensariesScreen}
              />
              <Stack.Screen
                name={UserStackRoutes.Dispensary}
                component={DispensaryScreen}
              />
              <Stack.Screen
                name={UserStackRoutes.Rewards}
                component={RewardsScreen}
              />
              <Stack.Screen
                name={UserStackRoutes.RewardQr}
                component={RewardQr}
              />
              <Stack.Screen
                name={UserStackRoutes.RewardSuccess}
                component={RewardSuccessScreen}
              />
              <Stack.Screen
                name={UserStackRoutes.CollectiblesShippingMethod}
                component={CollectiblesShippingMethodScreen}
              />
              <Stack.Screen
                name={UserStackRoutes.CollectibleOrderConfirmation}
                component={OrderConfirmationScreen}
              />
              <Stack.Screen
                name={UserStackRoutes.CollectibleDispensary}
                component={CollectibleDispensaryScreen}
              />
              <Stack.Screen
                name={UserStackRoutes.ShippingAddress}
                component={ShippingAddressScreen}
              />
              <Stack.Screen
                name={UserStackRoutes.ChangeEmail}
                component={ChangeEmailScreen}
              />
              <Stack.Screen
                name={UserStackRoutes.ChangePhone}
                component={ChangePhoneScreen}
              />
              <Stack.Screen
                name={UserStackRoutes.Congratulations}
                component={CongratulationsScreen}
              />
              <Stack.Screen
                name={UserStackRoutes.ChangePassword}
                component={ChangePasswordScreen}
              />
              <Stack.Screen
                name={UserStackRoutes.ContactUs}
                component={ContactUsScreen}
              />
              <Stack.Screen
                name={UserStackRoutes.VerifyUpdatedNumber}
                component={VerifyUpdatedNumberScreen}
              />
              <Stack.Screen
                name={UserStackRoutes.ProductCart}
                component={ProductCartScreen}
              />
              <Stack.Screen
                name={UserStackRoutes.CartDispensary}
                component={CartDispensaryScreen}
              />
              <Stack.Screen
                name={UserStackRoutes.CartOrderConfirmation}
                component={CartOrderConfirmationScreen}
              />
              <Stack.Screen
                name={UserStackRoutes.CartOrderSuccess}
                component={CartOrderSuccessScreen}
              />
              <Stack.Screen
                name={UserStackRoutes.DocumentCenterForCart}
                component={DocumentCenterForCartScreen}
              />
              <Stack.Screen
                name={UserStackRoutes.StickerGameScreen}
                component={StickerGameScreen}
              />
              <Stack.Screen
                name={UserStackRoutes.FinishGameScreen}
                component={FinishGameScreen}
              />
              <Stack.Screen
                name={UserStackRoutes.AlreadyPlayedGameScreen}
                component={AlreadyPlayedGameScreen}
              />
              <Stack.Screen
                name={UserStackRoutes.Settings}
                component={SettingsScreen}
              />
              <Stack.Screen
                name={UserStackRoutes.MarketingNotification}
                component={MarketingNotifications}
              />
              <Stack.Screen
                name={UserStackRoutes.WebViewScreen}
                component={WebViewScreenUser}
              />
              <Stack.Screen
                name={UserStackRoutes.PushHistoryScreen}
                component={PushHistoryScreen}
              />
            </Stack.Navigator>
            <FullNameModal />
          </BrandSearchContextProvider>
        </BrandContextProvider>
      </CartContextProvider>
    </>
  );
};
