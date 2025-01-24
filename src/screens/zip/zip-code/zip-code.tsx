import React, {FC} from 'react';
import {useIntl} from 'react-intl';
import {Wrapper, ChooseLocation, DismissKeyboardView} from '~/components';
import Geolocation from '@react-native-community/geolocation';
import {KeyboardAvoidingView} from 'react-native';
import {GLOBAL_STYLES} from '~/theme';
import {IS_IOS} from '~/constants/layout';

const behavior = IS_IOS ? 'padding' : undefined;
Geolocation.setRNConfiguration({skipPermissionRequests: true});

export const ZipCodeScreen: FC = () => {
  const intl = useIntl();
  return (
    <Wrapper
      headerProps={{
        title: intl.formatMessage({
          id: 'newZip.title',
          defaultMessage: 'Enter a new zip-code',
        }),
      }}
      withHeader
      withStatusBar
      dark>
      <KeyboardAvoidingView style={GLOBAL_STYLES.flex_1} behavior={behavior}>
        <DismissKeyboardView>
          <ChooseLocation
            withRecent={false}
            showPermissionAlert
            withNavigation
          />
        </DismissKeyboardView>
      </KeyboardAvoidingView>
    </Wrapper>
  );
};
