import React, {FC, memo, useCallback, useMemo} from 'react';
import {Marker} from 'react-native-maps';
import {StyleSheet, View} from 'react-native';
import DefaultMarkerIcon from '~/assets/images/dispensaries/map-marker.svg';
import HeartMarkerIcon from '~/assets/images/dispensaries/selected-marker.svg';
import {IS_IOS} from '~/constants/layout';
import {Dispensary} from '~/store/query/brand';

interface MarkerIconProps {
  dispensary: Dispensary;
  index: number;
  selectedDispensaryIndex: number;
  onPressMarker?: (index: number) => void;
}

const SelectedIconSize = vp(53);
const IconSize = vp(24);

export const MarkerIcon: FC<MarkerIconProps> = memo(
  ({dispensary, index, selectedDispensaryIndex, onPressMarker}) => {
    const isSelected = selectedDispensaryIndex === index;
    const currentSize = useMemo(() => {
      return isSelected ? SelectedIconSize : IconSize;
    }, [isSelected]);

    const Icon = useMemo(() => {
      if (dispensary?.isFavourite) {
        return <HeartMarkerIcon width={currentSize} height={currentSize} />;
      }
      return <DefaultMarkerIcon width={currentSize} height={currentSize} />;
    }, [currentSize, dispensary?.isFavourite]);

    const handlePressMarker = useCallback(() => {
      onPressMarker?.(index);
    }, [onPressMarker, index]);

    return (
      <Marker
        onPress={handlePressMarker}
        style={[
          styles.marker,
          IS_IOS && {
            height: currentSize,
          },
        ]}
        coordinate={{
          latitude: dispensary.latitudeCoordinate,
          longitude: dispensary.longitudeCoordinate,
        }}>
        <View style={styles.icon}>{Icon}</View>
      </Marker>
    );
  },
);

const styles = StyleSheet.create({
  marker: {
    width: vp(53),
    height: vp(55),
  },
  icon: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
