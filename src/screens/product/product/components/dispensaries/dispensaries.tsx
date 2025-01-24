import React, {FC, memo, useCallback, useEffect} from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {FontWeight, GLOBAL_STYLES, TextVariant, useTheme} from '~/theme';
import LocationIcon from '~/assets/images/zip/location.svg';
import {AppText} from '~/components';
import ArrowBackIcon from '~/assets/images/arrowLeft.svg';
import {useNavigation} from '@react-navigation/native';
import {UserScreenNavigationProp, UserStackRoutes} from '~/navigation';
import {useIntl} from 'react-intl';
import {useCheckLocationPermission} from '~/hooks/useCheckLocationPermission';
import {RESULTS} from 'react-native-permissions';
import {useLazyGetDispensaryWithDistanceQuery} from '~/store/query/brand';
import {getUserCurrentLocation} from '~/utils/locations';

const TopGradientColor = [
  'rgba(97, 97, 97, 1)',
  'rgba(97, 97, 97, 1)',
  'rgba(0, 0, 0, 1)',
];
const locations = [0, 0.35, 1];

const BottomGradientColos = ['rgba(51, 51, 51, 1)', 'rgba(0, 0, 0, 1)'];

interface DispensariesProps {
  brandId: number | undefined;
  productId?: number;
  disabled?: boolean;
}

export const Dispensaries: FC<DispensariesProps> = memo(
  ({brandId, productId, disabled}) => {
    const {permissionResult} = useCheckLocationPermission();
    const [getDispensaryWithDistance, {data: dispensaries}] =
      useLazyGetDispensaryWithDistanceQuery();
    const intl = useIntl();
    const {theme} = useTheme();
    const navigation = useNavigation<UserScreenNavigationProp>();

    const handlePressDispensaries = useCallback(() => {
      if (brandId && productId) {
        navigation.navigate(UserStackRoutes.Dispensaries, {
          brandId,
          productId,
          hasPoints: false,
        });
      }
    }, [brandId, productId]);

    useEffect(() => {
      if (permissionResult === RESULTS.GRANTED && brandId) {
        (async () => {
          const userCurrentLocation = await getUserCurrentLocation();
          getDispensaryWithDistance({
            brandId: brandId,
            latitudeCoordinate: userCurrentLocation?.coords?.latitude || 0,
            longitudeCoordinate: userCurrentLocation?.coords?.longitude || 0,
          });
        })();
      }
    }, [permissionResult, brandId]);

    return (
      <TouchableOpacity
        disabled={disabled}
        onPress={handlePressDispensaries}
        style={styles.root}>
        <LinearGradient
          style={styles.gradientTop}
          useAngle
          angle={170}
          locations={locations}
          colors={TopGradientColor}>
          <LinearGradient
            style={styles.gradientBottom}
            colors={BottomGradientColos}>
            <View style={GLOBAL_STYLES.row_vertical_center}>
              <View
                style={[
                  styles.location,
                  {backgroundColor: theme.colors.primary},
                ]}>
                <LocationIcon />
              </View>
              <View>
                <AppText
                  variant={TextVariant.H_5}
                  fontWeight={FontWeight.W500}
                  style={styles.title}
                  withGradient>
                  {intl.formatMessage({
                    id: 'screens.dispensaries.closest.title',
                    defaultMessage: 'Dispensaries',
                  })}
                </AppText>
                <AppText
                  variant={TextVariant.S_5W}
                  fontWeight={FontWeight.W400}>
                  {intl.formatMessage(
                    {
                      id:
                        permissionResult === RESULTS.GRANTED
                          ? 'screens.dispensaries.closest'
                          : 'screens.dispensaries.allowLocation',
                      defaultMessage: 'Closest : ~ 2 miles',
                    },
                    {miles: dispensaries?.[0]?.distance || 0},
                  )}
                </AppText>
              </View>
            </View>

            <ArrowBackIcon style={styles.forwardIcon} />
          </LinearGradient>
        </LinearGradient>
      </TouchableOpacity>
    );
  },
);

const styles = StyleSheet.create({
  title: {
    marginBottom: vp(8),
  },
  root: {marginBottom: vp(28)},
  forwardIcon: {transform: [{rotate: '180deg'}]},
  gradientTop: {
    width: '100%',
    height: vp(80),
    borderRadius: 25,
    padding: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gradientBottom: {
    width: '100%',
    height: '100%',
    borderRadius: 25,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: vp(15),
  },
  location: {
    width: vp(50),
    height: vp(50),
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: vp(16),
  },
});
