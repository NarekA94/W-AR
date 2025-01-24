import React, {FC} from 'react';
import {Pressable, StyleSheet, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {
  AppText,
  ImageBackgroundWrapper,
  SvgImageBackground,
} from '~/components';
import {GLOBAL_STYLES, TextVariant, useTheme} from '~/theme';
import ButtonBack from '~/assets/images/buttons/button-background.svg';
import {
  CatalogStackRoutes,
  TabBarRoutes,
  UserStackParamProps,
  UserStackRoutes,
} from '~/navigation';
import LogoIcon from '~/assets/images/register/logo.svg';
import {useIntl} from 'react-intl';

export const OrderSuccessScreen: FC<
  UserStackParamProps<UserStackRoutes.OrderSuccess>
> = ({navigation}) => {
  const intl = useIntl();
  const {theme} = useTheme();
  const {bottom} = useSafeAreaInsets();

  const handlePressGoBackToStore = () => {
    navigation.navigate(UserStackRoutes.TabNavigator, {
      screen: TabBarRoutes.CatalogTab,
      params: {
        screen: CatalogStackRoutes.CatalogScreen,
      },
    });
  };

  return (
    <ImageBackgroundWrapper>
      <View style={GLOBAL_STYLES.flex_1}>
        <View style={styles.section}>
          <LogoIcon width={70} height={70} />
          <AppText style={styles.title} variant={TextVariant.H1_B}>
            {intl.formatMessage({
              id: 'orderSuccess.title',
              defaultMessage: 'Thanks for your order!',
            })}
          </AppText>
          <AppText variant={TextVariant.S_R} style={styles.info}>
            {intl.formatMessage({
              id: 'orderSuccess.info',
              defaultMessage:
                'Delivery partner will handle the order from here. You can check your order status in the Current Order bar. Please have your ID ready to show it to the driver for verification.',
            })}
          </AppText>
        </View>
        <View
          style={[
            styles.footer,
            {backgroundColor: theme.colors.primary, paddingBottom: bottom},
          ]}>
          <Pressable onPress={handlePressGoBackToStore}>
            <SvgImageBackground
              containerStyle={styles.containerStyle}
              svgComponent={<ButtonBack />}>
              <AppText variant={TextVariant.M_B}>Back to Store</AppText>
            </SvgImageBackground>
          </Pressable>
        </View>
      </View>
    </ImageBackgroundWrapper>
  );
};

const styles = StyleSheet.create({
  title: {
    marginTop: 24,
    marginBottom: 15,
  },
  section: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    marginTop: -vp(80),
  },
  footer: {
    backgroundColor: 'black',
    height: vp(96),
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  containerStyle: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  info: {
    fontSize: 15,
    opacity: 0.8,
  },
});
