import React, {FC, memo} from 'react';
import {StyleSheet, TouchableOpacity} from 'react-native';
import LocationIcon from '~/assets/images/zip/location.svg';

import {TextColors, TextVariant} from '~/theme';
import {AppText} from '..';

interface ListItemZipProps {
  body: string;
  onPressZip?: (zip: string) => void;
}

export const ListItemZip: FC<ListItemZipProps> = memo(props => {
  const handlePressZip = () => {
    props.onPressZip?.(props.body);
  };
  return (
    <TouchableOpacity onPress={handlePressZip} style={styles.root}>
      <LocationIcon width={24} height={24} />
      <AppText
        style={styles.text}
        color={TextColors.A100}
        variant={TextVariant.S_R}>
        {props.body}
      </AppText>
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  root: {
    flexDirection: 'row',
    paddingBottom: vp(18),
  },
  text: {lineHeight: 22, marginLeft: 10},
});
