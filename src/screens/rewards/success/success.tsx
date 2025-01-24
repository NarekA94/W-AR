import React, {FC, useCallback} from 'react';
import {useIntl} from 'react-intl';
import {Image, StyleSheet, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import SuccesIcon from '~/assets/images/qrscanner/success.png';
import {AppText, Button} from '~/components';
import {TextColors, TextVariant} from '~/theme';
import {Status} from './status';
import {UserStackParamProps, UserStackRoutes} from '~/navigation';

export const RewardSuccessScreen: FC<
  UserStackParamProps<UserStackRoutes.RewardSuccess>
> = ({route, navigation}) => {
  const {params} = route;
  const intl = useIntl();

  const handlePressViewRewards = useCallback(() => {
    navigation.reset({
      index: 0,
      routes: [
        {name: UserStackRoutes.TabNavigator},
        {
          name: UserStackRoutes.Rewards,
        },
      ],
    });
  }, [navigation]);

  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.section}>
        <Image source={SuccesIcon} style={styles.img} />
        <AppText variant={TextVariant.H3_A}>
          {intl.formatMessage({
            id: 'screens.rewardsuccess.title',
            defaultMessage: 'Congrats!',
          })}
        </AppText>
        <Status isThirdParty={true} />
        <AppText
          style={styles.info}
          color={TextColors.A100}
          variant={TextVariant.S_L}>
          {intl.formatMessage(
            {
              id: params.infoI18nKey || 'screens.shippingMethod.success.info',
              defaultMessage:
                'The order will be delivered to the dispensary within 48 hours after order status will be changed to product on the way',
            },
            params.infoI18nParams,
          )}
        </AppText>
      </View>

      <Button
        onPress={handlePressViewRewards}
        withImageBackground
        title={intl.formatMessage({
          id: 'screens.rewardsuccess.button',
          defaultMessage: 'Go to My Orders',
        })}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  section: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  root: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    paddingHorizontal: 20,
    paddingBottom: vp(32),
  },
  img: {
    width: vp(130),
    height: vp(130),
    marginBottom: vp(100),
  },
  info: {
    textAlign: 'center',
    lineHeight: 17,
  },
});
