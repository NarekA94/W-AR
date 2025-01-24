import React, {Context, FC, memo, useCallback, useMemo, useRef} from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {AppText, BottomSheet, BottomSheetRef} from '~/components';
import {useGetSelectedBrandTab} from '~/context/brand/hooks';
import {GLOBAL_STYLES, TextColors, TextVariant} from '~/theme';
import InfoIcon from '~/assets/images/info-circle.svg';
import {useGetAuthUser} from '~/hooks/useGetAuthUser';
import {TabInfo} from './tab-info-sheet';
import {BrandContext, IBrandContext} from '~/context/brand';
import {useIntl} from 'react-intl';

interface ShortInfoProps {
  zipModalOpenHandler: () => void;
  context?: Context<IBrandContext>;
}
const SNAP_POINT = ['64%'];

export const ShortInfo: FC<ShortInfoProps> = memo(
  ({zipModalOpenHandler, context}) => {
    const intl = useIntl();

    const {selectedTab} = useGetSelectedBrandTab(context || BrandContext);
    const {authUser} = useGetAuthUser();

    const bottomSheetModalRef = useRef<BottomSheetRef>(null);

    const zipInfo = useMemo(() => {
      if (authUser?.catalogZipCode) {
        return intl.formatMessage(
          {
            id: 'screens.brand.components.short_info.your_zip_template',
            defaultMessage: 'Your zip: ',
          },
          {
            zipCode: authUser.catalogZipCode,
          },
        );
      }
      return intl.formatMessage({
        id: 'screens.brand.components.short_info.your_zip',
        defaultMessage: 'Your zip...',
      });
    }, [authUser, intl]);

    const handleCloseSheet = useCallback(() => {
      bottomSheetModalRef.current?.close();
    }, []);

    const handlePressShortDescription = useCallback(() => {
      bottomSheetModalRef.current?.open();
    }, []);

    return (
      <>
        <View style={styles.root}>
          <View>
            <AppText
              variant={TextVariant.S_R}
              color={TextColors.G090}
              onPress={zipModalOpenHandler}>
              {selectedTab?.needZipCode
                ? zipInfo
                : selectedTab?.shortDescription}
            </AppText>
            {selectedTab?.needZipCode && <View style={styles.needZip} />}
          </View>
          <TouchableOpacity hitSlop={20} onPress={handlePressShortDescription}>
            <InfoIcon />
          </TouchableOpacity>
        </View>
        <BottomSheet ref={bottomSheetModalRef} snapPoints={SNAP_POINT}>
          <TabInfo
            close={handleCloseSheet}
            title={selectedTab?.name}
            description={selectedTab?.description}
          />
        </BottomSheet>
      </>
    );
  },
);

const styles = StyleSheet.create({
  root: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: vp(17),
    ...GLOBAL_STYLES.horizontal_20,
  },
  needZip: {
    height: 1,
    backgroundColor: '#BBBBBB',
  },
});
