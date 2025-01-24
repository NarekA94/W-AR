import React, {FC, memo, useCallback} from 'react';
import {StyleSheet, TouchableOpacity} from 'react-native';
import {AppText} from '~/components';
import {TextColors, TextVariant, useTheme} from '~/theme';
import ArrowForward from '~/assets/images/arrow-forward.svg';
import {useNavigation} from '@react-navigation/native';
import {
  CollectibleShippingMethod,
  OrderShippingMethod,
  UserScreenNavigationProp,
  UserStackRoutes,
} from '~/navigation';

interface DispensaryButtonProps {
  routeParams: CollectibleShippingMethod | OrderShippingMethod;
}

export const DispensaryButton: FC<DispensaryButtonProps> = memo(
  ({routeParams}) => {
    const {theme} = useTheme();
    const navigation = useNavigation<UserScreenNavigationProp>();

    const handlePressDispensary = useCallback(() => {
      if (routeParams.type === 'cart') {
        navigation.navigate(UserStackRoutes.CartDispensary, {
          brandId: routeParams.brandId,
          tab: routeParams.tab,
        });
      }
      if (routeParams.type === 'collectible') {
        navigation.navigate(UserStackRoutes.CollectibleDispensary, {
          dropId: routeParams.dropId,
          productId: routeParams.productId,
        });
      }
    }, [routeParams, navigation]);

    return (
      <TouchableOpacity
        onPress={handlePressDispensary}
        style={[
          styles.button,
          {backgroundColor: theme.button.gray.backgroundColor},
        ]}>
        <AppText variant={TextVariant.M_B} color={TextColors.A100}>
          Dispensaries
        </AppText>
        <ArrowForward style={styles.icon} />
      </TouchableOpacity>
    );
  },
);

const styles = StyleSheet.create({
  button: {
    width: '100%',
    height: vp(50),
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: vp(15),
  },
  icon: {
    position: 'absolute',
    right: 20,
  },
});
