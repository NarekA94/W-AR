import React, {FC, memo, useMemo} from 'react';
import {
  StyleSheet,
  TextInput as BaseTextInput,
  TextInputProps,
  View,
} from 'react-native';
import {useTheme} from '~/theme';
import {FieldError} from 'react-hook-form';
import {SvgProps} from 'react-native-svg';
interface Props extends TextInputProps {
  error?: FieldError;
  disabled?: boolean;
  isValid?: boolean;
  isFocused?: boolean;
  Icon?: React.FC<SvgProps>;
  capitalize: 'none' | 'sentences' | 'words' | 'characters';
}

export const FormInput: FC<Props> = memo(
  ({
    style,
    error,
    disabled,
    isValid,
    Icon,
    multiline,
    capitalize,
    ...textInputProps
  }) => {
    const styles = useStyles();
    const serverError = !!error && error.type === 'server';
    const {theme} = useTheme();
    const textInputStyle = useMemo(() => {
      return [
        style,
        styles.textInput,
        isValid && styles.validInput,
        serverError && styles.errorTextInput,
        multiline && styles.multilineInput,
      ];
    }, [styles, style, isValid, serverError, multiline]);

    return (
      <View
        style={[
          styles.textInputLayout,
          isValid && styles.focused,
          serverError && styles.errorTextInput,
          multiline && styles.multilineLayout,
        ]}>
        <BaseTextInput
          {...textInputProps}
          autoCapitalize={capitalize}
          multiline={multiline}
          placeholderTextColor={theme.colors.textColors.G100}
          selectionColor={theme.colors.textColors.A100}
          style={textInputStyle}
          editable={!disabled}
        />
        {Icon && (
          <View style={styles.icon}>
            <Icon
              color={
                isValid
                  ? theme.colors.textColors.A100
                  : theme.colors.textColors.G100
              }
            />
          </View>
        )}
      </View>
    );
  },
);

const useStyles = () => {
  const {theme} = useTheme();
  const {base: defaultColors} = theme.input.colors;

  const colors = defaultColors;

  return useMemo(
    () =>
      StyleSheet.create({
        textInputLayout: {
          ...theme.input.layout.base,
          borderRadius: theme.input.borderRadius,
          borderStyle: 'solid',
          borderWidth: 1,
          borderColor: colors.border,
          flexDirection: 'row',
        },
        textInput: {
          ...theme.text[theme.input.textVariant],
          color: colors.text,
          height: theme.input.layout.base.height - 1,
          fontFamily: theme.fontFamily[400],
          fontSize: 16,
          flex: 1,
        },
        errorTextInput: {
          borderColor: theme.colors.common.error,
          color: theme.colors.common.error,
        },
        validInput: {
          borderColor: theme.colors.border.success,
        },
        icon: {
          alignItems: 'center',
          justifyContent: 'center',
        },
        focused: {
          borderColor: theme.colors.background.primary,
        },
        multilineLayout: {
          height: vp(253),
        },
        multilineInput: {
          textAlignVertical: 'top',
          height: '100%',
          paddingTop: vp(15),
        },
      }),
    [],
  );
};
