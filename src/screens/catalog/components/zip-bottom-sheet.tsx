import React, {
  useRef,
  useState,
  useMemo,
  useCallback,
  forwardRef,
  useImperativeHandle,
} from 'react';
import {BackHandler, Keyboard, Pressable, StyleSheet, View} from 'react-native';
import {BottomSheetModal} from '@gorhom/bottom-sheet';
import {useFocusEffect} from '@react-navigation/native';
import {
  AppText,
  ChooseLocation,
  CustomSheetBackdrop,
  DismissKeyboardView,
} from '~/components';
import {GLOBAL_STYLES, TextColors, TextVariant} from '~/theme';
import {useIntl} from 'react-intl';
import CloseIcon from '~/assets/images/close.svg';
import {useKeyboard} from '~/hooks/useKeyboard';
import ModalHeaderIcon from '~/assets/images/zip/modal-header.svg';
import NotchIcon from '~/assets/images/zip/notch.svg';
import {IS_IOS, WIDTH} from '~/constants/layout';
export interface ZipBottomSheetRef {
  open: () => void;
  close: () => void;
}

export const ZipBottomSheet = forwardRef<ZipBottomSheetRef>((_, ref) => {
  const [isActive, setIsActive] = useState<number>(-1);
  const {isKeyboardOpen} = useKeyboard();
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(
    () => [isKeyboardOpen ? '90%' : '68.5%'],
    [isKeyboardOpen],
  );

  const intl = useIntl();
  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        if (isActive === 0) {
          bottomSheetModalRef.current?.close();
          return true;
        }
      };

      BackHandler.addEventListener('hardwareBackPress', onBackPress);

      return () =>
        BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    }, [isActive]),
  );

  const open = () => {
    bottomSheetModalRef.current?.present();
  };

  const close = () => {
    if (IS_IOS) {
      Keyboard.dismiss();
    }
    bottomSheetModalRef.current?.close();
  };

  useImperativeHandle(ref, () => ({
    open,
    close,
  }));

  return (
    <BottomSheetModal
      handleIndicatorStyle={styles.handleIndicatorStyle}
      enablePanDownToClose={true}
      // eslint-disable-next-line react/no-unstable-nested-components
      backdropComponent={props => (
        <CustomSheetBackdrop close={close} {...props} />
      )}
      ref={bottomSheetModalRef}
      index={0}
      snapPoints={snapPoints}
      backgroundStyle={styles.backgroundStyle}
      enableDismissOnClose
      onChange={setIsActive}>
      <DismissKeyboardView>
        <View style={styles.headerIcon}>
          <ModalHeaderIcon width="100%" />
          <View style={styles.notch}>
            <NotchIcon />
          </View>
        </View>
        <View style={styles.root}>
          <View style={[GLOBAL_STYLES.row_between, styles.header]}>
            <AppText
              color={TextColors.A100}
              withGradient
              variant={TextVariant.H5_M}>
              {intl.formatMessage({
                id: 'zipCode.changeZip.title',
                defaultMessage: 'Want to change zip-code?',
              })}
            </AppText>
            <Pressable hitSlop={30} onPress={close}>
              <CloseIcon />
            </Pressable>
          </View>

          <ChooseLocation type="modal" handleSelectLocation={close} />
        </View>
      </DismissKeyboardView>
    </BottomSheetModal>
  );
});

const styles = StyleSheet.create({
  backgroundStyle: {height: 0},
  root: {
    paddingHorizontal: 20,
    flex: 1,
    backgroundColor: '#252525',
  },
  header: {
    height: 24,
    marginBottom: vp(28),
    marginTop: vp(13),
  },
  handleIndicatorStyle: {
    backgroundColor: 'transparent',
  },
  headerIcon: {
    height: 30,
    overflow: 'visible',
    top: 1,
  },
  notch: {
    position: 'absolute',
    left: WIDTH / 2 - 14,
    top: -1,
  },
});
