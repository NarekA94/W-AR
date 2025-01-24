import {Field, FormInput} from '..';
import React, {useCallback, useMemo} from 'react';
import {Control, FieldPath, FieldValues, useController} from 'react-hook-form';
import {FieldPathValue} from 'react-hook-form/dist/types';
import {
  StyleProp,
  TextInputProps,
  ViewStyle,
  Platform,
  TextInputIOSProps,
  TextInputAndroidProps,
} from 'react-native';
import {SvgProps} from 'react-native-svg';
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
  needFormValidation?: boolean;
  withTrim?: boolean;
  icon?: React.FC<SvgProps>;
  autoCompleteType?:
    | 'email'
    | 'password'
    | 'name'
    | 'telephone'
    | 'address'
    | 'username';
}

export const TextField = <
  TFormValues extends FieldValues,
  TName extends FieldPath<TFormValues>,
>({
  name,
  control,
  label,
  style,
  errorStyle,
  needFormValidation = true,
  withTrim,
  icon,
  autoCompleteType,
  ...textInputProps
}: Props<TFormValues, TName>): React.ReactElement => {
  const controller = useController({name, control});

  const inputAutofillTypes = useMemo(() => {
    let textContentType: TextInputIOSProps['textContentType'];
    let androidAutoCompleteType: TextInputAndroidProps['autoComplete'];

    switch (autoCompleteType) {
      case 'email':
        textContentType = 'emailAddress';
        androidAutoCompleteType = 'email';
        break;
      case 'password':
        textContentType = 'password';
        androidAutoCompleteType = 'password';
        break;
      case 'name':
        textContentType = 'name';
        androidAutoCompleteType = 'name';
        break;
      case 'telephone':
        textContentType = 'telephoneNumber';
        androidAutoCompleteType = 'tel';
        break;
      case 'address':
        textContentType = 'fullStreetAddress';
        androidAutoCompleteType = 'street-address';
        break;
      case 'username':
        textContentType = 'username';
        androidAutoCompleteType = 'username';
        break;
      default:
        break;
    }
    return {
      textContentType,
      androidAutoCompleteType,
    };
  }, [autoCompleteType]);

  const handleBlur = useCallback(() => {
    controller.field.onBlur();
    if (withTrim) {
      controller.field.onChange(
        controller.field.value.replace(/\s+/g, ' ').trim(),
      );
    }
  }, [controller.field, withTrim]);

  return (
    <Field {...{style, label, errorStyle}} error={controller.fieldState.error}>
      <FormInput
        value={controller.field.value}
        onChangeText={controller.field.onChange}
        onBlur={handleBlur}
        Icon={icon}
        isValid={
          needFormValidation &&
          controller.fieldState.isDirty &&
          !controller.fieldState.invalid
        }
        error={controller.fieldState.error}
        textContentType={
          Platform.OS === 'ios' ? inputAutofillTypes.textContentType : undefined
        }
        autoComplete={
          Platform.OS === 'android'
            ? inputAutofillTypes.androidAutoCompleteType
            : undefined
        }
        importantForAutofill="yes"
        capitalize={autoCompleteType === 'name' ? 'words' : 'none'}
        {...textInputProps}
      />
    </Field>
  );
};
