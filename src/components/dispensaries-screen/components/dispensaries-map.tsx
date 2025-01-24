import React, {useCallback, useMemo, useRef, useState} from 'react';
import MapView, {PROVIDER_GOOGLE, Region} from 'react-native-maps';
import {FlatList, StyleSheet, TouchableOpacity, View} from 'react-native';
import {darkMapTheme} from '~/theme';
import {DefaultHeader} from '../../headers';
import MenuIcon from '~/assets/images/menu.svg';
import {DispensariesScreenComponentProps} from '../dispensaries-screen';
import {Carousel} from '../../carousel/carousel';
import {Dispensary} from '~/store/query/brand';
import {DispensaryItem} from '../../dispensary';
import {MarkerIcon} from './marker';
import {useCheckLocationPermission} from '~/hooks/useCheckLocationPermission';
import {RESULTS} from 'react-native-permissions';
import {getUserCurrentLocation} from '~/utils/locations';
import {Toast, ToastRef} from '~/components/toast/toast';
import {useIntl} from 'react-intl';

interface DispensariesMapProps extends DispensariesScreenComponentProps {
  toggleScreenMode: () => void;
}

// by default USA California
const initialRegion: Region = {
  latitude: 36.778259,
  longitude: -119.417931,
  longitudeDelta: 10,
  latitudeDelta: 10,
};

const latitudeDelta = 0.2;
const longitudeDelta = 0.2;
const loadingCancelationDuration = 200;

export const DispensariesMap: React.FC<DispensariesMapProps> = ({
  toggleScreenMode,
  dispensaries,
  screenTitle,
  type,
  disabled,
  onPressDispensaryItem,
  isLoading,
  onLikeSuccess,
}) => {
  const intl = useIntl();
  const toastRef = useRef<ToastRef>(null);
  const {permissionResult} = useCheckLocationPermission();
  const mapRef = useRef<MapView>(null);
  const [isMapLoaded, setIsMapLoaded] = useState<boolean>(false);
  const [selectedDispensaryIndex, setSelectedDispensaryIndex] =
    useState<number>(0);
  const carouselRef = useRef<FlatList>(null);
  const swipeMode = useRef<'swipe' | 'click' | null>(null);

  const handlePressMarker = useCallback((index: number) => {
    swipeMode.current = 'click';
    setSelectedDispensaryIndex(index);
    carouselRef.current?.scrollToIndex({
      index: index + 1,
      animated: true,
      viewPosition: 0.5,
    });
  }, []);
  const onAddressCopiedHandler = useCallback(() => {
    toastRef.current?.open();
  }, []);
  const renderMarkers = useMemo(() => {
    return dispensaries?.map((dispensary, index) => (
      <MarkerIcon
        key={index}
        dispensary={dispensary}
        selectedDispensaryIndex={selectedDispensaryIndex}
        onPressMarker={handlePressMarker}
        index={index}
      />
    ));
  }, [dispensaries, handlePressMarker, selectedDispensaryIndex]);

  const renderDispensaries = useCallback(
    (item: Dispensary) => {
      return (
        <View
          style={{
            paddingHorizontal: vp(8),
          }}>
          <DispensaryItem
            id={item.id}
            containerStyle={styles.dispensary}
            type={type}
            disabled={disabled}
            workTime={item.workTime}
            isThirdParty={item.isThirdParty}
            isFavourite={item.isFavourite}
            onPress={onPressDispensaryItem}
            name={item.name}
            address={item.address}
            phone={item.phone}
            latitudeCoordinate={item.latitudeCoordinate}
            longitudeCoordinate={item.longitudeCoordinate}
            distance={item.distance}
            tabInfo={item.tabInfo}
            onAddressCopied={onAddressCopiedHandler}
            onLikeSuccess={onLikeSuccess}
          />
        </View>
      );
    },
    [
      disabled,
      onPressDispensaryItem,
      type,
      onAddressCopiedHandler,
      onLikeSuccess,
    ],
  );

  const onSnapToItem = useCallback(
    (index: number | null) => {
      if (index !== null && dispensaries && swipeMode.current === 'swipe') {
        const dispensary = dispensaries[index];
        mapRef.current?.animateToRegion(
          {
            latitude: dispensary?.latitudeCoordinate,
            longitude: dispensary?.longitudeCoordinate,
            latitudeDelta,
            longitudeDelta,
          },
          100,
        );
        requestAnimationFrame(() => {
          setSelectedDispensaryIndex(index);
        });
      }
    },
    [dispensaries, mapRef],
  );

  const onScrollBeginDrag = useCallback(() => {
    swipeMode.current = 'swipe';
  }, []);

  const handleMapLoaded = useCallback(async () => {
    if (isMapLoaded) {
      return;
    }
    if (!dispensaries) {
      return;
    }
    if (permissionResult === RESULTS.GRANTED) {
      const userLocation = await getUserCurrentLocation();
      mapRef.current?.animateToRegion(
        {
          latitude: userLocation?.coords.latitude,
          longitude: userLocation?.coords.longitude,
          latitudeDelta,
          longitudeDelta,
        },
        0,
      );
    } else {
      const initialDispensary = dispensaries[0];
      mapRef.current?.animateToRegion(
        {
          latitude: initialDispensary.latitudeCoordinate,
          longitude: initialDispensary.longitudeCoordinate,
          latitudeDelta,
          longitudeDelta,
        },
        0,
      );
    }
    setTimeout(() => {
      setIsMapLoaded(true);
    }, loadingCancelationDuration);
  }, [dispensaries, isMapLoaded, permissionResult]);

  const map = useMemo(
    () => (
      <MapView
        ref={mapRef}
        initialRegion={initialRegion}
        style={StyleSheet.absoluteFill}
        provider={PROVIDER_GOOGLE}
        rotateEnabled
        pitchEnabled
        zoomEnabled
        scrollEnabled
        loadingEnabled={false}
        showsCompass={false}
        showsUserLocation={true}
        showsMyLocationButton={false}
        onMapLoaded={handleMapLoaded}
        paddingAdjustmentBehavior={'always'}
        customMapStyle={darkMapTheme}>
        {renderMarkers}
      </MapView>
    ),
    [handleMapLoaded, renderMarkers, onLikeSuccess],
  );

  return (
    <View style={StyleSheet.absoluteFill}>
      {!isMapLoaded && <View style={styles.skeleton} />}
      {map}
      <View style={styles.header}>
        <DefaultHeader
          right={
            <TouchableOpacity hitSlop={30} onPress={toggleScreenMode}>
              <MenuIcon />
            </TouchableOpacity>
          }
          title={screenTitle}
          withSafeZone
        />
      </View>
      <View style={styles.carousel}>
        {!isLoading && (
          <Carousel
            ref={carouselRef}
            renderItem={renderDispensaries}
            onSnapToItem={onSnapToItem}
            data={dispensaries as any}
            onScrollBeginDrag={onScrollBeginDrag}
            extraData={onLikeSuccess}
          />
        )}
      </View>
      <Toast
        message={intl.formatMessage({
          id: 'screens.dispensary.address_copied',
          defaultMessage: 'Address copied to clipboard',
        })}
        ref={toastRef}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: vp(20),
    zIndex: 2,
  },
  carousel: {
    position: 'absolute',
    bottom: 0,
    paddingBottom: vp(25),
    zIndex: 2,
  },
  dispensary: {
    minHeight: vp(211),
  },
  skeleton: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'black',
  },
});
