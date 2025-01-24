import React, {FC, memo, useCallback, useState} from 'react';
import {
  Keyboard,
  Pressable,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import SearchImage from '~/assets/images/search.svg';
import FilterImage from '~/assets/images/filter.svg';
import ClearIcon from '~/assets/images/input/clear.svg';
import {useIntl} from 'react-intl';
import {TextColors, TextVariant, useTheme} from '~/theme';
import {AppText} from '~/components/blocks/app-text/app-text';
import {fontFamily} from '~/theme/utils/font-family';

interface SearchProps {
  onChange?: (value: string) => void;
}

export const Search: FC<SearchProps> = memo(props => {
  const intl = useIntl();
  const {theme} = useTheme();
  const [searchText, setSearchText] = useState<string>();
  const [isFocused, setIsFocused] = useState<boolean>(false);

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  const closeKeyboard = useCallback(() => {
    Keyboard.dismiss();
  }, []);

  const clearInput = () => {
    setSearchText('');
    props.onChange?.('');
  };

  const onChangeText = (text: string) => {
    setSearchText(text);
    props.onChange?.(text);
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <SearchImage width={25} height={25} />
        <TextInput
          clearButtonMode="always"
          onFocus={handleFocus}
          onBlur={handleBlur}
          style={styles.input}
          placeholder={intl.formatMessage({
            id: 'search.phrase.placeholder',
            defaultMessage: 'Search',
          })}
          placeholderTextColor={theme.colors.textColors.B040}
          value={searchText}
          onChangeText={onChangeText}
        />
        {isFocused && searchText && (
          <Pressable hitSlop={40} onPress={clearInput} style={styles.close}>
            <ClearIcon height={18} width={18} />
          </Pressable>
        )}
      </View>
      <View style={styles.cancel}>
        {isFocused ? (
          <AppText
            onPress={closeKeyboard}
            variant={TextVariant.S_R}
            color={TextColors.B040}>
            {intl.formatMessage({
              id: 'global.cancel',
              defaultMessage: 'Cancel',
            })}
          </AppText>
        ) : (
          <TouchableOpacity>
            <FilterImage />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  inputContainer: {
    borderWidth: 2,
    borderColor: 'rgba(75, 100, 255, 0.1)',
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 8,
    height: vp(40),
    flex: 1,
  },
  input: {
    marginLeft: 10,
    flex: 1,
    fontSize: 16,
    fontFamily: fontFamily[400],
    height: vp(40),
  },
  cancel: {
    marginLeft: 15,
  },
  close: {
    paddingLeft: 2,
    paddingRight: 7,
  },
});

export default Search;
