import React, {FC, memo, useCallback} from 'react';
import {useIntl} from 'react-intl';
import {StyleSheet, View} from 'react-native';
import {AppText, Button} from '~/components';
import {FontWeight, GLOBAL_STYLES, TextColors, TextVariant} from '~/theme';
import TrashIcon from '~/assets/images/trash-big.svg';
import {useNavigation} from '@react-navigation/native';
import {UserScreenNavigationProp} from '~/navigation';
export const EmptyList: FC = memo(() => {
  const intl = useIntl();
  const navigation = useNavigation<UserScreenNavigationProp>();

  const handlePressGoToCatalog = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  return (
    <>
      <View style={GLOBAL_STYLES.flex_1_center}>
        <TrashIcon />
        <AppText
          style={styles.title}
          variant={TextVariant.H4_B}
          fontWeight={FontWeight.W400}
          color={TextColors.A100}>
          {intl.formatMessage({
            id: 'screens.product_cart.emptyList.title',
            defaultMessage: 'Your cart is empty',
          })}
        </AppText>
        <AppText
          style={styles.subtitle}
          variant={TextVariant.S_R}
          color={TextColors.G090}>
          {intl.formatMessage({
            id: 'screens.product_cart.emptyList.subtitle',
            defaultMessage:
              "Looks like you haven't added anything to your cart yet",
          })}
        </AppText>
      </View>
      <Button
        onPress={handlePressGoToCatalog}
        title="Go to Catalog"
        withImageBackground
      />
    </>
  );
});

const styles = StyleSheet.create({
  title: {
    marginBottom: vp(8),
    marginTop: vp(23),
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: vp(40),
  },
});
