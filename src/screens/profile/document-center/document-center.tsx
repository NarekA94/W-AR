import React, {FC, useCallback, useRef} from 'react';
import {useIntl} from 'react-intl';
import {StyleSheet} from 'react-native';
import {DocumentCenter, ScreenWrapper, Toast, ToastRef} from '~/components';

export const ProfileDocumentCenterScreen: FC = () => {
  const intl = useIntl();
  const toastRef = useRef<ToastRef>(null);
  const onSaveFilesSuccess = useCallback(() => {
    toastRef.current?.open();
  }, [toastRef]);
  return (
    <>
      <ScreenWrapper
        withTopInsets
        withHeader
        horizontalPadding={0}
        headerProps={styles.root}>
        <DocumentCenter
          onSaveFilesSuccess={onSaveFilesSuccess}
          withHeader={false}
        />
      </ScreenWrapper>
      <Toast
        message={intl.formatMessage({
          id: 'documentCenter.toast.text',
          defaultMessage: 'Your updates have been saved successfully.',
        })}
        alignTop={true}
        ref={toastRef}
      />
    </>
  );
};
const styles = StyleSheet.create({
  root: {
    paddingHorizontal: 20,
  },
});
