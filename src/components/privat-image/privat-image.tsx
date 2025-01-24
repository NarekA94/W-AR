import React, {FC, useEffect, useState} from 'react';
import {Image, ImageStyle, StyleProp} from 'react-native';
import RNFS from 'react-native-fs';
import Config from '~/config/api';
import {logger} from '~/utils';
import {resolveHttpHeaders} from '~/utils/headers';

interface PrivatImageProps {
  name: string;
  style?: StyleProp<ImageStyle>;
}

export const PrivatImage: FC<PrivatImageProps> = ({name, style}) => {
  const [image, setImage] = useState<any>(undefined);
  useEffect(() => {
    async function fetchImage() {
      const uri = `${RNFS.CachesDirectoryPath}/${name}`;
      try {
        await RNFS.downloadFile({
          fromUrl: `${Config.API_URL}private/img/${name}`,
          toFile: uri,
          headers: resolveHttpHeaders(),
        }).promise;
        setImage('file://' + uri);
      } catch (error) {
        logger.warn(error);
      }
    }
    fetchImage();
  }, []);
  return <Image style={style} source={{uri: image}} />;
};
