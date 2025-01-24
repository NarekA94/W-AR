import React, {FC, memo} from 'react';
import {Image, StyleSheet, View} from 'react-native';
import TabInfoIcon from '~/assets/images/brands/tab-info.png';
import {AppText, Button} from '~/components';
import {TextColors, TextVariant} from '~/theme';

interface TabInfoProps {
  title?: string;
  description?: string;
  close?: () => void;
}

export const TabInfo: FC<TabInfoProps> = memo(({title, description, close}) => {
  return (
    <View style={styles.root}>
      <Image style={styles.img} source={TabInfoIcon} />
      <AppText variant={TextVariant['24_5A']}>{title}</AppText>
      <AppText
        style={styles.desc}
        variant={TextVariant.S_R}
        color={TextColors.G090}>
        {description}
      </AppText>
      <Button width="100%" withImageBackground onPress={close} title="Okay" />
    </View>
  );
});

const styles = StyleSheet.create({
  root: {
    alignItems: 'center',
  },
  img: {
    width: vp(130),
    height: vp(130),
    marginBottom: vp(38),
  },
  desc: {
    textAlign: 'center',
    marginTop: vp(12),
    marginBottom: vp(50),
  },
});
