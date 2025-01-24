import React, {FC, memo, useCallback, useEffect, useMemo} from 'react';
import {BottomSheet} from '../bottom-sheet/bottom-sheet';
import PersonIcon from '~/assets/images/profile/person.png';
import {Image, StyleSheet, View} from 'react-native';
import {GLOBAL_STYLES, TextColors, TextVariant} from '~/theme';
import {AppText, TextField, Button} from '..';
import {useIntl} from 'react-intl';
import {useFullNameForm} from './form';
import {useGetAuthUser} from '~/hooks/useGetAuthUser';
import {userModel} from '~/storage/models/user';
import moment from 'moment';
import {useKeyboard} from '~/hooks/useKeyboard';
import {isScreenSmallerThanIPhone8} from '~/constants/layout';

const APPEARANCE_INTERVAL_IN_HOURS = 24;

export const FullNameModal: FC = memo(() => {
  const {isKeyboardOpen} = useKeyboard();
  const intl = useIntl();
  const {form, handleSubmit, isLoading, bottomSheetRef} = useFullNameForm();
  const {authUser} = useGetAuthUser();

  const snapPoints = useMemo(
    () => [
      isKeyboardOpen ? '98.5%' : isScreenSmallerThanIPhone8() ? '70%' : '65%',
    ],
    [isKeyboardOpen],
  );

  useEffect(() => {
    if (
      authUser &&
      !authUser?.name &&
      authUser.phone &&
      authUser.phoneConfirmed
    ) {
      const userNameCachedDate = userModel.getUserNameCacheDate(authUser.id);
      const differenceInHours = moment().diff(userNameCachedDate, 'hours');
      const userPhoneNumberCachedDate = userModel.getPhoneVerificationCacheDate(
        authUser.id,
      );
      const differencePhoneVerifyCachedDate = moment().diff(
        userPhoneNumberCachedDate,
        'hours',
      );

      if (
        (userNameCachedDate === null ||
          differenceInHours > APPEARANCE_INTERVAL_IN_HOURS) &&
        (differencePhoneVerifyCachedDate > 0 ||
          userPhoneNumberCachedDate === null)
      ) {
        setTimeout(() => {
          bottomSheetRef.current?.open();
        }, 100);
      }
    }
  }, [authUser]);

  const onDismiss = useCallback(() => {
    if (authUser) {
      userModel.setUserNameCacheDate(authUser?.id, moment().toISOString());
    }
  }, [authUser]);

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={0}
      withCloseIcon
      disableCloseByTouchOutside
      onDismiss={onDismiss}
      snapPoints={snapPoints}>
      <>
        <View style={styles.body}>
          <View style={styles.image}>
            <Image
              style={GLOBAL_STYLES.full_height_width}
              source={PersonIcon}
            />
            <View style={styles.badge}>
              <AppText variant={TextVariant.P_M} size={11}>
                {intl.formatMessage({
                  id: 'orderDetails.name',
                  defaultMessage: 'Full name',
                })}
              </AppText>
              <View style={styles.cursor} />
            </View>
          </View>
          <AppText style={styles.title} variant={TextVariant['24_5A']}>
            {intl.formatMessage({
              id: 'full_name_modal.title',
              defaultMessage: 'Hey there!',
            })}
          </AppText>
          <AppText
            style={GLOBAL_STYLES.text_center}
            variant={TextVariant.S_R}
            color={TextColors.G090}>
            {intl.formatMessage({
              id: 'full_name_modal.info',
              defaultMessage:
                "Mind sharing your name? It'll help us personalize your experience even more!",
            })}
          </AppText>
        </View>
        <TextField
          style={styles.button}
          name="name"
          control={form.control}
          placeholder={intl.formatMessage({
            id: 'orderDetails.name',
            defaultMessage: 'Full name',
          })}
          withTrim
          needFormValidation={false}
          autoCompleteType="name"
        />
        <Button
          disabled={!form.formState.isValid}
          onPress={handleSubmit}
          isLoading={isLoading}
          withImageBackground
          title={intl.formatMessage({
            id: 'buttons.submit',
            defaultMessage: 'Submit',
          })}
        />
      </>
    </BottomSheet>
  );
});

const styles = StyleSheet.create({
  image: {
    width: vp(103),
    height: vp(103),
    marginTop: -vp(30),
  },
  body: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    marginBottom: vp(10),
    marginTop: vp(25),
  },
  button: {marginTop: vp(40), marginBottom: vp(35)},
  badge: {
    width: vp(85),
    height: vp(27),
    backgroundColor: 'black',
    borderRadius: 5,
    position: 'absolute',
    bottom: -15,
    right: -35,
    paddingLeft: vp(5),
    alignItems: 'center',
    flexDirection: 'row',
  },
  cursor: {
    width: 2,
    backgroundColor: '#FF4CD8',
    height: vp(15),
    marginLeft: 1,
  },
});
