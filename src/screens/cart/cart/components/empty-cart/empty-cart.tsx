import React, {FC} from 'react';
import {useIntl} from 'react-intl';
import {StyleSheet, View} from 'react-native';
import {AppText, Button} from '~/components';
import {GLOBAL_STYLES, TextColors, TextVariant} from '~/theme';
import EmptyIcon from '~/assets/images/cart/empty.svg';
import {useNavigation} from '@react-navigation/native';
import {TabBarRoutes, TabStackNavigationProp} from '~/navigation';
export const EmptyCart: FC = () => {
  const navigation = useNavigation<TabStackNavigationProp>();
  const intl = useIntl();
  const handlePressGoToCatalog = () => {
    navigation.jumpTo(TabBarRoutes.CatalogTab);
  };
  return (
    <View style={styles.root}>
      <View style={GLOBAL_STYLES.flex_1}>
        <AppText style={styles.title} variant={TextVariant.H2_B}>
          {intl.formatMessage({
            id: 'cart.title',
            defaultMessage: 'Cart',
          })}
        </AppText>
        <AppText color={TextColors.B040} variant={TextVariant.S_R}>
          {intl.formatMessage({
            id: 'cart.empty.description',
            defaultMessage: 'It’s nothing here yet.',
          })}
        </AppText>
        <View style={styles.section}>
          <EmptyIcon />
        </View>
      </View>

      <View>
        <Button
          width={'100%'}
          title={intl.formatMessage({
            id: 'goToCatalog',
            defaultMessage: 'Go to catalog',
          })}
          onPress={handlePressGoToCatalog}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    paddingTop: vp(52),
    flex: 1,
    paddingBottom: vp(36),
    paddingHorizontal: 24,
  },
  title: {
    marginBottom: 10,
  },
  section: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-end',
    right: -25,
  },
});
