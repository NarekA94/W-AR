import React, {
  forwardRef,
  memo,
  useState,
  useImperativeHandle,
  useCallback,
} from 'react';
import {Modal, StyleSheet, TouchableOpacity, View} from 'react-native';
import {GLOBAL_STYLES, TextColors, TextVariant} from '~/theme';
import {AppText} from '..';

export interface CustomAlertRef {
  open: () => void;
  close: () => void;
}

interface CustomAlertProps {
  title?: string;
  message?: string;
  onPress?: () => void;
  rightText?: string;
  leftText?: string;
}

export const CustomAlert = memo(
  forwardRef<CustomAlertRef, CustomAlertProps>((props, ref) => {
    const {onPress} = props;
    const [isVisible, setIsVisible] = useState<boolean>(false);

    const open = useCallback(() => {
      setIsVisible(true);
    }, []);

    const close = useCallback(() => {
      setIsVisible(false);
    }, []);

    useImperativeHandle(ref, () => ({
      open,
      close,
    }));

    const handlePressGoToSite = useCallback(() => {
      onPress?.();
      close();
    }, [close, onPress]);

    return (
      <Modal animationType="fade" transparent={true} visible={isVisible}>
        <View style={GLOBAL_STYLES.flex_1_center}>
          <View style={styles.root}>
            <View style={styles.body}>
              <AppText variant={TextVariant.M_B}> {props.title}</AppText>
              <AppText
                style={styles.message}
                variant={TextVariant.B}
                color={TextColors.B100}>
                {props.message}
              </AppText>
            </View>
            <View style={styles.footer}>
              <TouchableOpacity
                onPress={close}
                style={[styles.button, styles.cancel]}>
                <AppText variant={TextVariant.M_R}>
                  {props.leftText || 'Cancel'}
                </AppText>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handlePressGoToSite}
                style={styles.button}>
                <AppText
                  style={styles.rightButtonText}
                  variant={TextVariant.M_B}>
                  {props.rightText}
                </AppText>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    );
  }),
);

const styles = StyleSheet.create({
  root: {
    backgroundColor: '#FFFFFF',
    width: '73%',
    borderRadius: 16,
  },
  body: {
    padding: 16,
    alignItems: 'center',
  },
  message: {
    marginTop: vp(5),
    textAlign: 'center',
    lineHeight: 15,
  },
  footer: {
    borderTopWidth: 1,
    flexDirection: 'row',
    borderColor: 'rgba(75, 100, 255, 0.1)',
  },
  cancel: {
    borderColor: 'rgba(75, 100, 255, 0.1)',
    borderRightWidth: 1,
  },
  button: {
    width: '50%',
    height: vp(45),
    justifyContent: 'center',
    alignItems: 'center',
  },
  rightButtonText: {
    color: '#FF3200',
  },
});
