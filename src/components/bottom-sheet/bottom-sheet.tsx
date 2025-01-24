import React, {
  useRef,
  useState,
  useCallback,
  forwardRef,
  useImperativeHandle,
} from 'react';
import {BackHandler, Keyboard, Pressable, StyleSheet, View} from 'react-native';
import {BottomSheetModal, BottomSheetModalProps} from '@gorhom/bottom-sheet';
import {useFocusEffect} from '@react-navigation/native';
import {AppText, CustomSheetBackdrop, DismissKeyboardView} from '~/components';
import {GLOBAL_STYLES, TextVariant, useTheme} from '~/theme';
import CloseIcon from '~/assets/images/close.svg';
import ModalHeaderIcon from '~/assets/images/zip/modal-header.svg';
import NotchIcon from '~/assets/images/zip/notch.svg';
import {IS_IOS, WIDTH} from '~/constants/layout';

export interface BottomSheetRef {
  open: () => void;
  close: () => void;
}

interface BottomSheetProps extends BottomSheetModalProps {
  withCloseIcon?: boolean;
  title?: string;
  disableCloseByTouchOutside?: boolean;
}

const headerSvgOriginalHeight = 532;
const headerSvgOriginalWidth = 375;

export const BottomSheet = forwardRef<BottomSheetRef, BottomSheetProps>(
  (props, ref) => {
    const [isActive, setIsActive] = useState<number>(-1);
    const bottomSheetModalRef = useRef<BottomSheetModal>(null);
    const {theme} = useTheme();

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
        backdropComponent={p => (
          <CustomSheetBackdrop
            close={!props.disableCloseByTouchOutside ? close : undefined}
            {...p}
          />
        )}
        ref={bottomSheetModalRef}
        index={0}
        backgroundStyle={styles.backgroundStyle}
        enableDismissOnClose
        onChange={setIsActive}
        {...props}>
        <DismissKeyboardView>
          <View style={styles.headerIcon}>
            <View style={styles.headerSvg}>
              <ModalHeaderIcon />
            </View>
            <View style={styles.notch}>
              <NotchIcon />
            </View>
          </View>
          <View style={styles.root}>
            <>
              <View
                style={[
                  GLOBAL_STYLES.row_between,
                  styles.header,
                  props.withCloseIcon && styles.withCloseIcon,
                ]}>
                {props.withCloseIcon && (
                  <>
                    <View>
                      {props.title && (
                        <AppText variant={TextVariant.H5_M}>
                          {props.title}
                        </AppText>
                      )}
                    </View>
                    <Pressable hitSlop={30} onPress={close}>
                      <CloseIcon color={theme.colors.textColors.A100} />
                    </Pressable>
                  </>
                )}
              </View>
              {props?.children}
            </>
          </View>
        </DismissKeyboardView>
      </BottomSheetModal>
    );
  },
);

const styles = StyleSheet.create({
  backgroundStyle: {height: 0},
  root: {
    paddingHorizontal: 20,
    flex: 1,
    backgroundColor: '#252525',
  },
  header: {
    height: 24,
    marginTop: vp(10),
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
  withCloseIcon: {
    marginBottom: vp(28),
  },
  headerSvg: {
    width: '100%',
    aspectRatio: headerSvgOriginalWidth / headerSvgOriginalHeight,
  },
});
