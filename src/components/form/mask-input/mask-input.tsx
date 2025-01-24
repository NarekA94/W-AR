import React, {FC, memo, useMemo} from 'react';
import {StyleSheet} from 'react-native';
import {useTheme} from '~/theme';
import BaseMaskInput, {MaskInputProps} from 'react-native-mask-input';
import {PHONE_MASK} from '~/constants/layout';

interface Props extends MaskInputProps {
  error?: boolean;
  disabled?: boolean;
  placeholder?: string;
  isTransparentBackground?: boolean;
}

export const MaskInput: FC<Props> = memo(
  ({
    style,
    error,
    disabled,
    placeholder = '',
    isTransparentBackground,
    ...textInputProps
  }) => {
    const styles = useStyles();

    const textInputStyle = useMemo(() => {
      return [
        style,
        styles.textInput,
        error && styles.errorTextInput,
        isTransparentBackground && styles.transparentBG,
      ];
    }, [styles, style, error, isTransparentBackground]);

    return (
      <BaseMaskInput
        {...textInputProps}
        autoCapitalize="none"
        style={textInputStyle}
        editable={!disabled}
        mask={PHONE_MASK}
        placeholder={placeholder}
      />
    );
  },
);

const useStyles = () => {
  const {theme} = useTheme();
  const {base: defaultColors} = theme.input.colors;

  const colors = defaultColors;

  return StyleSheet.create({
    textInput: {
      ...theme.text[theme.input.textVariant],

      color: colors.text,
      backgroundColor: colors.background,

      borderRadius: theme.input.borderRadius,
      fontFamily: theme.fontFamily[400],
      fontSize: 16,
    },
    transparentBG: {backgroundColor: 'transparent'},
    errorTextInput: {
      color: theme.colors.common.error,
    },
  });
};
