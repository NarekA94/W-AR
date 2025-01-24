import React, {useImperativeHandle, forwardRef, memo, useState} from 'react';
import {View, StyleSheet, Pressable} from 'react-native';
import {SheetItem} from './sheet-item';
import {useTheme} from '~/theme';
import Modal from 'react-native-modal';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

export interface ActionSheetRefProps {
  open: () => void;
  close: () => void;
}
interface ActionSheetProps {
  onPressAlbum?: () => void;
  onPressCamera?: () => void;
}

export const ActionSheet = memo(
  forwardRef<ActionSheetRefProps, ActionSheetProps>(
    ({onPressAlbum, onPressCamera}, ref) => {
      const {bottom} = useSafeAreaInsets();
      const {theme} = useTheme();
      const [isVisible, setIsVisible] = useState(false);
      const open = () => setIsVisible(true);
      const close = () => setIsVisible(false);

      useImperativeHandle(ref, () => ({open, close}));

      return (
        <Modal
          onSwipeComplete={close}
          swipeDirection={['down']}
          onBackButtonPress={close}
          style={styles.modal}
          backdropOpacity={0.2}
          isVisible={isVisible}>
          <Pressable onPress={close} style={styles.root}>
            <View
              style={[
                styles.camera,
                {marginBottom: bottom},
                {backgroundColor: theme.colors.background.sheet},
              ]}>
              <SheetItem title="Album" onPress={onPressAlbum} radius={25} />
              <SheetItem onPress={onPressCamera} title="Camera" />
              <SheetItem onPress={close} title="Cancel" cancel radius={25} />
            </View>
          </Pressable>
        </Modal>
      );
    },
  ),
);

const styles = StyleSheet.create({
  backgroundStyle: {height: 0},
  root: {
    paddingHorizontal: 16,
    flex: 1,
    backgroundColor: 'trensparent',
    justifyContent: 'flex-end',
    zIndex: 9,
  },
  camera: {
    borderRadius: 25,
    paddingVertical: 12,
  },
  handleIndicatorStyle: {
    backgroundColor: 'transparent',
  },
  modal: {margin: 0},
});
