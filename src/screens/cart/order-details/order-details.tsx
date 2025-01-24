import React, {FC, useRef, useState} from 'react';
import {useIntl} from 'react-intl';
import {KeyboardAvoidingView, StyleSheet, ScrollView} from 'react-native';
import {
  AppText,
  Button,
  TextField,
  Wrapper,
  GooglePlacesInput,
  PlacesStatusState,
  FullScreenModalRef,
} from '~/components';
import {TabHeader} from './components/tab-header';
import {GLOBAL_STYLES, TextColors, TextVariant} from '~/theme';
import {useOrderDetailsForm, OrderDetailsForm} from './hooks';
import {setAdjustPan, setAdjustNothing} from 'rn-android-keyboard-adjust';
import {OrderType, useCreateOrderMutation} from '~/store/query/order';
import {UserAddress} from '~/hooks/useGetUserAddress';
import {useKeyboard} from '~/hooks/useKeyboard';
import {UserStackParamProps, UserStackRoutes} from '~/navigation';
import {useGetAuthUser} from '~/hooks/useGetAuthUser';
import {DocCenterModal} from './components/document-center';
import {isFetchBaseQueryError} from '~/store/utils';

export const OrderDetails: FC<
  UserStackParamProps<UserStackRoutes.OrderDetails>
> = ({navigation}) => {
  const modalDocsRef = useRef<FullScreenModalRef>(null);
  const intl = useIntl();
  const {authUser} = useGetAuthUser();
  const {isKeyboardOpen} = useKeyboard();
  const {form} = useOrderDetailsForm();
  const [createOrder, {isLoading, error}] = useCreateOrderMutation({
    fixedCacheKey: 'create_order',
  });
  const [isValidAddress, setIsValidAddress] = useState<
    PlacesStatusState | undefined
  >();
  const [address, setAddress] = useState<UserAddress>();
  React.useEffect(() => {
    setAdjustPan();
    return () => {
      setAdjustNothing();
    };
  }, []);

  const handleSubmit = async (values: OrderDetailsForm) => {
    if (!authUser?.passportPhotoLink) {
      modalDocsRef.current?.open();
      return;
    }
    onSubmit(values);
  };

  const onSubmit = async (values: OrderDetailsForm) => {
    if (address && address.zipCode) {
      await createOrder({
        name: values.name.trim(),
        type: OrderType.delivery,
        city: address.city,
        addressLine1: address.addressLine1,
        latitudeCoordinate: address.latitudeCoordinate,
        longitudeCoordinate: address.longitudeCoordinate,
        zipCode: address.zipCode,
      }).unwrap();
      navigation.navigate(UserStackRoutes.OrderReview);
    }
  };

  const onSaveFilesSuccess = async (values: OrderDetailsForm) => {
    onSubmit(values);
  };

  return (
    <>
      <Wrapper
        headerProps={{marginTop: 14, headerMarginBottom: 0}}
        withHeader
        horizontalPadding={24}
        withStatusBar>
        <KeyboardAvoidingView style={GLOBAL_STYLES.flex_1} behavior="padding">
          <ScrollView
            keyboardShouldPersistTaps="always"
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={[GLOBAL_STYLES.flexGrow_1]}>
            <AppText style={styles.title} variant={TextVariant.H2_B}>
              {intl.formatMessage({
                id: 'orderDetails.title',
                defaultMessage: 'Order Details',
              })}
            </AppText>
            <AppText
              style={styles.description}
              color={TextColors.B040}
              variant={TextVariant.S_R}>
              {intl.formatMessage({
                id: 'orderDetails.description',
                defaultMessage:
                  'Incorrectly entered address may delay your order.',
              })}
            </AppText>
            <TabHeader />
            <TextField
              name="name"
              control={form.control}
              label={intl.formatMessage({
                id: 'orderDetails.name',
                defaultMessage: 'Full Name',
              })}
              placeholder={intl.formatMessage({
                id: 'orderDetails.namePlaceholder',
                defaultMessage: 'Enter your name',
              })}
            />
            <GooglePlacesInput
              isValid={isValidAddress}
              setIsValid={setIsValidAddress}
              placeholder="Enter your address"
              label="Address"
              onSelectAddress={setAddress}
              error={isFetchBaseQueryError(error)?.data}
            />
            {!isKeyboardOpen && (
              <>
                <AppText style={styles.info} variant={TextVariant.S_R}>
                  {intl.formatMessage({
                    id: 'orderDetails.info',
                    defaultMessage:
                      'Our courier will ask you to show your card to verify your identity and age',
                  })}
                </AppText>
                <Button
                  isLoading={isLoading}
                  disabled={
                    !form.formState.isValid ||
                    isValidAddress === undefined ||
                    isValidAddress === PlacesStatusState.InValid
                  }
                  onPress={form.handleSubmit(handleSubmit)}
                  title={intl.formatMessage({
                    id: 'orderDetails.submit',
                    defaultMessage: 'Review order',
                  })}
                  width="100%"
                />
              </>
            )}
          </ScrollView>
        </KeyboardAvoidingView>
      </Wrapper>
      <DocCenterModal
        onSaveFilesSuccess={form.handleSubmit(onSaveFilesSuccess)}
        ref={modalDocsRef}
      />
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
  },
});
