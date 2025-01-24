import React, {forwardRef, useImperativeHandle, useRef} from 'react';
import {
  DocumentCenter,
  FullScreenModal,
  FullScreenModalRef,
} from '~/components';

interface DocCenterModalProps {
  onSaveFilesSuccess?: () => void;
}

export const DocCenterModal = forwardRef<
  FullScreenModalRef,
  DocCenterModalProps
>((props, ref) => {
  const modalRef = useRef<FullScreenModalRef>(null);

  const open = () => {
    modalRef.current?.open();
  };

  const close = () => {
    modalRef.current?.close();
  };
  useImperativeHandle(ref, () => ({
    open,
    close,
  }));
  const onSaveFilesSuccess = () => {
    close();
    props.onSaveFilesSuccess?.();
  };
  return (
    <FullScreenModal ref={modalRef}>
      <DocumentCenter
        onPressClose={close}
        onSaveFilesSuccess={onSaveFilesSuccess}
      />
    </FullScreenModal>
  );
});
