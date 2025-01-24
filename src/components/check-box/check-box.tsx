import React, {FC, memo} from 'react';
import {StyleSheet, TouchableOpacity} from 'react-native';
import CheckIcon from '~/assets/images/check.svg';
interface CheckBoxProps {
  onPress?: () => void;
  isSelected?: boolean;
}

export const CheckBox: FC<CheckBoxProps> = memo(({onPress, isSelected}) => {
  return (
    <TouchableOpacity
      style={[styles.root, isSelected && styles.isSelected]}
      hitSlop={20}
      onPress={onPress}>
      {isSelected && <CheckIcon />}
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  root: {
    height: vp(14),
    width: vp(14),
    borderRadius: 2,
    borderWidth: 1,
    borderColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  isSelected: {
    borderWidth: 0,
    backgroundColor: 'transparent',
  },
});
