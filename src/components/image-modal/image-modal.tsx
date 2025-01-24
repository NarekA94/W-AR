import React, {FC, useState} from 'react';
import {
  Image,
  ImageResizeMode,
  ImageStyle,
  Pressable,
  StyleProp,
  View,
  StyleSheet,
} from 'react-native';
import Modal from 'react-native-modal';
import {HEIGHT} from '~/constants/layout';
import CloseIcon from '~/assets/images/close.svg';
import {GLOBAL_STYLES, TextVariant, useTheme} from '~/theme';
import {PanGestureHandler} from 'react-native-gesture-handler';
import {AppText} from '../blocks';
import {Button} from '~/components';
import CartImage from '~/assets/images/tabs/cart-active.svg';
import {useIntl} from 'react-intl';

interface ImageModalProps {
  uri?: string;
  imageStyles: StyleProp<ImageStyle>;
  resizeMode?: ImageResizeMode | undefined;
  price?: number | string;
  onPressAdd?: () => void;
  isLoading?: boolean;
}

export const ImageModal: FC<ImageModalProps> = props => {
  const [isVisible, setIsVisible] = useState(false);
  const openModal = () => setIsVisible(true);
  const closeModal = () => setIsVisible(false);
  const intl = useIntl();
  const {theme} = useTheme();
  const handleGesture = () => {};

  return (
    <>
      <Pressable onPress={openModal}>
        <Image
          resizeMode={props.resizeMode}
          style={props.imageStyles}
          source={{uri: props.uri}}
        />
      </Pressable>
      <Modal
        onSwipeComplete={closeModal}
        swipeDirection={['down', 'up']}
        onBackButtonPress={closeModal}
        style={styles.modal}
        backdropOpacity={1}
        isVisible={isVisible}>
        <PanGestureHandler onGestureEvent={handleGesture}>
          <View style={styles.root}>
            <Pressable hitSlop={50} style={styles.close} onPress={closeModal}>
              <CloseIcon width={15} height={15} />
            </Pressable>
            <View style={GLOBAL_STYLES.flex_1_center}>
              <Image style={styles.image} source={{uri: props.uri}} />
            </View>
            <View style={styles.addButton}>
              <Button
                loaderStyle={{backgroundColor: theme.colors.gray}}
                isLoading={props.isLoading}
                onPress={props.onPressAdd}
                withImageBackground
                title={
                  <View style={GLOBAL_STYLES.row_center}>
                    <CartImage />
                    <AppText style={styles.text} variant={TextVariant.M_B}>
                      {intl.formatMessage(
                        {
                          id: 'product.add',
                          defaultMessage: 'Add to card - ${price}',
                        },
                        {price: props.price},
                      )}
                    </AppText>
                  </View>
                }
              />
            </View>
          </View>
        </PanGestureHandler>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  image: {
    width: '100%',
    height: HEIGHT * 0.7,
  },
  close: {position: 'absolute', right: 20, top: 20},
  modal: {
    margin: 0,
  },
  containerStyle: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    marginTop: 2,
    marginLeft: 8,
  },
  addButton: {
    ...GLOBAL_STYLES.center,
    position: 'absolute',
    bottom: vp(20),
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
});
