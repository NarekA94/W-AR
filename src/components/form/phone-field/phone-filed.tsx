import {Field, MaskInput} from '..';
import React from 'react';
import {Control, FieldPath, FieldValues, useController} from 'react-hook-form';
import {FieldPathValue} from 'react-hook-form/dist/types';
import {
  StyleProp,
  StyleSheet,
  TextInputProps,
  View,
  ViewStyle,
} from 'react-native';
import {GLOBAL_STYLES, useTheme} from '~/theme';

type InputValue = string;

interface Props<
  TFormValues extends FieldValues,
  TName extends FieldPath<TFormValues>,
> extends Omit<TextInputProps, 'style'> {
  name: FieldPathValue<TFormValues, TName> extends InputValue ? TName : never;
  control: Control<TFormValues>;
  label?: string | null;
  style?: StyleProp<ViewStyle>;
  errorStyle?: ViewStyle;
  placeholder: string;
  isTransparentBackground?: boolean;
}

export const PhoneField = <
  TFormValues extends FieldValues,
  TName extends FieldPath<TFormValues>,
>({
  name,
  control,
  label,
  style,
  errorStyle,
  placeholder,
  isTransparentBackground,
  ...textInputProps
}: Props<TFormValues, TName>): React.ReactElement => {
  const controller = useController({name, control});
  const styles = useStyles();
  const {theme} = useTheme();
  return (
    <Field
      {...{style, label, errorStyle}}
      childrenContainerStyles={styles.root}
      error={controller.fieldState.error}>
      <View
        style={[
          styles.container,
          // controller.fieldState.isDirty && !controller.fieldState.invalid && styles.validInput,
          controller.fieldState.error?.type === 'server' &&
            styles.errorTextInput,
        ]}>
        <View style={[styles.line, {borderColor: theme.colors.border.A020}]} />
        <MaskInput
          placeholder={placeholder}
          value={controller.field.value}
          onChangeText={controller.field.onChange}
          onBlur={controller.field.onBlur}
          placeholderTextColor={theme.colors.textColors.G100}
          isTransparentBackground={isTransparentBackground}
          {...textInputProps}
          style={GLOBAL_STYLES.flex_1}
          error={controller.fieldState.error?.type === 'server'}
        />
      </View>
    </Field>
  );
};

const useStyles = () => {
  const {theme} = useTheme();
  const {base: defaultColors} = theme.input.colors;

  return StyleSheet.create({
    root: {
      flexDirection: 'row',
      width: '100%',
    },
    selectBox: {
      borderWidth: 1,
      marginRight: 8,
      borderRadius: theme.input.borderRadius,
      alignItems: 'center',
      flexDirection: 'row',
      paddingHorizontal: 8,
      borderColor: defaultColors.border,
    },
    code: {
      color: defaultColors.text,
    },
    container: {
      flexDirection: 'row',
      ...theme.input.layout.base,
      borderColor: defaultColors.border,
      borderRadius: theme.input.borderRadius,
      borderWidth: 1,
      width: '100%',
    },
    line: {
      marginLeft: vp(37),
      position: 'absolute',
      height: '60%',
      borderWidth: 1,
      borderColor: 'red',
      zIndex: 9,
      alignSelf: 'center',
    },
    errorTextInput: {
      borderColor: theme.colors.common.error,
      borderWidth: 1,
    },
    validInput: {
      borderColor: theme.colors.common.success,
    },
  });
};
