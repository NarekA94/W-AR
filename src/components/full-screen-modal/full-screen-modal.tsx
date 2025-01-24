import React, {forwardRef, useState, useImperativeHandle} from 'react';
import {Modal, ModalProps} from 'react-native';

export interface FullScreenModalRef {
  open: () => void;
  close: () => void;
}

interface FullScreenModalProps extends ModalProps {
  children?: React.ReactNode;
}

export const FullScreenModal = forwardRef<
  FullScreenModalRef,
  FullScreenModalProps
>(({children, ...props}, ref) => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const open = () => {
    setIsModalVisible(true);
  };

  const close = () => {
    setIsModalVisible(false);
  };

  useImperativeHandle(ref, () => ({
    open,
    close,
  }));
  return (
    <Modal
      animationType="slide"
      transparent={false}
      presentationStyle="fullScreen"
      onRequestClose={close}
      visible={isModalVisible}
      {...props}>
      {children}
    </Modal>
  );
});
