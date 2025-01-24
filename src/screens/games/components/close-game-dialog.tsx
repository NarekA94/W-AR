import React, {
  forwardRef,
  memo,
  useState,
  useImperativeHandle,
  useCallback,
} from 'react';
import {Modal, StyleSheet, View, TouchableOpacity} from 'react-native';
import {FontWeight, GLOBAL_STYLES, TextColors} from '~/theme';
import {AppText} from '~/components';

export interface GameCustomAlertRef {
  open: () => void;
  close: () => void;
}

interface GameCustomAlertProps {
  title?: string;
  message?: string;
  rightText?: string;
  leftText?: string;
  onLeftBtnPress?: () => void;
  onRightBtnPress?: () => void;
}

export const GameCustomAlert = memo(
  forwardRef<GameCustomAlertRef, GameCustomAlertProps>((props, ref) => {
    const {onLeftBtnPress, onRightBtnPress} = props;
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
    const handleLeftButtonPress = useCallback(() => {
      onLeftBtnPress?.();
      close();
    }, [close, onLeftBtnPress]);

    const handleRightButtonPress = useCallback(() => {
      onRightBtnPress?.();
      close();
    }, [close, onRightBtnPress]);

    return (
      <Modal animationType="fade" transparent={true} visible={isVisible}>
        <View style={GLOBAL_STYLES.flex_1_center}>
          <View style={styles.root}>
            <View style={styles.body}>
              <AppText
                style={styles.title}
                size={24}
                fontWeight={FontWeight.W700}
                color={TextColors.A100}>
                {props.title}
              </AppText>
              <View style={styles.divider} />
              <AppText
                style={styles.message}
                size={16}
                fontWeight={FontWeight.W400}
                color={TextColors.A100}>
                {props.message}
              </AppText>
            </View>
            <View style={styles.footer}>
              <TouchableOpacity
                style={[styles.button, styles.leftButton]}
                onPress={handleLeftButtonPress}>
                <View>
                  <AppText
                    size={16}
                    fontWeight={FontWeight.W600}
                    color={TextColors.A100}>
                    {props.leftText}
                  </AppText>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.button, styles.rightButton]}
                onPress={handleRightButtonPress}>
                <View>
                  <AppText
                    size={16}
                    fontWeight={FontWeight.W600}
                    color={TextColors.B100}>
                    {props.rightText}
                  </AppText>
                </View>
              </TouchableOpacity>
              {/* <Button
                containerStyle={styles.button}
                onPress={handleRightButtonPress}
                title={props.rightText}
                variant={ButtonVariant.LIGHT}
                width={'50%'}
              /> */}
            </View>
          </View>
        </View>
      </Modal>
    );
  }),
);

const styles = StyleSheet.create({
  title: {
    textAlign: 'center',
    lineHeight: 31.2,
  },
  root: {
    backgroundColor: 'black',
    width: '90%',
    paddingHorizontal: 50,
    paddingVertical: 50,
    borderRadius: 24,
  },
  body: {
    alignItems: 'center',
    paddingTop: 10,
  },
  message: {
    textAlign: 'center',
    lineHeight: 24,
  },
  divider: {
    width: 42,
    height: 4,
    backgroundColor: 'white',
    marginTop: 24,
    marginBottom: 24,
  },
  footer: {
    flexDirection: 'row',
    marginTop: 45,
  },
  cancel: {
    borderColor: 'rgba(75, 100, 255, 0.1)',
    borderRightWidth: 1,
  },
  button: {
    flexGrow: 1,
    height: 58,
    justifyContent: 'center',
    alignItems: 'center',
  },
  leftButton: {
    borderWidth: 2,
    borderColor: 'white',
    borderRadius: 40,
    marginEnd: 9,
  },
  rightButton: {
    backgroundColor: 'white',
    borderRadius: 40,
  },
  rightButtonText: {
    color: '#FF3200',
  },
});
