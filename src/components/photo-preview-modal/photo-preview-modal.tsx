import React, {
  forwardRef,
  memo,
  useState,
  useImperativeHandle,
  useCallback,
  useEffect,
} from 'react';
import {
  Modal,
  StyleSheet,
  View,
  Image,
  Dimensions,
  Pressable,
} from 'react-native';

import {GLOBAL_STYLES} from '~/theme';
import {resolveHttpHeaders} from '~/utils/headers';

export interface PreviewModalRef {
  open: () => void;
  close: () => void;
}

interface PreviewModalProps {
  imagePath?: string;
}
interface ImageSize {
  width: number;
  height: number;
}

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export const PhotoPreviewModal = memo(
  forwardRef<PreviewModalRef, PreviewModalProps>((props, ref) => {
    const [isVisible, setIsVisible] = useState<boolean>(false);
    const [imageSize, setImageSize] = useState<ImageSize>();
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
    useEffect(() => {
      if (props.imagePath) {
        Image.getSizeWithHeaders(
          props.imagePath,
          resolveHttpHeaders(),
          (width, height) => {
            setImageSize({width, height});
          },
        );
      }
    }, [props.imagePath]);
    const onPress = useCallback(() => {
      close();
    }, [close]);
    return (
      <Modal animationType="fade" transparent={true} visible={isVisible}>
        <View style={GLOBAL_STYLES.flex_1_center}>
          <Pressable onPress={onPress}>
            <View style={styles.root}>
              <Image
                resizeMode={'contain'}
                style={[
                  styles.img,
                  imageSize &&
                    imageSize?.width > imageSize?.height &&
                    styles.landscapeImage,
                  imageSize &&
                    imageSize?.width < imageSize?.height &&
                    styles.portraitImage,
                ]}
                source={{
                  uri: props.imagePath,
                  headers: resolveHttpHeaders(),
                }}
              />
            </View>
          </Pressable>
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
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 24,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  img: {
    resizeMode: 'contain',
  },
  cancel: {
    borderColor: 'rgba(75, 100, 255, 0.1)',
    borderRightWidth: 1,
  },
  portraitImage: {
    width: windowWidth - 20,
    height: windowHeight - 200,
  },
  landscapeImage: {
    width: windowHeight - 200,
    height: windowWidth - 20,
    transform: [{rotate: '90deg'}],
  },
});
