import React, {
  FC,
  memo,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {View, StyleSheet, TouchableOpacity, Pressable} from 'react-native';
import {FlatList} from 'react-native-gesture-handler';
import LocationIcon from '~/assets/images/zip/location.svg';
import {AppText, ListEmpty, SearchInput} from '..';
import {GLOBAL_STYLES, TextColors, TextVariant, useTheme} from '~/theme';
import {PlaceDetails, Prediction} from './types';
import {useAutocomplete} from './useAutocomplete';
import {logger} from '~/utils';
import GeolocationIcon from '~/assets/images/zip/geolocation.svg';
import {useIntl} from 'react-intl';
import {RESULTS} from 'react-native-permissions';
import {
  UserAddress,
  useGetUserAddress,
  getAddressComponent,
} from '~/hooks/useGetUserAddress';
import {AvailableCountriesShortName} from '~/types/global';
import {UserAddresses} from '~/store/reducers';
import CloseIcon from '~/assets/images/close.svg';
import {
  useDeleteUserAddressMutation,
  useGetCurrentUserQuery,
} from '~/store/query/user/userApi';

interface AutocompleteProps {
  error?: string;
  setError?: (err: string) => void;
  onPressItem?: (userAddress: UserAddress, details?: PlaceDetails) => void;
  selectedAddress: UserAddress | undefined;
  setSelectedAddress: (address: UserAddress | undefined) => void;
}

export const Autocomplete: FC<AutocompleteProps> = memo(props => {
  const {onPressItem} = props;
  const intl = useIntl();
  const {theme} = useTheme();
  const {data: authUser} = useGetCurrentUserQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });
  const [deleteUserAddress] = useDeleteUserAddressMutation();
  const {getAddress, permissionResult} = useGetUserAddress();
  const [userCurrentAddress, setUserCurrentAddress] = useState<UserAddress>();
  const {address, handleChangeAddress, data, requestDetails, setAddress} =
    useAutocomplete();

  useEffect(() => {
    (async () => {
      try {
        const userAddress = await getAddress();
        setUserCurrentAddress(userAddress);
      } catch (error) {
        logger.warn(error);
      }
    })();
  }, [getAddress]);

  const handleChangeText = useCallback(
    (text: string) => {
      handleChangeAddress(text);
      if (props.error) {
        props.setError?.('');
      }
      if (props.selectedAddress) {
        props.setSelectedAddress?.(undefined);
      }
    },
    [handleChangeAddress, props],
  );

  const validateAddress = useCallback((userAddress: UserAddress) => {
    if (!userAddress.houseNumber) {
      props.setError?.('Address must contain house number');
      return;
    }
    if (!userAddress.zipCode) {
      props.setError?.('Address must contain zip code');
      return;
    }
    if (!userAddress.street) {
      props.setError?.('Address must contain street name');
      return;
    }
  }, []);

  const handlePressItem = useCallback(
    (place_id: string, prediction: Prediction) => {
      return async () => {
        try {
          setAddress(prediction.description);
          const details = await requestDetails(place_id);
          const addressComponents = details?.data?.result?.address_components;
          const houseNumber = getAddressComponent(
            addressComponents,
            'street_number',
          )?.long_name;

          const street = getAddressComponent(
            addressComponents,
            'route',
          )?.long_name;

          const userAddress: UserAddress = {
            zipCode: getAddressComponent(addressComponents, 'postal_code')
              ?.long_name,
            addressLine1: details?.data?.result?.formatted_address,
            city:
              getAddressComponent(addressComponents, 'locality')?.long_name ||
              '',
            street: street || '',
            houseNumber: houseNumber || '',
            latitudeCoordinate: details.data?.result?.geometry?.location?.lat,
            longitudeCoordinate: details.data?.result?.geometry?.location?.lng,
          };
          validateAddress(userAddress);
          onPressItem?.(userAddress, details.data.result);
        } catch (error) {
          logger.warn(error);
        }
      };
    },
    [],
  );

  const renderItem = useCallback(
    ({item}: FlatListItem<Prediction>) => {
      return (
        <TouchableOpacity
          onPress={handlePressItem(item.place_id, item)}
          style={styles.item}>
          <LocationIcon />
          <AppText
            style={styles.address}
            variant={TextVariant.S_R}
            color={TextColors.A100}>
            {item.description}
          </AppText>
        </TouchableOpacity>
      );
    },
    [handlePressItem],
  );

  const handlePressAddressHistoryItem = useCallback(
    (userAddress: UserAddresses) => () => {
      setAddress(userAddress.addressLine1);

      onPressItem?.({
        zipCode: userAddress.zipCode,
        addressLine1: userAddress.addressLine1,
        city: userAddress.city,
        street: userAddress.street,
        houseNumber: userAddress.houseNumber,
        latitudeCoordinate: userAddress.latitudeCoordinate,
        longitudeCoordinate: userAddress.longitudeCoordinate,
        addressId: userAddress.id,
      });
    },
    [onPressItem, setAddress],
  );

  const handlePressRemoveAddress = useCallback(
    (userAddress: UserAddresses) => () => {
      deleteUserAddress({id: userAddress.id});
    },
    [deleteUserAddress],
  );

  const renderAddressHistoryItem = useCallback(
    ({item}: FlatListItem<UserAddresses>) => {
      return (
        <TouchableOpacity
          onPress={handlePressAddressHistoryItem(item)}
          style={styles.addressHistoryItem}>
          <View style={[GLOBAL_STYLES.row, GLOBAL_STYLES.flex_1]}>
            <LocationIcon />
            <AppText
              style={styles.address}
              variant={TextVariant.S_R}
              color={TextColors.A100}>
              {item.addressLine1}
            </AppText>
          </View>

          <TouchableOpacity
            style={styles.deleteButton}
            hitSlop={30}
            onPress={handlePressRemoveAddress(item)}>
            <CloseIcon color={theme.colors.textColors.A100} />
          </TouchableOpacity>
        </TouchableOpacity>
      );
    },
    [
      handlePressAddressHistoryItem,
      handlePressRemoveAddress,
      theme.colors.textColors.A100,
    ],
  );

  const ListEmptyComponent = useMemo(() => {
    if (address) {
      return ListEmpty;
    }
    return null;
  }, [address]);

  const handlePressUserLocation = useCallback(() => {
    if (permissionResult !== RESULTS.GRANTED) {
      return;
    }
    if (userCurrentAddress) {
      setAddress(userCurrentAddress.addressLine1);
      if (!userCurrentAddress.houseNumber) {
        props.setError?.('Address must contain house number');
      }
      if (!userCurrentAddress.street) {
        props.setError?.('Address must contain street name');
      }
      if (userCurrentAddress.country !== AvailableCountriesShortName.US) {
        props.setError?.('We only ship within the United States.');
      }
      onPressItem?.(userCurrentAddress);
    }
  }, [onPressItem, userCurrentAddress, permissionResult]);

  return (
    <>
      <View style={styles.inputBox}>
        <SearchInput
          error={props.error}
          setValue={handleChangeText}
          value={address}
        />
      </View>
      {!address && (
        <>
          <View style={GLOBAL_STYLES.row}>
            <GeolocationIcon />

            <Pressable
              onPress={handlePressUserLocation}
              style={styles.locationSection}>
              <AppText
                style={styles.currentLocation}
                variant={TextVariant.M_R}
                color={TextColors.A100}>
                {intl.formatMessage({
                  id: 'zipCode.currentLocation',
                  defaultMessage: 'Current location',
                })}
              </AppText>
              <AppText
                style={styles.allow}
                variant={TextVariant.S_R}
                size={12}
                color={TextColors.gray}>
                {permissionResult === RESULTS.GRANTED
                  ? userCurrentAddress?.addressLine1
                  : intl.formatMessage({
                      id: 'locations.currentLocation.allowToUse',
                      defaultMessage:
                        'Enable location services for accurate address detection',
                    })}
              </AppText>
            </Pressable>
          </View>
          {authUser?.addresses && authUser?.addresses.length > 0 && (
            <>
              <AppText style={styles.addressHistory} variant={TextVariant.P_M}>
                {intl.formatMessage({
                  id: 'shipping_address.history',
                  defaultMessage: 'Address history',
                })}
              </AppText>
              <FlatList
                data={authUser?.addresses}
                renderItem={renderAddressHistoryItem}
              />
            </>
          )}
        </>
      )}
      {!props.selectedAddress && (
        <FlatList
          ListEmptyComponent={ListEmptyComponent}
          data={data}
          renderItem={renderItem}
        />
      )}
    </>
  );
});

const styles = StyleSheet.create({
  inputBox: {
    marginBottom: vp(33),
  },
  address: {
    marginLeft: vp(10),
    flexShrink: 1,
    marginTop: vp(3),
  },
  item: {
    flexDirection: 'row',
    marginBottom: vp(16),
  },
  locationSection: {
    marginLeft: 9,
  },
  currentLocation: {
    marginTop: 3,
  },
  allowToUse: {
    marginBottom: vp(10),
  },
  allow: {
    lineHeight: 18,
    marginTop: vp(5),
  },
  addressHistory: {
    marginBottom: vp(16),
    marginTop: vp(22),
  },
  addressHistoryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  deleteButton: {marginLeft: vp(10)},
});
