import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {FirstScreen} from './first-screen';
import {SecondScreen} from './second-screen';
import {useGetAuthUser} from '~/hooks/useGetAuthUser';
import {BottomSheet, BottomSheetRef} from '../bottom-sheet/bottom-sheet';
import {isScreenSmallerThenS9} from '~/constants/layout';
import {userModel} from '~/storage/models/user';
import moment from 'moment';

const APPEARANCE_INTERVAL_IN_HOURS = 24;

export interface CurrentPhoneNumberAndId {
  number: string;
  id: string;
}

const PhoneVerificationModal = () => {
  const {authUser} = useGetAuthUser();

  const [isFocusOnInput, setIsoFocusOnInput] = useState<boolean>(false);
  const [currentPhoneNumberAndId, setCurrentPhoneNumberAndId] =
    useState<CurrentPhoneNumberAndId | null>(null);

  const bottomSheetRef = useRef<BottomSheetRef>(null);

  const snapPoints = useMemo(
    () => [isFocusOnInput ? '98.5%' : isScreenSmallerThenS9 ? '76%' : '70%'],
    [isFocusOnInput],
  );

  useEffect(() => {
    if (authUser && authUser.phone && !authUser.phoneConfirmed) {
      const userPhoneVerificationCachedDate =
        userModel.getPhoneVerificationCacheDate(authUser.id);
      const differenceInHours = moment().diff(
        userPhoneVerificationCachedDate,
        'hours',
      );

      if (
        userPhoneVerificationCachedDate === null ||
        differenceInHours > APPEARANCE_INTERVAL_IN_HOURS
      ) {
        setTimeout(() => {
          bottomSheetRef.current?.open();
        }, 100);
      }
    }
  }, [authUser]);

  const firstStepCompletedHandler = useCallback(
    (phoneNumber: string, verificationId: string) => {
      setCurrentPhoneNumberAndId({number: phoneNumber, id: verificationId});
      bottomSheetRef.current?.open();
    },
    [],
  );

  const secondStepCompletedHandler = useCallback(() => {
    if (authUser?.id) {
      userModel.setPhoneVerificationCacheDate(
        authUser.id,
        moment().toISOString(),
      );
    }
    bottomSheetRef.current?.close();
  }, [authUser]);

  const onDismiss = useCallback(() => {
    if (authUser?.id) {
      userModel.setPhoneVerificationCacheDate(
        authUser.id,
        moment().toISOString(),
      );
    }
  }, [authUser]);

  const inputFocusHandler = useCallback(() => {
    setIsoFocusOnInput(true);
  }, []);

  const inputBlurHandler = useCallback(() => {
    setIsoFocusOnInput(false);
  }, []);

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={0}
      withCloseIcon
      enablePanDownToClose={false}
      disableCloseByTouchOutside
      onDismiss={onDismiss}
      snapPoints={snapPoints}>
      {!currentPhoneNumberAndId ? (
        <FirstScreen
          onSuccessSubmit={firstStepCompletedHandler}
          onFocusInput={inputFocusHandler}
          onBlurInput={inputBlurHandler}
        />
      ) : (
        <SecondScreen
          currentPhoneNumberAndId={currentPhoneNumberAndId}
          onSuccessSubmit={secondStepCompletedHandler}
          onBlurInput={inputBlurHandler}
          onFocusInput={inputFocusHandler}
        />
      )}
    </BottomSheet>
  );
};

export {PhoneVerificationModal};
