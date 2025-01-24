import React, {Fragment, useCallback, useState} from 'react';
import {Control, FieldPath, FieldValues, useController} from 'react-hook-form';
import {FieldPathValue, UseFormTrigger} from 'react-hook-form/dist/types';
import {
  Pressable,
  StyleProp,
  StyleSheet,
  TextInputProps,
  View,
  ViewStyle,
} from 'react-native';
import {Field, FormInput, Hint} from '~/components/form';
import EyeIcon from '~/assets/images/register/eye.svg';
import EyeOffIcon from '~/assets/images/register/eye-off.svg';
import {useTheme} from '~/theme';

type InputValue = string;

export interface HintProp {
  name: string;
  label: string;
}
interface Props<
  TFormValues extends FieldValues,
  TName extends FieldPath<TFormValues>,
> extends Omit<TextInputProps, 'style'> {
  name: FieldPathValue<TFormValues, TName> extends InputValue ? TName : never;
  control: Control<TFormValues>;
  label?: string | null;
  style?: StyleProp<ViewStyle>;
  hints?: HintProp[];
  trigger?: UseFormTrigger<TFormValues>;
  placeholder?: string;
  needFormValidation?: boolean;
  bottomSpace?: number;
  showError?: boolean;
}

export const PasswordField = <
  TFormValues extends FieldValues,
  TName extends FieldPath<TFormValues>,
>({
  name,
  control,
  label,
  style,
  hints,
  placeholder,
  trigger,
  bottomSpace,
  needFormValidation = true,
  showError,
  ...textInputProps
}: Props<TFormValues, TName>): React.ReactElement => {
  const {theme} = useTheme();
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const controller = useController({name, control});
  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);

  const togglePasswordVisibility = (): void => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const renderHints = useCallback(
    (item: HintProp) => (
      <Hint
        inputText={controller.field.value}
        key={item.name}
        label={item.label}
        name={item.name}
        control={control}
        trigger={trigger}
        isFocused={isFocused}
      />
    ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [controller.field.value, isFocused],
  );

  const handleFocus: TextInputProps['onFocus'] = e => {
    textInputProps.onFocus?.(e);
    setIsFocused(true);
  };

  const handleBlur: TextInputProps['onBlur'] = e => {
    textInputProps.onFocus?.(e);
    controller.field.onBlur();
    setIsFocused(false);
  };

  const isNonCyrillicInput = (text: string): boolean => {
    const nonCyrillicRegex = /^[^\u0400-\u04FF]*$/;
    return nonCyrillicRegex.test(text);
  };

  const handleInputChange = (text: string) => {
    if (isNonCyrillicInput(text)) {
      controller.field.onChange(text);
    }
  };

  const isValid =
    needFormValidation &&
    controller.fieldState.isDirty &&
    !controller.fieldState.invalid;
  return (
    <Fragment>
      <Field
        {...{style, label, bottomSpace, showError}}
        error={controller.fieldState.error}
        isDirty={controller.fieldState.isDirty}>
        <FormInput
          placeholder={placeholder}
          value={controller.field.value}
          onChangeText={handleInputChange}
          onBlur={handleBlur}
          style={styles.input}
          secureTextEntry={!isPasswordVisible}
          autoComplete="password"
          onFocus={handleFocus}
          error={controller.fieldState.error}
          textContentType="password"
          isValid={isValid}
          capitalize="none"
          {...textInputProps}
        />
        <Pressable onPress={togglePasswordVisibility} style={styles.toggle}>
          {isPasswordVisible ? (
            <EyeIcon
              color={
                isValid
                  ? theme.colors.textColors.A100
                  : theme.colors.textColors.G100
              }
            />
          ) : (
            <EyeOffIcon
              color={
                isValid
                  ? theme.colors.textColors.A100
                  : theme.colors.textColors.G100
              }
            />
          )}
        </Pressable>
      </Field>
      {hints?.length &&
        !!controller.field.value &&
        controller.fieldState.isDirty && (
          <View style={styles.hints}>{hints?.map(renderHints)}</View>
        )}
    </Fragment>
  );
};

const EYE_ICON_SIZE = 24;

const styles = StyleSheet.create({
  input: {
    paddingRight: 9 + EYE_ICON_SIZE + 10,
  },
  toggle: {
    position: 'absolute',
    right: 12,
    top: 0,
    height: '100%',
    justifyContent: 'center',
  },
  hints: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
    marginBottom: -vp(8),
  },
});
