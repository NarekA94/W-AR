import React, {FC, memo} from 'react';
import {useIntl} from 'react-intl';
import {Image, StyleSheet, TouchableOpacity} from 'react-native';
import QrIMage from '~/assets/images/rewards/qr-active.png';
import {AppText} from '~/components';
import {TextColors, TextVariant} from '~/theme';

interface QrIconProps {
  disabled?: boolean;
  onPress?: () => void;
}

export const QrIcon: FC<QrIconProps> = memo(props => {
  const intl = useIntl();
  return (
    <TouchableOpacity
      onPress={props.onPress}
      disabled={props.disabled}
      style={styles.root}>
      {!props.disabled && (
        <AppText
          style={styles.text}
          variant={TextVariant.P}
          size={8}
          color={TextColors.G090}>
          {intl.formatMessage({
            id: 'screen.rewards.click',
            defaultMessage: 'Click on me',
          })}
        </AppText>
      )}
      <Image
        style={[styles.image, props.disabled && styles.disabledImage]}
        source={QrIMage}
      />
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  root: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  image: {
    width: vp(28),
    height: vp(28),
  },
  disabledImage: {
    opacity: 0.25,
  },
  text: {
    marginRight: vp(11),
  },
});
