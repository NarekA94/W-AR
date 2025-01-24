import React, {FC, useCallback, useRef, useState} from 'react';
import {useIntl} from 'react-intl';
import {FlatList, TouchableOpacity, StyleSheet} from 'react-native';
import {ScreenWrapper, Toast, ToastRef} from '~/components';
import {DispensaryItem} from '~/components/dispensary';
import MapIcon from '~/assets/images/dispensaries/map.svg';
import {Dispensary} from '~/store/query/brand';
import SkeletonIcon from '~/assets/images/catalog/brand-skeleton.svg';
import {DispensariesMap} from './components/dispensaries-map';

const skeletonMockData = [...Array(4).keys()];

export enum DispensaryType {
  COLLECTIBLE = 'collectible',
  BRAND = 'brand',
}
export interface DispensariesScreenComponentProps {
  dispensaries?: Dispensary[];
  isLoading?: boolean;
  onPressDispensaryItem?: (id: number) => void;
  disabled?: boolean;
  type?: DispensaryType;
  screenTitle?: string;
  refetchDispensaries?: () => void;
  onLikeSuccess?: (dispensaryId: number, isFavorite: boolean) => void;
}

export const DispensariesScreenComponent: FC<
  DispensariesScreenComponentProps
> = ({
  dispensaries,
  isLoading,
  disabled,
  onPressDispensaryItem,
  type,
  screenTitle,
  refetchDispensaries,
  onLikeSuccess,
}) => {
  const intl = useIntl();
  const toastRef = useRef<ToastRef>(null);

  const [screenMode, setScreenMode] = useState<'list' | 'map'>('list');
  const toggleScreenMode = useCallback(() => {
    refetchDispensaries?.();
    setScreenMode(prev => (prev === 'list' ? 'map' : 'list'));
  }, [refetchDispensaries]);

  const onAddressCopiedHandler = useCallback(() => {
    toastRef.current?.open();
  }, []);
  const renderDispensaries = useCallback(
    ({item}: FlatListItem<Dispensary>) => (
      <DispensaryItem
        id={item.id}
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
    ),
    [
      type,
      disabled,
      onPressDispensaryItem,
      onAddressCopiedHandler,
      onLikeSuccess,
    ],
  );

  const renderSkeleton = useCallback(
    (item: number) => (
      <SkeletonIcon
        key={item}
        width="100%"
        height={vp(183)}
        style={styles.skeleton}
      />
    ),
    [],
  );

  if (screenMode === 'map') {
    return (
      <DispensariesMap
        dispensaries={dispensaries}
        toggleScreenMode={toggleScreenMode}
        screenTitle={screenTitle}
        type={type}
        disabled={disabled}
        onPressDispensaryItem={onPressDispensaryItem}
        isLoading={isLoading}
        onLikeSuccess={onLikeSuccess}
      />
    );
  }

  return (
    <ScreenWrapper
      withHeader
      dark
      withStatusBar
      headerProps={{
        title: screenTitle
          ? screenTitle
          : intl.formatMessage({
              id: 'screens.dispensaries.title',
              defaultMessage: 'Select dispensary',
            }),
        headerMarginBottom: vp(18),
        right: (
          <TouchableOpacity hitSlop={30} onPress={toggleScreenMode}>
            <MapIcon />
          </TouchableOpacity>
        ),
      }}>
      {isLoading ? (
        skeletonMockData.map(renderSkeleton)
      ) : (
        <FlatList
          showsVerticalScrollIndicator={false}
          data={dispensaries}
          contentContainerStyle={styles.contentContainerStyle}
          renderItem={renderDispensaries}
          keyExtractor={item => item.id.toString()}
        />
      )}
      <Toast
        message={intl.formatMessage({
          id: 'screens.dispensary.address_copied',
          defaultMessage: 'Address copied to clipboard',
        })}
        ref={toastRef}
      />
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  skeleton: {
    marginBottom: vp(14),
  },
  contentContainerStyle: {
    paddingTop: vp(18),
  },
});
