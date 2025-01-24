import {useCallback, useMemo, useState} from 'react';
import RNFS, {UploadFileItem} from 'react-native-fs';
import {logger} from '~/utils';
import Config from '~/config/api';
import {resolveHttpHeaders} from '~/utils/headers';

export const useUploadPhotos = () => {
  const [isLoading, setisLoading] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);

  const uploadPhotos = useCallback(
    async (files: UploadFileItem[], userId: number) => {
      try {
        const formUri = `${Config.API_URL}user/${userId}/verifyPassport`;
        setisLoading(true);
        await RNFS.uploadFiles({
          method: 'PUT',
          toUrl: formUri,
          files: files,
          headers: resolveHttpHeaders(),
          progress: response => {
            const percentage = Math.floor(
              (response.totalBytesSent / response.totalBytesExpectedToSend) *
                100 +
                1,
            );
            setProgress(percentage);
          },
        }).promise;

        setProgress(0);

        setisLoading(false);
      } catch (error) {
        setProgress(0);
        setisLoading(false);
        logger.warn(error);
      }
    },
    [],
  );
  return useMemo(
    () => ({
      uploadPhotos,
      isLoading,
      progress,
    }),
    [uploadPhotos, isLoading, progress],
  );
};
