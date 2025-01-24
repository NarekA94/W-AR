import React, {FC, useCallback, useMemo, useRef, useState} from 'react';
import {useIntl} from 'react-intl';
import {
  NativeSyntheticEvent,
  ScrollView,
  StyleSheet,
  TextInputEndEditingEventData,
  TouchableOpacity,
  View,
} from 'react-native';
import {AppText, Button, PhotoPickerItem, ScreenWrapper} from '~/components';
import {PrivacyUrl, TermsUrl} from '~/config/privacy';
import {useGetAuthUser} from '~/hooks/useGetAuthUser';
import {FileProps} from '~/hooks/useImagePicker';
import {useDeleteDocumentsMutation, userApi} from '~/store/query/user/userApi';
import {FontWeight, GLOBAL_STYLES, TextColors, TextVariant} from '~/theme';
import {UploadFileItem} from 'react-native-fs';
import {useUploadPhotos} from '~/hooks/useUploadPhotos';
import CloseIcon from '~/assets/images/close-light.svg';
import {Input} from './input';
import {useUpdateUserMutation} from '~/store/query/user/userApi';
import {useNavigation} from '@react-navigation/native';
import {UserScreenNavigationProp, UserStackRoutes} from '~/navigation';
import {logger} from '~/utils';
import {
  PhotoPreviewModal,
  PreviewModalRef,
} from '../photo-preview-modal/photo-preview-modal';
import Config from 'react-native-config';
interface DocumentCenterProps {
  onPressClose?: () => void;
  onSaveFilesSuccess?: () => void;
  withHeader?: boolean;
}
const titleGradientLocations = [0, 0.4, 0.8];

