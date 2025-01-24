import React, {FC} from 'react';
import {
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
  TextInput as TextInputBase,
  TextStyle,
  TextInputProps as TextInputPropsBase,
  Pressable,
} from 'react-native';
import SearchIcon from '~/assets/images/input/search.svg';
import CloseIcon from '~/assets/images/close.svg';
import {useIsFocusedInput} from '~/hooks/useIsFocusedInput';
import {useTheme} from '~/theme';

interface TextInputProps extends TextInputPropsBase {
  inputStyles?: StyleProp<TextStyle>;
  inputContainerStyles?: StyleProp<ViewStyle>;
  value?: string;
  setValue?: ((text: string) => void) | undefined;
}

export const SearchInput: FC<TextInputProps> = ({
  inputStyles,
  inputContainerStyles,
  ...props
}) => {
  const {theme} = useTheme();
  const {isFocused, event} = useIsFocusedInput();
  const handlePressRemove = () => {
    props.setValue?.('');
  };
  return (
    <View
      style={[
        styles.inputContainer,
        {
          borderColor: theme.colors.border.A020,
        },
        inputContainerStyles,
      ]}>
      {!isFocused && !props.value && (
        <View style={styles.icon}>
          <SearchIcon
            color={theme.colors.background.primary}
            height={21}
            width={21}
          />
        </View>
      )}

      <TextInputBase
        {...event}
        onChangeText={props.setValue}
        value={props.value}
        placeholderTextColor={theme.colors.textColors.G090}
        style={[
          styles.input,
          {
            color: theme.colors.textColors.A100,
            fontFamily: theme.fontFamily[300],
          },
          inputStyles,
        ]}
        {...props}
      />
      {!!props.value && (
        <Pressable
          hitSlop={20}
          onPress={handlePressRemove}
          style={styles.close}>
          <CloseIcon
            color={theme.colors.textColors.A100}
            height={14}
            width={14}
          />
        </Pressable>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 5,
    borderWidth: 1,
    height: vp(50),
    borderRadius: 13,
    flex: 1,
    paddingLeft: 15,
  },
  icon: {
    position: 'absolute',
    left: 17,
  },
  input: {
    fontSize: 14,
    flex: 1,
    height: 46,
  },
  close: {
    paddingRight: 13,
  },
});
