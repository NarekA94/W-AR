import React, {FC, memo, useCallback, useEffect, useRef, useState} from 'react';
import {
  StyleSheet,
  View,
  Image,
  Pressable,
  Dimensions,
  StyleProp,
  ViewStyle,
} from 'react-native';
import TrashIcon from '~/assets/images/trash-circle.svg';
import {FontWeight, TextColors, TextVariant, useTheme} from '~/theme';
import {AppText, ActionSheet, ActionSheetRefProps, Box} from '~/components';
import {FileProps, useImagePicker} from '~/hooks/useImagePicker';
import {resolveHttpHeaders} from '~/utils/headers';
import {TouchableOpacity} from 'react-native-gesture-handler';
import FastImage from 'react-native-fast-image';
import {IS_IOS} from '~/constants/layout';
import {resolvePrivateImageUrl} from '~/utils/utils';

const WebPImage = IS_IOS ? Image : FastImage;
interface PhotoPickerItemProps {
  label: string;
  onChangeImage?: (image: FileProps | null | string) => void;
  error?: Nullable<string>;
  setError?: (e: Nullable<string>) => void;
  defaultImage?: Nullable<string>;
  progress?: number;
  onDelete?: () => void;
  onLongPress?: () => void;
  containerStyle?: StyleProp<ViewStyle>;
}
interface ImageSize {
  width: number;
  height: number;
}
const windowWidth = Dimensions.get('window').width;
const PICTURE_HEIGHT = vp(420);
const PICTURE_MARGIN_HORIZONTAL = vp(20);
export const PhotoPickerItem: FC<PhotoPickerItemProps> = memo(props => {
  const {picture, deleteImage, getImageFromCamera, getImageFromLibrary} =
    useImagePicker(props.onChangeImage, props.defaultImage, props.setError);
  const {theme} = useTheme();
  const actionRef = useRef<ActionSheetRefProps>(null);
  const [imageSize, setImageSize] = useState<ImageSize>();

  const handlepRessDelete = () => {
    deleteImage();
    props.onDelete?.();
  };

  const handlePressOpenSheet = () => {
    actionRef.current?.open();
  };

  const handlePressAlbum = useCallback(() => {
    getImageFromLibrary('photo', () => actionRef.current?.close());
  }, []);

  const handlePressCamera = useCallback(() => {
    getImageFromCamera('photo', () => actionRef.current?.close());
  }, []);

  useEffect(() => {
    if (picture) {
      if (typeof picture === 'object') {
        Image.getSizeWithHeaders(
          picture.uri,
          resolveHttpHeaders(),
          (width, height) => {
            setImageSize({width, height});
          },
        );
      } else {
        Image.getSizeWithHeaders(
          resolvePrivateImageUrl(picture),
          resolveHttpHeaders(),
          (width, height) => {
            setImageSize({width, height});
          },
        );
      }
    }
  }, [picture]);
  return (
    <>
      <View style={[styles.root, props.containerStyle]}>
        <AppText
          style={styles.label}
          variant={TextVariant.H_6_W5}
          fontWeight={FontWeight.W400}
          color={TextColors.G090}>
          {props.label}
        </AppText>
        <Box height={PICTURE_HEIGHT} radius={12}>
          <Pressable
            onPress={handlePressOpenSheet}
            onLongPress={props.onLongPress}
            style={[styles.box, {borderColor: theme.colors.border.E020}]}>
            {picture ? (
              <WebPImage
                resizeMode={'contain'}
                style={[
                  styles.imageStyle,
                  imageSize &&
                    imageSize?.width > imageSize?.height &&
                    styles.landscapeImage,
                  imageSize &&
                    imageSize?.width < imageSize?.height &&
                    styles.portraitImage,
                ]}
                source={{
                  uri:
                    typeof picture === 'object'
                      ? picture.uri
                      : resolvePrivateImageUrl(picture),
                  headers: resolveHttpHeaders(),
                }}
              />
            ) : (
              <AppText variant={TextVariant.M_B} color={TextColors.A100}>
                Upload photo
              </AppText>
            )}
          </Pressable>

          {!!picture && (
            <View style={styles.stylesDeleteBox}>
              <TouchableOpacity onPress={handlepRessDelete}>
                <TrashIcon width={42} height={42} />
              </TouchableOpacity>
            </View>
          )}
        </Box>

        {!!props.error && (
          <AppText
            style={styles.error}
            variant={TextVariant.R}
            color={TextColors.error}>
            {props.error}
          </AppText>
        )}
      </View>
      <ActionSheet
        onPressAlbum={handlePressAlbum}
        onPressCamera={handlePressCamera}
        ref={actionRef}
      />
    </>
  );
});

const styles = StyleSheet.create({
  stylesDeleteBox: {
    position: 'absolute',
    top: 12,
    right: 12,
  },
  root: {
    marginBottom: vp(10),
    marginHorizontal: vp(20),
  },
  box: {
    height: PICTURE_HEIGHT,
    borderRadius: 12,
    backgroundColor: '#333333',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageStyle: {
    width: '100%',
    height: PICTURE_HEIGHT,
    resizeMode: 'contain',
    borderRadius: 12,
  },
  error: {
    marginTop: 4,
    marginLeft: 24,
  },

  label: {
    marginBottom: vp(10),
  },
  portraitImage: {
    width: windowWidth - PICTURE_MARGIN_HORIZONTAL * 2,
    height: PICTURE_HEIGHT,
  },
  landscapeImage: {
    width: PICTURE_HEIGHT,
    height: windowWidth - PICTURE_MARGIN_HORIZONTAL * 2,
    transform: [{rotate: '90deg'}],
  },
});
