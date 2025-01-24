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
import SearchIcon from '~/assets/images/input/search.svg';
import {useIsFocusedInput} from '~/hooks/useIsFocusedInput';
import {useTheme} from '~/theme';

interface TextInputProps extends TextInputPropsBase {
  containerStyle?: StyleProp<ViewStyle>;
  inputStyles?: StyleProp<TextStyle>;
  inputContainerStyles?: StyleProp<ViewStyle>;
}

export const TextInput: FC<TextInputProps> = ({
  containerStyle,
  inputStyles,
  inputContainerStyles,
  ...props
}) => {
  const {theme} = useTheme();
  const {isFocused, event} = useIsFocusedInput();
  return (
    <View style={containerStyle}>
      <View
        style={[
          styles.inputContainer,
          {
            borderColor: isFocused
              ? theme.colors.border.A030
              : theme.colors.border.A020,
            backgroundColor: theme.colors.primary,
          },
          inputContainerStyles,
        ]}>
        <View style={styles.icon}>
          <SearchIcon
            color={theme.colors.textColors.G100}
            height={21}
            width={21}
          />
        </View>
        <TextInputBase
          {...event}
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
      </View>
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
    width: '100%',
    borderRadius: 13,
  },
  icon: {
    marginLeft: 15,
    marginRight: vp(14),
  },
  input: {
    fontSize: 14,
    flex: 1,
    height: 46,
  },
});
