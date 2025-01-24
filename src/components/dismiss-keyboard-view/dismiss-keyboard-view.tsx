import React, {FC, PropsWithChildren} from 'react';
import {Keyboard, Pressable} from 'react-native';
import {GLOBAL_STYLES} from '~/theme';
export const DismissKeyboardView: FC<PropsWithChildren> = ({children}) => {
  return (
    <Pressable style={GLOBAL_STYLES.flex_1} onPress={Keyboard.dismiss}>
      {children}
    </Pressable>
  );
};