export const DocumentCenter: FC<DocumentCenterProps> = ({
  withHeader = true,
  ...props
}) => {
  const intl = useIntl();
  const navigation = useNavigation<UserScreenNavigationProp>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [previewImage, setPreviewImage] = useState<string>();

  const {uploadPhotos} = useUploadPhotos();
  const [updateUser] = useUpdateUserMutation();
  const prefetchUser = userApi.usePrefetch('getCurrentUser');
  const [deleteDocs] = useDeleteDocumentsMutation();
  const {authUser} = useGetAuthUser();
  const [IdPhoto, setIdPhoto] = useState<FileProps | null | string>(null);
  const [physicianPhoto, setPhysicianPhoto] = useState<
    FileProps | null | string
  >(null);
  const [fullName, setFullName] = useState<string | undefined>(authUser?.name);
  const [fullNameError, setFullNameError] = useState<boolean>(false);
  const [error, setError] = useState<Nullable<string>>();
  const previewModalRef = useRef<PreviewModalRef>(null);

  const handlePressSave = useCallback(async () => {
    try {
      if (!IdPhoto) {
        setError('ID cannot be blank');
        return;
      }
      if (!fullName) {
        setFullNameError(true);
        return;
      }
      setError(null);
      setFullNameError(false);
      if (authUser?.id) {
        const files: UploadFileItem[] = [];

        if (typeof IdPhoto === 'object') {
          files.push({
            name: 'passportPhoto',
            filename: IdPhoto.name,
            filepath: IdPhoto.uri.replace('file://', ''),
            filetype: IdPhoto.type,
          });
        }
        if (physicianPhoto && typeof physicianPhoto === 'object') {
          files.push({
            name: 'physicianRecPhoto',
            filename: physicianPhoto.name,
            filepath: physicianPhoto.uri.replace('file://', ''),
            filetype: physicianPhoto.type,
          });
        }
        setIsLoading(true);
        await updateUser({
          name: fullName.replace(/\s+/g, ' ').trim(),
          id: authUser.id,
        }).unwrap();
        if (files.length > 0) {
          await uploadPhotos(files, authUser.id);
        }
        prefetchUser(undefined, {force: true});
        props.onSaveFilesSuccess?.();
      }
    } catch (err) {
      logger.warn(err);
    } finally {
      setIsLoading(false);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    IdPhoto,
    physicianPhoto,
    authUser?.id,
    prefetchUser,
    uploadPhotos,
    fullName,
    fullNameError,
  ]);

  const handlePressTerms = () => {
    navigation.navigate(UserStackRoutes.WebViewScreen, {uri: TermsUrl});
  };

  const handlePressPrivacy = () => {
    navigation.navigate(UserStackRoutes.WebViewScreen, {uri: PrivacyUrl});
  };
  const handlePressDeleteIdPhoto = useCallback(() => {
    if (authUser?.passportPhotoLink && typeof IdPhoto === 'string') {
      deleteDocs({
        id: authUser.id,
        data: {
          passportPhotoLink: true,
          physicianRecPhotoLink: false,
        },
      });
    }
  }, [authUser, IdPhoto, deleteDocs]);

  const handlePressDeletePhysicianPhoto = useCallback(() => {
    if (authUser?.physicianRecPhotoLink && typeof physicianPhoto === 'string') {
      deleteDocs({
        id: authUser.id,
        data: {
          passportPhotoLink: false,
          physicianRecPhotoLink: true,
        },
      });
    }
  }, [authUser, physicianPhoto, deleteDocs]);
  const onChangeFullName = useCallback((text: string) => {
    setFullName(text);
    setFullNameError(false);
  }, []);

  const onBlurFullNameInput = useCallback(
    (e: NativeSyntheticEvent<TextInputEndEditingEventData>) => {
      setFullName(e.nativeEvent.text.replace(/\s+/g, ' ').trim());
    },
    [],
  );

  const handlePressClose = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const isButtonDisabled = useMemo(() => {
    return (
      (IdPhoto === null || typeof IdPhoto === 'string') &&
      fullName === authUser?.name &&
      (physicianPhoto === null || typeof physicianPhoto === 'string')
    );
  }, [IdPhoto, authUser?.name, fullName, physicianPhoto]);
  const handlePreviewAction = useCallback(
    (path?: Nullable<string> | Nullable<FileProps>) => {
      if (path) {
        if (typeof path === 'object') {
          setPreviewImage(path.uri);
        } else {
          setPreviewImage(`${Config.API_URL}private/img/${path}`);
        }
        previewModalRef.current?.open();
      }
    },
    [],
  );
  return (
    <>
      <ScreenWrapper
        withTopInsets={withHeader}
        withBottomInset={!withHeader}
        withStatusBar
        dark
        horizontalPadding={0}>
        {withHeader && (
          <View style={styles.header}>
            <TouchableOpacity onPress={handlePressClose} hitSlop={25}>
              <CloseIcon />
            </TouchableOpacity>
          </View>
        )}
        <ScrollView contentContainerStyle={GLOBAL_STYLES.flexGrow_1}>
          <View style={[GLOBAL_STYLES.horizontal_20]}>
            <AppText
              style={styles.title}
              variant={TextVariant.H3_A}
              locations={titleGradientLocations}
              fontWeight={FontWeight.W600}>
              {intl.formatMessage({
                id: 'documentCenter.title',
                defaultMessage: 'Document center',
              })}
            </AppText>
            <AppText
              style={styles.description}
              color={TextColors.gray}
              variant={TextVariant.S_R}>
              {intl.formatMessage({
                id: 'documentCenter.description',
                defaultMessage:
                  'Please provide photo of your ID. Upload your medical recommendation if you are under 21.',
              })}
            </AppText>
          </View>
          <Input
            value={fullName}
            onEndEditing={onBlurFullNameInput}
            setValue={onChangeFullName}
            error={fullNameError}
            placeholder="Full name"
            autoCapitalize="words"
          />
          <PhotoPickerItem
            defaultImage={authUser?.passportPhotoLink}
            error={error}
            onChangeImage={setIdPhoto}
            label="ID Verification"
            onDelete={handlePressDeleteIdPhoto}
            setError={setError}
            onLongPress={() =>
              handlePreviewAction(
                typeof IdPhoto === 'object'
                  ? IdPhoto
                  : authUser?.passportPhotoLink,
              )
            }
          />
          <PhotoPickerItem
            defaultImage={authUser?.physicianRecPhotoLink}
            onChangeImage={setPhysicianPhoto}
            label="Physician’s recommendation (optional)"
            onDelete={handlePressDeletePhysicianPhoto}
            containerStyle={styles.secondDoc}
            onLongPress={() =>
              handlePreviewAction(
                typeof physicianPhoto === 'object'
                  ? physicianPhoto
                  : authUser?.physicianRecPhotoLink,
              )
            }
          />

          <View style={GLOBAL_STYLES.flex_1} />
          <AppText
            style={styles.info}
            color={TextColors.gray}
            variant={TextVariant.P_M}>
            <AppText
              style={styles.fontSize_13}
              onPress={handlePressTerms}
              variant={TextVariant.P_M}>
              Terms & Conditions{' '}
            </AppText>
            and{' '}
            <AppText
              style={styles.fontSize_13}
              onPress={handlePressPrivacy}
              variant={TextVariant.P_M}>
              Privacy Policy
            </AppText>{' '}
            of the Service
          </AppText>
          <View style={styles.button}>
            <Button
              withImageBackground
              onPress={handlePressSave}
              isLoading={isLoading}
              disabled={isButtonDisabled}
              title="Save"
            />
          </View>
        </ScrollView>
      </ScreenWrapper>
      <PhotoPreviewModal ref={previewModalRef} imagePath={previewImage} />
    </>
  );
};

const styles = StyleSheet.create({
  title: {
    marginBottom: vp(10),
    marginTop: 4,
  },
  description: {
    lineHeight: 20,
  },
  info: {
    textAlign: 'center',
    marginBottom: vp(22),
    marginTop: vp(22),
    paddingHorizontal: 10,
    fontSize: 13,
  },
  fontSize_13: {
    fontSize: 13,
  },
  header: {
    ...GLOBAL_STYLES.horizontal_20,
    alignItems: 'flex-end',
    marginBottom: vp(10),
  },
  button: {
    ...GLOBAL_STYLES.margin_24,
    marginBottom: vp(24),
  },
  secondDoc: {
    marginTop: vp(20),
  },
});
