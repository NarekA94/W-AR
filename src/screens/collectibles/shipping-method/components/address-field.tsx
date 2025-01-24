import React, {FC, memo} from 'react';
import {StyleSheet, TouchableOpacity} from 'react-native';
import {AppText} from '~/components';
import {TextColors, TextVariant, useTheme} from '~/theme';

interface AddressFieldProps {
  address?: string;
  onPress?: () => void;
}

export const AddressField: FC<AddressFieldProps> = memo(props => {
  const {theme} = useTheme();
  return (
    <>
      <AppText variant={TextVariant.H5_M}>
        Type your address for delivery
      </AppText>
      <TouchableOpacity
        onPress={props.onPress}
        style={[
          styles.root,
          {
            borderColor: props.address
              ? theme.colors.background.primary
              : theme.colors.border.A020,
          },
        ]}>
        <AppText
          variant={TextVariant.S_R}
          color={props.address ? TextColors.A100 : TextColors.G100}>
          {props.address ? props.address : 'Enter shipping address'}
        </AppText>
      </TouchableOpacity>
    </>
  );
});

const styles = StyleSheet.create({
  root: {
    height: vp(50),
    borderRadius: 13,
    borderWidth: 1,
    justifyContent: 'center',
    paddingLeft: vp(20),
    marginTop: vp(15),
  },
});
