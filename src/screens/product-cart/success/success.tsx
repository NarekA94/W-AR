import React, {FC, useCallback} from 'react';
import {Image, StyleSheet, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import SuccesIcon from '~/assets/images/qrscanner/success.png';
import {AppText, Button} from '~/components';
import {ButtonVariant, TextVariant} from '~/theme';
import {UserStackParamProps, UserStackRoutes} from '~/navigation';
import HTML from 'react-native-render-html';
import {WIDTH} from '~/constants/layout';
import {customHTMLElementModels, systemFonts} from '~/utils/html';
import {fontFamily} from '~/theme/utils/font-family';
import {useGetCartCountQuery} from '~/store/query/v2-cart';

export const CartOrderSuccessScreen: FC<
  UserStackParamProps<UserStackRoutes.CartOrderSuccess>
> = ({route, navigation}) => {
  const {params} = route;
  const {data: cart} = useGetCartCountQuery();

  const handlePressViewRewards = useCallback(() => {
    navigation.reset({
      index: 0,
      routes: [
        {name: UserStackRoutes.TabNavigator},
        {name: UserStackRoutes.Rewards},
      ],
    });
  }, [navigation]);

  const hadlePressBackToCart = useCallback(() => {
    navigation.reset({
      index: 0,
      routes: [
        {name: UserStackRoutes.TabNavigator},
        {name: UserStackRoutes.ProductCart},
      ],
    });
  }, [navigation]);

  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.section}>
        <Image source={SuccesIcon} style={styles.img} />
        <AppText variant={TextVariant.H3_A}>{params.title}</AppText>
        <View style={styles.infoBlock}>
          <HTML
            tagsStyles={{
              p: {
                color: '#FFFFFF',
                fontFamily: fontFamily[300],
                textAlign: 'center',
                fontSize: 14,
              },
            }}
            contentWidth={WIDTH}
            source={{
              html: `<p>${params.info}</p>`,
            }}
            customHTMLElementModels={customHTMLElementModels}
            systemFonts={systemFonts}
          />
        </View>
      </View>
      <Button
        onPress={handlePressViewRewards}
        withImageBackground
        title="Go to My Orders"
      />
      {cart && cart.count !== 0 && (
        <Button
          containerStyle={styles.returnToCartBtn}
          variant={ButtonVariant.GRAY}
          onPress={hadlePressBackToCart}
          title="Return to Cart"
          width="100%"
        />
      )}
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
    marginTop: vp(18),
  },
  infoBlock: {
    alignItems: 'center',
    textAlign: 'center',
  },
  returnToCartBtn: {
    marginTop: vp(22),
  },
});
