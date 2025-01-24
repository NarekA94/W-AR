import React, {forwardRef, useEffect, useImperativeHandle} from 'react';
import {StyleSheet, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {TextVariant} from '~/theme';
import {AppText} from '..';
import DoneIcon from '~/assets/images/done.svg';
interface ToastProps {
  message: string;
  alignTop?: boolean;
}

export interface ToastRef {
  open: () => void;
  close: () => void;
}

export const Toast = forwardRef<ToastRef, ToastProps>((props, ref) => {
  const {bottom, top} = useSafeAreaInsets();
  const [visible, setVisible] = React.useState(false);

  useEffect(() => {
    if (visible) {
      setTimeout(() => {
        setVisible(false);
      }, 3000);
    }
  }, [visible]);

  const open = () => {
    setVisible(true);
  };

  const close = () => {
    setVisible(false);
  };

  useImperativeHandle(ref, () => ({
    open,
    close,
  }));

  if (!visible) {
    return null;
  }

  return (
    <View
      style={[
        styles.container,
        !props.alignTop
          ? {paddingVertical: bottom}
          : [{paddingVertical: top}, styles.containerTop],
      ]}>
      <View style={styles.body}>
        <DoneIcon style={styles.done} />
        <AppText variant={TextVariant.P_M}>{props.message}</AppText>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 10,
    height: vp(44),
  },
  containerTop: {
    top: 26,
    bottom: 0,
  },
  body: {
    width: '90%',
    height: vp(44),
    borderRadius: 8,
    backgroundColor: '#333333',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: vp(12),
  },
  done: {
    marginRight: vp(11),
  },
});
