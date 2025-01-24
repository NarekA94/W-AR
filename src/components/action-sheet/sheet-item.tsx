import React, {FC, useMemo} from 'react';
import {Pressable, StyleSheet, ViewStyle, StyleProp} from 'react-native';
import {TextColors, TextVariant, useTheme} from '~/theme';
import {AppText} from '../blocks';

interface Radius {
  borderTopLeftRadius?: number;
  borderTopRightRadius?: number;
  borderBottomLeftRadius?: number;
  borderBottomRightRadius?: number;
}

interface SheetItemProps {
  withBorder?: boolean;
  onPress?: () => void;
  radius?: number | Radius;
  cancel?: boolean;
  containerStyles?: StyleProp<ViewStyle>;
  title: string;
}

export const SheetItem: FC<SheetItemProps> = props => {
  const styles = useStyles(props);
  return (
    <Pressable
      onPress={props.onPress}
      style={[styles.root, props.containerStyles]}>
      <AppText
        variant={TextVariant.M_R}
        color={props.cancel ? TextColors.error : TextColors.A100}>
        {props.title}
      </AppText>
    </Pressable>
  );
};

const useStyles = ({withBorder, radius}: SheetItemProps) => {
  const {theme} = useTheme();

  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          backgroundColor: theme.colors.background.sheet,
          height: vp(50),
          borderBottomWidth: withBorder ? 1 : 0,
          borderColor: theme.colors.border.E01,
          justifyContent: 'center',
          alignItems: 'center',
          marginTop: vp(6),
          ...(typeof radius === 'object' ? radius : {borderRadius: radius}),
        },
      }),
    [],
  );
};
