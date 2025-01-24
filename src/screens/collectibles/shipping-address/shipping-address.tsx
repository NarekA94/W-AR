import React, {FC, useCallback, useState} from 'react';
import {useIntl} from 'react-intl';
import {StyleSheet, View} from 'react-native';
import {Autocomplete, Button, ScreenWrapper} from '~/components';
import {UserAddress} from '~/hooks/useGetUserAddress';
import {UserStackParamProps, UserStackRoutes} from '~/navigation';
import {GLOBAL_STYLES} from '~/theme';

export const ShippingAddressScreen: FC<
  UserStackParamProps<UserStackRoutes.ShippingAddress>
> = ({navigation, route}) => {
  const {params} = route;
  const intl = useIntl();
  const [selectedAddress, setSelectedAddress] = useState<UserAddress>();
  const [error, setError] = useState<string>();
  const handlePressItem = useCallback((userAddress: UserAddress) => {
    setSelectedAddress(userAddress);
  }, []);

  const handlePressOkay = useCallback(() => {
    navigation.navigate(UserStackRoutes.CollectiblesShippingMethod, {
      address: selectedAddress,
      ...params,
    });
  }, [selectedAddress, params, navigation]);

  return (
    <ScreenWrapper
      withHeader
      withStatusBar
      withTopInsets
      withBottomInset
      headerProps={{
        title: 'Shipping address',
      }}>
      <Autocomplete
        selectedAddress={selectedAddress}
        setSelectedAddress={setSelectedAddress}
        onPressItem={handlePressItem}
        error={error}
        setError={setError}
      />
      <View style={GLOBAL_STYLES.flex_1} />
      {selectedAddress && !error && (
        <Button
          onPress={handlePressOkay}
          containerStyle={styles.button}
          withImageBackground
          title={intl.formatMessage({
            id: 'buttons.okay',
            defaultMessage: 'Okay',
          })}
        />
      )}
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  button: {
    marginBottom: vp(30),
  },
});
