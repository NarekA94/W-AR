import React, {FC} from 'react';
import {StyleSheet, View, Pressable} from 'react-native';
import {AppText, RadialGradient} from '~/components';
import {GLOBAL_STYLES, TextColors, TextVariant} from '~/theme';
import EditIcon from '~/assets/images/cart/edit.svg';
import {WIDTH} from '~/constants/layout';
import {useNavigation} from '@react-navigation/native';
import {UserScreenNavigationProp, UserStackRoutes} from '~/navigation';

interface DeliveryDetailsProps {
  name?: string;
  address?: string;
  phone?: string;
}

export const DeliveryDetails: FC<DeliveryDetailsProps> = props => {
  const navigation = useNavigation<UserScreenNavigationProp>();
  const handlePressEdit = () => {
    navigation.navigate(UserStackRoutes.OrderDetails);
  };
  return (
    <View style={styles.root}>
      <View style={styles.label}>
        <AppText variant={TextVariant.S_B} color={TextColors.B040}>
          Delivery details
        </AppText>
        <Pressable onPress={handlePressEdit} hitSlop={30}>
          <EditIcon />
        </Pressable>
      </View>
      <RadialGradient
        height={vp(100)}
        width={WIDTH - 48}
        colors={['#fbfcff', '#e4ecfe']}>
        <View style={styles.address}>
          <AppText variant={TextVariant.S_R}>{props.name}</AppText>
          <AppText style={styles.addressText} variant={TextVariant.S_R}>
            {props.address}
          </AppText>
          <AppText variant={TextVariant.S_R}>{props.phone}</AppText>
        </View>
      </RadialGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    marginTop: vp(26),
  },
  address: {
    paddingHorizontal: 16,
    flex: 1,
    justifyContent: 'center',
  },
  label: {
    ...GLOBAL_STYLES.row_between,
    paddingLeft: 12,
    paddingRight: 4,
    marginBottom: 9,
  },
  addressText: {
    width: '75%',
  },
});
