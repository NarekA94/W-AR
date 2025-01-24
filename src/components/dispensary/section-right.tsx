import React, {FC, memo, useCallback, useEffect, useState} from 'react';
import {AppText} from '~/components';
import {TextVariant} from '~/theme';
import {
  Linking,
  StyleSheet,
  TouchableOpacity,
  View,
  ActionSheetIOS,
} from 'react-native';

import LocationsIcon from '~/assets/images/dispensaries/locations.svg';
import HeartIcon from '~/assets/images/heart.svg';
import HeartFillIcon from '~/assets/images/heart-fill.svg';
import {useToggleFavoriteDispensaryMutation} from '~/store/query/brand';
import {IS_IOS} from '~/constants/layout';
import {logger} from '~/utils';

interface DispensaryBoxSectionRightProps {
  longitudeCoordinate: number;
  latitudeCoordinate: number;
  isFavourite?: boolean;
  dispensaryId: number;
  distance: Nullable<string>;
  onLikeSuccess?: (dispensaryId: number, isFavorite: boolean) => void;
}

export const DispensaryBoxSectionRight: FC<DispensaryBoxSectionRightProps> =
  memo(props => {
    const {dispensaryId, onLikeSuccess} = props;
    const [isFavourite, setIsFavorite] = useState<boolean>(false);
    const [toggleFavorite] = useToggleFavoriteDispensaryMutation();

    useEffect(() => {
      if (props.isFavourite !== undefined) {
        setIsFavorite(props.isFavourite);
      }
    }, [props.isFavourite]);

    const handlePressFavourite = useCallback(() => {
      if (dispensaryId) {
        toggleFavorite({id: dispensaryId})
          .unwrap()
          .then(res => {
            onLikeSuccess?.(dispensaryId, res.isFavourite);
            setIsFavorite(res.isFavourite);
          });
      }
    }, [dispensaryId, toggleFavorite, onLikeSuccess]);

    const openMapOnIos = useCallback(
      async (index: number) => {
        try {
          if (index === 1) {
            const googleAppUrl = `comgooglemaps://?center=${props.latitudeCoordinate},${props.longitudeCoordinate}`;
            const canOpenGoogleApp = await Linking.canOpenURL(googleAppUrl);
            if (canOpenGoogleApp) {
              Linking.openURL(googleAppUrl);
            } else {
              Linking.openURL(
                `http://maps.google.com/maps?q=loc:${props.latitudeCoordinate},${props.longitudeCoordinate}`,
              );
            }
            return;
          }
          if (index === 2) {
            Linking.openURL(
              `maps://?ll=${props.latitudeCoordinate},${props.longitudeCoordinate}`,
            );
          }
        } catch (error) {
          logger.warn(error);
        }
      },
      [props.latitudeCoordinate, props.longitudeCoordinate],
    );

    const handlePressLocation = useCallback(() => {
      if (IS_IOS) {
        ActionSheetIOS.showActionSheetWithOptions(
          {
            options: ['Cancel', 'Google maps', 'Apple maps'],
            cancelButtonIndex: 0,
            userInterfaceStyle: 'dark',
            title: 'Choose a map',
            message: 'What map do you want to build a route on.',
          },
          openMapOnIos,
        );
      } else {
        const url = `geo:0,0?q=${props.latitudeCoordinate},${props.longitudeCoordinate}`;
        Linking.openURL(url);
      }
    }, [openMapOnIos, props.latitudeCoordinate, props.longitudeCoordinate]);
    return (
      <View style={styles.root}>
        <TouchableOpacity onPress={handlePressLocation}>
          <LocationsIcon width={vp(50)} height={vp(50)} />
        </TouchableOpacity>
        <View style={styles.miles}>
          {props.distance && (
            <AppText style={styles.miles} variant={TextVariant['10_4A']}>
              ~ {props.distance} miles
            </AppText>
          )}
        </View>

        <TouchableOpacity style={styles.heart} onPress={handlePressFavourite}>
          {isFavourite ? <HeartFillIcon /> : <HeartIcon />}
        </TouchableOpacity>
      </View>
    );
  });

const styles = StyleSheet.create({
  root: {
    alignItems: 'center',
  },
  miles: {
    marginTop: vp(5),
    marginBottom: vp(10),
  },
  heart: {
    marginBottom: vp(20),
  },
});
