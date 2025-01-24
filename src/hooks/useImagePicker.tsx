import {useCallback, useEffect, useMemo, useState} from 'react';
import {PermissionsAndroid, Platform} from 'react-native';
import {
  CameraOptions,
  ImagePickerResponse,
  launchCamera,
  launchImageLibrary,
  MediaType,
} from 'react-native-image-picker';
import {PERMISSIONS, request} from 'react-native-permissions';

import {logger} from '~/utils/logger';

export function pickName(uri: string): string {
  const uriSplit = uri.split('/');
  const name = uriSplit[uriSplit.length - 1];
  return name;
}

export interface FileProps {
  uri: string;
  name: string;
  type: string;
}

interface UseImagePicker {
  getImageFromLibrary: (mediaType?: MediaType, cb?: () => void) => void;
  getImageFromCamera: (mediaType?: MediaType, cb?: () => void) => void;
  deleteImage: () => void;
  picture: FileProps | null | string;
}

export const useImagePicker = (
  onChangeImage?: (image: FileProps | null | string) => void,
  defaultImage?: Nullable<string>,
  setError?: (text: Nullable<string>) => void,
): UseImagePicker => {
  const [picture, setPicture] = useState<FileProps | null | string>(null);

  useEffect(() => {
    if (typeof defaultImage === 'string') {
      setPicture(defaultImage);
      onChangeImage?.(defaultImage);
    }
  }, [defaultImage, onChangeImage]);

  const saveImage = (image: ImagePickerResponse): void => {
    if (image.assets && image.assets[0].uri) {
      const {uri, type} = image.assets[0];
      const name = pickName(uri);
      const img = {
        name,
        uri,
        type: type || 'photo',
      };
      setPicture(img);
      onChangeImage?.(img);
      setError?.(null);
    }
  };

  const getImageFromCamera = useCallback(
    async (mediaType: MediaType = 'photo', cb?: () => void) => {
      try {
        const options: CameraOptions = {
          mediaType: mediaType,
          presentationStyle: 'overFullScreen',
        };
        let imageRes;
        if (Platform.OS === 'android') {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.CAMERA,
          );
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            imageRes = await launchCamera(options);
          }
        } else {
          const permisionRes = await request(PERMISSIONS.IOS.CAMERA);
          if (permisionRes !== 'blocked' && permisionRes !== 'denied') {
            imageRes = await launchCamera(options);
          }
        }
        if (imageRes) {
          cb?.();
          saveImage(imageRes);
        }
      } catch (error) {
        logger.warn(error);
      }
    },
    [],
  );

  const getImageFromLibrary = useCallback(
    async (mediaType: MediaType = 'photo', cb?: () => void) => {
      try {
        const options: CameraOptions = {
          mediaType,
        };
        let imageRes;
        if (Platform.OS === 'android') {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.CAMERA,
          );
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            imageRes = await launchImageLibrary(options);
          }
        } else {
          imageRes = await launchImageLibrary(options);
        }
        if (imageRes) {
          cb?.();
          saveImage(imageRes);
        }
      } catch (error) {
        logger.warn(error);
      }
    },
    [],
  );

  const deleteImage = useCallback(() => {
    setPicture(null);
    onChangeImage?.(null);
  }, []);

  return useMemo(
    () => ({
      getImageFromLibrary,
      getImageFromCamera,
      deleteImage,
      picture,
    }),
    [getImageFromLibrary, getImageFromCamera, deleteImage, picture],
  );
};
