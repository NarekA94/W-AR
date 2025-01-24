import React, {FC, memo, useCallback} from 'react';
import {Image, StyleSheet, TouchableOpacity, View} from 'react-native';
import {AppText, HR, ScreenWrapper} from '~/components';
import {UserStackParamProps, UserStackRoutes} from '~/navigation';
import CloseIcon from '~/assets/images/close-light.svg';
import {TextColors, TextVariant} from '~/theme';
import {useIntl} from 'react-intl';
export const RewardQr: FC<UserStackParamProps<UserStackRoutes.RewardQr>> = memo(
  ({route, navigation}) => {
    const {params} = route;
    const intl = useIntl();
    const goBack = useCallback(() => {
      navigation.goBack();
    }, []);
    return (
      <ScreenWrapper horizontalPadding={vp(20)} withStatusBar>
        <View style={styles.header}>
          <TouchableOpacity onPress={goBack} hitSlop={30}>
            <CloseIcon />
          </TouchableOpacity>
        </View>
        <View style={styles.body}>
          <View style={styles.section}>
            <AppText variant={TextVariant['24_5A']}>
              <AppText variant={TextVariant['24_5A']} color={TextColors.G090}>
                {intl.formatMessage({
                  id: 'phrases.order',
                  defaultMessage: 'Order',
                })}
                :
              </AppText>
              {params.orderNumber}
            </AppText>
            <Image
              resizeMode="contain"
              style={styles.qr}
              source={{uri: params.qr}}
            />
            <AppText
              variant={TextVariant.S_R}
              color={TextColors.G090}
              style={styles.dontShow}>
              {intl.formatMessage(
                {
                  id: params.dispensaryName
                    ? 'screens.reward.showQr'
                    : 'screens.reward.showQr.address',
                  defaultMessage: `Show QR to budtender at ${params.dispensaryName} when you come there`,
                },
                {dispensaryName: params.dispensaryName},
              )}
            </AppText>
            <HR style={styles.hr} />
            <AppText
              variant={TextVariant.P}
              color={TextColors.G090}
              style={styles.footer}>
              {intl.formatMessage({
                id: 'screens.reward.dontShow',
                defaultMessage:
                  'Do not show the QR to anyone else Do not scan the QR yourself, it will become invalid',
              })}
            </AppText>
          </View>
        </View>
      </ScreenWrapper>
    );
  },
);

const styles = StyleSheet.create({
  header: {
    marginTop: vp(20),
    alignItems: 'flex-end',
  },
  body: {flex: 1, justifyContent: 'center'},
  image: {
    height: vp(70),
    width: vp(70),
    marginBottom: vp(26),
  },
  section: {
    alignItems: 'center',
    marginTop: -vp(40),
  },
  qr: {
    width: vp(240),
    height: vp(240),
    marginTop: vp(35),
    marginBottom: vp(25),
  },
  footer: {
    marginTop: vp(20),
    textAlign: 'center',
    lineHeight: 18,
  },
  dontShow: {
    textAlign: 'center',
    lineHeight: 18,
  },
  hr: {
    marginTop: vp(36),
  },
});
