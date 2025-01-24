import React, {FC, useCallback} from 'react';
import {Image, StyleSheet, View} from 'react-native';
import {AppText, Button, HR, ScreenWrapper} from '~/components';
import {UserStackParamProps, UserStackRoutes} from '~/navigation';
import {useGetDispensaryQuery} from '~/store/query/brand';
import {
  ButtonVariant,
  FontWeight,
  GLOBAL_STYLES,
  TextColors,
  TextVariant,
} from '~/theme';
import {RowItem} from '~/components/dispensary';
import LocationIcon from '~/assets/images/zip/location.svg';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {Product} from './components/product';
import {useIntl} from 'react-intl';
import {useSetRewardsMutation} from '~/store/query/rewards';
import {useGetAuthUser} from '~/hooks/useGetAuthUser';
import {QueryStatus} from '@reduxjs/toolkit/dist/query';

export const DispensaryScreen: FC<
  UserStackParamProps<UserStackRoutes.Dispensary>
> = ({route, navigation}) => {
  const [setReward, {isLoading, status}] = useSetRewardsMutation();
  const intl = useIntl();
  const {id: dispensaryId, productId, tabInfo} = route.params;
  const {data: dispensary} = useGetDispensaryQuery({id: dispensaryId});
  const {bottom} = useSafeAreaInsets();
  const {authUser} = useGetAuthUser();

  const handlePressBack = useCallback(() => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    }
  }, []);

  const handlePressOk = useCallback(() => {
    if (!authUser?.passportPhotoLink || !authUser?.name) {
      navigation.navigate(UserStackRoutes.DocumentCenter, {
        dispensaryId,
        productId,
        isThirdParty: dispensary?.isThirdParty!,
      });
      return;
    }
    setReward({
      dispensary: dispensaryId,
      productDetails: [{product: productId, quantity: 1}],
    })
      .unwrap()
      .then(() => {
        navigation.reset({
          index: 0,
          routes: [
            {name: UserStackRoutes.TabNavigator},
            {
              name: UserStackRoutes.RewardSuccess,
              params: {
                isThirdParty: dispensary?.isThirdParty,
                infoI18nKey: 'screens.rewards.success.info',
                infoI18nParams: {hours: !dispensary?.isThirdParty ? 24 : 48},
              },
            },
          ],
        });
      });
  }, [
    dispensaryId,
    productId,
    setReward,
    authUser,
    dispensary?.isThirdParty,
    navigation,
  ]);

  return (
    <ScreenWrapper
      withHeader
      dark
      withStatusBar
      headerProps={{
        title: 'Ready to redeem?',
        headerMarginBottom: vp(28),
      }}>
      <Product productId={productId} />
      <HR />
      <View style={[GLOBAL_STYLES.row_between, styles.header]}>
        <AppText variant={TextVariant.H_5} fontWeight={FontWeight.W500}>
          {dispensary?.name}
        </AppText>
        <View style={GLOBAL_STYLES.row_vertical_center}>
          <Image
            resizeMode="contain"
            style={styles.tabInfoImage}
            source={{uri: tabInfo?.icon?.url}}
          />
          <AppText variant={TextVariant.P_M} fontWeight={FontWeight.W500}>
            {tabInfo?.name}
          </AppText>
        </View>
      </View>
      <RowItem
        title={dispensary?.address}
        icon={<LocationIcon width={vp(20)} />}
        titleStyles={styles.location}
      />
      <AppText
        style={styles.info}
        variant={TextVariant.S_L}
        color={TextColors.G090}>
        {intl.formatMessage(
          {
            id: 'screens.rewards.success.info',
            defaultMessage:
              'The order will reach the dispensary within {hours} hours, you’ll be able to pick it up once the status changes to “product on the way”',
          },
          {hours: !dispensary?.isThirdParty ? 24 : 48},
        )}
      </AppText>
      <View style={GLOBAL_STYLES.flex_1} />
      <View
        style={[
          GLOBAL_STYLES.row_between,
          styles.buttons,
          {marginBottom: bottom},
        ]}>
        <Button
          width="48%"
          onPress={handlePressBack}
          variant={ButtonVariant.GRAY}
          title={intl.formatMessage({
            id: 'buttons.back',
            defaultMessage: 'Back',
          })}
        />
        <Button
          isLoading={isLoading}
          disabled={isLoading || status === QueryStatus.fulfilled}
          withImageBackground
          title={intl.formatMessage({
            id: 'buttons.ok',
            defaultMessage: 'Back',
          })}
          width="48%"
          onPress={handlePressOk}
        />
      </View>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  header: {
    marginTop: vp(26),
    marginBottom: vp(21),
  },
  imageStyle: {
    width: '100%',
  },
  info: {
    lineHeight: 20,
    marginTop: vp(27),
    flexShrink: 1,
    width: '95%',
  },
  buttons: {
    paddingBottom: vp(25),
  },
  imageBoxStyle: {
    height: vp(50),
    width: '48%',
    borderRadius: 18,
  },
  button: {
    height: vp(50),
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  location: {
    fontSize: 16,
  },
  tabInfoImage: {
    marginRight: vp(8),
    height: vp(15),
    width: vp(15),
    marginBottom: vp(2),
  },
});
