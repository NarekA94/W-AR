import React, {memo, useEffect, useMemo} from 'react';
import {
  Control,
  FieldValues,
  useController,
  UseFormTrigger,
} from 'react-hook-form';
import {StyleProp, StyleSheet, TextStyle} from 'react-native';
import {View} from 'react-native';
import {AppText} from '~/components';
import {GLOBAL_STYLES, TextColors, TextVariant, useTheme} from '~/theme';
import DoneIcon from '~/assets/images/input/done.svg';
import ErrorIcon from '~/assets/images/input/error.svg';
interface HintProps<TFormValues extends FieldValues> {
  label: string;
  name: any;
  inputText?: string;
  validator?: any;
  isFocused?: boolean;
  control: Control<TFormValues>;
  trigger?: UseFormTrigger<TFormValues>;
}

type Status = 'default' | 'success' | 'error';

interface HintState {
  status: Status;
  statusStyle: StyleProp<TextStyle>;
}

export const HintComponent = <TFormValues extends FieldValues>({
  inputText,
  isFocused,
  label,
  name,
  control,
  trigger,
}: HintProps<TFormValues>) => {
  const controller = useController({name, control});
  const styles = useStyles();

  useEffect(() => {
    if (inputText) {
      controller.field.onChange(inputText || '');
      trigger?.(name);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputText]);

  const currentState = useMemo((): HintState => {
    if (inputText && controller.fieldState.error) {
      return {
        status: 'success',
        statusStyle: [styles.text, styles.error],
      };
    }
    return {
      status: 'default',
      statusStyle: undefined,
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputText, controller.fieldState.error, isFocused]);

  return (
    <View style={styles.root}>
      {controller.fieldState.error ? <ErrorIcon /> : <DoneIcon />}
      <AppText
        style={[styles.text, currentState.statusStyle]}
        color={TextColors.A100}
        variant={TextVariant.S_R}>
        {label}
      </AppText>
    </View>
  );
};
export const Hint = memo(HintComponent) as typeof HintComponent;
const useStyles = () => {
  const {theme} = useTheme();
  return StyleSheet.create({
    root: {
      ...GLOBAL_STYLES.row_vertical_center,
      width: '50%',
      marginBottom: 8,
    },
    text: {
      marginLeft: 8,
    },
    error: {
      opacity: 0.4,
    },
    success: {
      color: theme.colors.common.success,
      opacity: 1,
    },
  });
};
