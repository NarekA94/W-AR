import React, {FC, memo} from 'react';
import {Image, ImageSourcePropType, StyleSheet, View} from 'react-native';
import {AppText, Button} from '~/components';
import {ButtonVariant, GLOBAL_STYLES, TextColors, TextVariant} from '~/theme';

interface DeleteSheetProps {
  close?: () => void;
  onPressDelete: () => void;
  icon: ImageSourcePropType;
  title: string;
  message: string;
  confirmText: string;
  cancelText: string;
}

export const DeleteSheet: FC<DeleteSheetProps> = memo(
  ({close, onPressDelete, icon, title, message, confirmText, cancelText}) => {
    return (
      <>
        <View style={styles.body}>
          <Image style={styles.img} source={icon} />
          <AppText variant={TextVariant['24_5A']}>{title}</AppText>
          <AppText
            style={styles.info}
            variant={TextVariant.S_R}
            color={TextColors.G090}>
            {message}
          </AppText>
        </View>

        <View style={GLOBAL_STYLES.row_between}>
          <Button
            onPress={onPressDelete}
            title={confirmText}
            width="48%"
            variant={ButtonVariant.GRAY}
          />
          <Button
            onPress={close}
            title={cancelText}
            width="48%"
            withImageBackground
          />
        </View>
      </>
    );
  },
);

const styles = StyleSheet.create({
  img: {
    width: vp(130),
    height: vp(130),
    marginBottom: vp(47),
  },
  body: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  info: {
    marginTop: vp(9),
    marginBottom: vp(39),
    textAlign: 'center',
    width: '80%',
    lineHeight: 18,
  },
});
