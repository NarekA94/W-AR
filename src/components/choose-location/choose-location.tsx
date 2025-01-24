import React, {FC, memo, useCallback, useMemo, useState} from 'react';
import {useIntl} from 'react-intl';
import {Alert, FlatList, Linking, StyleSheet, View} from 'react-native';
import {AppText, TextInput} from '~/components';
import {GLOBAL_STYLES, TextColors, TextVariant} from '~/theme';
import GeolocationIcon from '~/assets/images/zip/geolocation.svg';
import {RESULTS} from 'react-native-permissions';
import {ListItemZip} from './list-item';
import {MissingZipCode} from './missing-zip';
import {useGetUserZipCode} from '~/hooks/useGetUserZipCode';
import {UserScreenNavigationProp, UserStackRoutes} from '~/navigation';
import {useNavigation} from '@react-navigation/native';
import {useGetAreaListQuery, AreaBlock} from '~/store/query/area';
import {useUpdateUserMutation} from '~/store/query/user/userApi';
import {useGetAuthUser} from '~/hooks/useGetAuthUser';
import {catalogApi} from '~/store/query/catalog';
import {logger} from '~/utils';
import {SafeAreaView} from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import {WIDTH} from '~/constants/layout';
import {useKeyboard} from '~/hooks/useKeyboard';
import {TouchableOpacity} from '@gorhom/bottom-sheet';
interface ChooseLocationProps {
  withRecent?: boolean;
  handleSelectLocation?: () => void;
  withNavigation?: boolean;
  showPermissionAlert?: boolean;
  type?: 'screen' | 'modal';
}

