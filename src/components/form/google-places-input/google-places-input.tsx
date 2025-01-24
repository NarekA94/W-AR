import React, {FC, memo, useMemo, useRef} from 'react';
import {View, StyleSheet, TouchableOpacity, Keyboard} from 'react-native';
import {
  GooglePlaceData,
  GooglePlaceDetail,
  GooglePlacesAutocomplete,
  GooglePlacesAutocompleteRef,
} from 'react-native-google-places-autocomplete';
import {AppText} from '~/components/blocks';
import config from '~/config/services';
import {GLOBAL_STYLES, TextColors, TextVariant, useTheme} from '~/theme';
import LocationIcon from '~/assets/images/catalog/location.svg';
import {useGetUserAddress, UserAddress} from '~/hooks/useGetUserAddress';
import {logger} from '~/utils';
import {useGetAreaListQuery} from '~/store/query/area';
import {fetchAddressByPlaceId} from '~/utils/geocod';
import {useIsFocusedInput} from '~/hooks/useIsFocusedInput';

export enum PlacesStatusState {
  Valid = 'valid',
  InValid = 'invalid',
}

interface GooglePlacesInputProps {
  placeholder?: string;
  onSelectAddress?: (address: UserAddress) => void;
  isValid?: PlacesStatusState;
  setIsValid?: (isValid: PlacesStatusState | undefined) => void;
  label?: string;
  error?: string;
}

export const GooglePlacesInput: FC<GooglePlacesInputProps> = memo(props => {
  const styles = useStyles();
  const {theme} = useTheme();
  const {data: zipCodeList} = useGetAreaListQuery();

  const {getAddress} = useGetUserAddress();
  const {isFocused, event} = useIsFocusedInput(false);

  const inputRef = useRef<GooglePlacesAutocompleteRef>(null);

  const textInputStyle = useMemo(() => {
    return [
      styles.textInputLayout,
      styles.textInput,
      props.isValid === PlacesStatusState.InValid && styles.errorTextInput,
      props.isValid === PlacesStatusState.Valid && styles.validInput,
      props.error && styles.errorTextInput,
    ];
  }, [styles, props.isValid, props.error]);

  const handlePressGetMyLocation = async () => {
    try {
      Keyboard.dismiss();
      const res = await getAddress();
      if (res.addressLine1) {
        inputRef.current?.setAddressText(res.addressLine1);
      }
      const includesZipInList = zipCodeList?.some(
        zip => zip.zipCode === res.zipCode,
      );
      props.setIsValid?.(
        includesZipInList ? PlacesStatusState.Valid : PlacesStatusState.InValid,
      );
      props.onSelectAddress?.(res);
    } catch (error) {
      logger.warn('err', error);
    }
  };

  const constHandleOnPress = async (
    data: GooglePlaceData,
    detail: GooglePlaceDetail | null,
  ) => {
    try {
      let details;
      if (detail) {
        details = detail;
      } else {
        const res = await fetchAddressByPlaceId(data.place_id);
        details = res.data.results[0];
      }
      const zipAddress = details.address_components.find(component =>
        component.types.includes('postal_code'),
      );
      const city = details.address_components.find(item =>
        item.types.includes('locality'),
      );
      const includesZipInList = zipCodeList?.some(
        zip => zip.zipCode === zipAddress?.long_name,
      );
      props.setIsValid?.(
        includesZipInList ? PlacesStatusState.Valid : PlacesStatusState.InValid,
      );
      props.onSelectAddress?.({
        latitudeCoordinate: details.geometry.location.lat || 0,
        longitudeCoordinate: details.geometry.location.lng || 0,
        city: city?.long_name || '',
        addressLine1: data.description,
        zipCode: zipAddress?.long_name,
        houseNumber: '',
        street: '',
      });
    } catch (error) {
      logger.warn(error);
    }
  };

  return (
    <>
      <AppText
        variant={TextVariant.S_R}
        color={TextColors.B070}
        style={styles.label}>
        {props.label}
      </AppText>
      <View style={GLOBAL_STYLES.flex_1}>
        <GooglePlacesAutocomplete
          ref={inputRef}
          placeholder={props.placeholder || 'Search'}
          enablePoweredByContainer={false}
          keyboardShouldPersistTaps="always"
          fetchDetails={true}
          styles={{
            textInputContainer: styles.textInputContainer,
            textInput: textInputStyle,
            listView: styles.listView,
            row: styles.row,
            description: styles.description,
          }}
          onPress={constHandleOnPress}
          textInputProps={{
            ...event,
            selectionColor: theme.colors.primary,
            placeholderTextColor: theme.colors.textColors.B040,
          }}
          query={{
            key: config.Google_Places_Key,
            language: 'en',
          }}
        />
        {!isFocused && props.isValid === PlacesStatusState.InValid && (
          <AppText variant={TextVariant.R} style={styles.error}>
            We do not deliver to this zip-code yet.
          </AppText>
        )}
        {!isFocused && props.error && (
          <AppText variant={TextVariant.R} style={styles.error}>
            {props.error}
          </AppText>
        )}
        {isFocused && (
          <TouchableOpacity
            onPress={handlePressGetMyLocation}
            style={styles.myLocation}>
            <LocationIcon />
            <AppText variant={TextVariant.M_R} style={styles.useMyLocation}>
              Use my current location
            </AppText>
          </TouchableOpacity>
        )}
      </View>
    </>
  );
});

const useStyles = () => {
  const {theme} = useTheme();
  const {base: defaultColors} = theme.input.colors;

  const colors = defaultColors;
  return useMemo(
    () =>
      StyleSheet.create({
        textInputContainer: {
          height: vp(75),
        },
        myLocation: {
          position: 'absolute',
          top: vp(53),
          paddingLeft: 9,
          flexDirection: 'row',
          alignItems: 'center',
        },
        row: {backgroundColor: 'transparent'},
        listView: {
          borderColor: theme.colors.border.E01,
          borderRadius: 10,
        },
        textInputLayout: {
          ...theme.input.layout.base,
        },
        textInput: {
          ...theme.text[theme.input.textVariant],
          color: colors.text,
          backgroundColor: colors.background,
          borderColor: colors.border,

          borderRadius: theme.input.borderRadius,
          borderStyle: 'solid',
          borderWidth: 2,
          fontFamily: theme.fontFamily[400],
          fontSize: 16,
        },
        validInput: {
          borderColor: theme.colors.border.success,
        },
        errorTextInput: {
          borderColor: '#fbcbf3',
          borderWidth: 2,
        },
        useMyLocation: {
          color: '#6A77F7',
          marginLeft: vp(10),
        },
        label: {
          marginBottom: 4,
          marginLeft: 12,
        },
        error: {
          color: theme.colors.common.error,
          position: 'absolute',
          top: vp(53),
          paddingLeft: 9,
        },
        description: {
          fontFamily: theme.fontFamily[400],
          fontSize: 16,
          color: theme.colors.textColors.B100,
        },
      }),
    [],
  );
};
