import React, {FC} from 'react';
import {
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
  TextInput as TextInputBase,
  TextStyle,
  TextInputProps as TextInputPropsBase,
} from 'react-native';
import {TextColors, TextVariant, useTheme} from '~/theme';
import {AppText} from '..';

interface TextInputProps extends TextInputPropsBase {
  inputStyles?: StyleProp<TextStyle>;
  inputContainerStyles?: StyleProp<ViewStyle>;
  value?: string;
  setValue?: ((text: string) => void) | undefined;
  error?: boolean;
}

export const Input: FC<TextInputProps> = ({
  inputStyles,
  inputContainerStyles,
  error,
  ...props
}) => {
  const {theme} = useTheme();

  return (
    <View style={[styles.inputContainer, inputContainerStyles]}>
      <TextInputBase
        onChangeText={props.setValue}
        value={props.value}
        placeholderTextColor={theme.colors.textColors.G100}
        style={[
          styles.input,
          {
            color: theme.colors.textColors.A100,
            fontFamily: theme.fontFamily[300],
            borderColor: theme.colors.border.A020,
          },
          error
            ? {
                color: theme.colors.textColors.error,
                borderColor: theme.colors.textColors.error,
              }
            : {},
          inputStyles,
        ]}
        {...props}
      />
      <View style={styles.errorBox}>
        {error && (
          <AppText variant={TextVariant.P_M} color={TextColors.error}>
            Please enter your name.
          </AppText>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    alignItems: 'center',
    borderRadius: 13,
    marginHorizontal: vp(20),
    marginTop: vp(20),
  },
  icon: {
    position: 'absolute',
    left: 17,
  },
  input: {
    borderWidth: 1,
    height: vp(50),
    width: '100%',
    borderRadius: 13,
    fontSize: 14,
    paddingLeft: vp(19),
    paddingRight: vp(10),
  },
  close: {
    paddingRight: 13,
  },
  errorBox: {
    height: vp(20),
    width: '100%',
    marginTop: vp(10),
  },
});