export const ChooseLocation: FC<ChooseLocationProps> = memo(
  ({
    withRecent = true,
    handleSelectLocation,
    withNavigation,
    showPermissionAlert,
    type = 'screen',
  }) => {
    const prefetchCategories = catalogApi.usePrefetch('getCategories');
    const [updateUser] = useUpdateUserMutation();
    const {keyboardHeight} = useKeyboard();

    const {authUser} = useGetAuthUser();
    const intl = useIntl();

    const navigation = useNavigation<UserScreenNavigationProp>();

    const {data: zipCodeList} = useGetAreaListQuery();
    const [zipCode, setZipCode] = useState<string>('');
    const {permissionResult, userZipCode} =
      useGetUserZipCode(showPermissionAlert);

    const setZipCodeValue = (value: string) => {
      setZipCode(value.replace(/[^0-9]/g, ''));
    };

    const handlePressZip = useCallback(
      async (zip: string) => {
        try {
          if (!authUser?.id) {
            return;
          }

          await updateUser({
            id: authUser?.id,
            catalogZipCode: Number(zip),
          }).unwrap();
          prefetchCategories(undefined, {force: true});

          handleSelectLocation?.();
          if (withNavigation) {
            navigation.reset({
              index: 0,
              routes: [{name: UserStackRoutes.TabNavigator}],
            });
          }
        } catch (error) {
          logger.warn(error);
        }
      },
      [
        authUser,
        handleSelectLocation,
        withNavigation,
        navigation,
        updateUser,
        prefetchCategories,
      ],
    );

    const renderItem = ({item}: FlatListItem<AreaBlock>) => (
      <ListItemZip onPressZip={handlePressZip} body={item.zipCode} />
    );

    const renderRecent = ({item}: FlatListItem<string>) => (
      <ListItemZip onPressZip={handlePressZip} body={item} />
    );

    const handlePressGotToCatalog = useCallback(() => {
      handlePressZip(zipCode);
    }, [zipCode]);

    const handlePressUserZipByLocation = () => {
      if (permissionResult === RESULTS.GRANTED) {
        handlePressZip(userZipCode);
      }
    };

    const filteredZipCodes = useMemo(() => {
      if (zipCode.length > 0) {
        return zipCodeList?.filter(item => {
          return item.zipCode.toLowerCase().includes(zipCode.toLowerCase());
        });
      }
      return zipCodeList;
    }, [zipCode, zipCodeList]);

    const handlePressAllow = useCallback(() => {
      if (permissionResult !== RESULTS.GRANTED) {
        Alert.alert(
          'Location services are off',
          'To use your current location, please enable location services in Settings.',
          [
            {text: 'Not right now'},
            {text: 'Go to Settings', onPress: Linking.openSettings},
          ],
          {
            cancelable: true,
          },
        );
      }
    }, [permissionResult]);

    return (
      <SafeAreaView style={[GLOBAL_STYLES.flex_1]} edges={['bottom']}>
        <TextInput
          inputContainerStyles={type === 'modal' && styles.border_0}
          placeholder={intl.formatMessage({
            id: 'zipCode.input.placeholder',
            defaultMessage: 'Enter a new zip-code',
          })}
          containerStyle={styles.inputContainer}
          value={zipCode}
          onChangeText={setZipCodeValue}
          keyboardType="numeric"
          maxLength={5}
        />
        {!zipCode && (
          <>
            <TouchableOpacity
              onPress={
                userZipCode ? handlePressUserZipByLocation : handlePressAllow
              }>
              <View style={GLOBAL_STYLES.row}>
                <GeolocationIcon />
                <View style={styles.locationSection}>
                  <AppText
                    style={
                      userZipCode ? styles.currentLocation : styles.allowToUse
                    }
                    variant={TextVariant.M_R}
                    color={TextColors.A100}>
                    {intl.formatMessage({
                      id: 'zipCode.currentLocation',
                      defaultMessage: 'Current location',
                    })}
                  </AppText>
                  <AppText
                    // onPress={handlePressUserZipByLocation}
                    style={styles.allow}
                    variant={TextVariant.S_R}
                    color={userZipCode ? TextColors.A100 : TextColors.gray}>
                    {permissionResult === RESULTS.GRANTED
                      ? userZipCode
                      : intl.formatMessage({
                          id: 'zipCode.currentLocation.allowToUse',
                          defaultMessage:
                            'Allow to use your location for zip-code detection',
                        })}
                  </AppText>
                </View>
              </View>
            </TouchableOpacity>
            {withRecent &&
              authUser?.recentCatalogZipCode &&
              authUser?.recentCatalogZipCode.length > 0 && (
                <>
                  <LinearGradient
                    colors={['#2F2F2F', '#525252', '#2F2F2F']}
                    start={{x: 0, y: 0}}
                    end={{x: 1, y: 0}}
                    style={styles.linearGradient}
                  />
                  <AppText
                    style={styles.recent}
                    color={TextColors.G080}
                    variant={TextVariant.P_M}>
                    {intl.formatMessage({
                      id: 'zipCode.recent',
                      defaultMessage: 'Recent',
                    })}
                  </AppText>
                  <FlatList
                    keyboardShouldPersistTaps="always"
                    data={authUser?.recentCatalogZipCode}
                    renderItem={renderRecent}
                  />
                </>
              )}
          </>
        )}
        {zipCode && (
          <>
            <FlatList
              style={styles.listStyle}
              data={filteredZipCodes}
              renderItem={renderItem}
              keyboardShouldPersistTaps="always"
              contentContainerStyle={
                type === 'modal' && {paddingBottom: keyboardHeight}
              }
            />
            {Array.isArray(filteredZipCodes) &&
              filteredZipCodes.length === 0 && (
                <MissingZipCode
                  type={type}
                  handlePressGotToCatalog={handlePressGotToCatalog}
                  navigateToCatalog={withNavigation}
                />
              )}
          </>
        )}
      </SafeAreaView>
    );
  },
);

const styles = StyleSheet.create({
  locationSection: {
    marginLeft: 9,
  },
  currentLocation: {
    marginBottom: vp(17),
  },
  allowToUse: {
    marginBottom: vp(10),
  },
  inputContainer: {
    marginBottom: vp(34),
  },
  listStyle: {
    marginTop: -5,
  },
  recent: {
    marginTop: vp(17),
    marginBottom: vp(19),
  },
  allow: {lineHeight: 18},
  linearGradient: {
    height: 1,
    marginTop: vp(24),
    width: WIDTH,
    marginLeft: -20,
  },
  border_0: {borderWidth: 0},
});
