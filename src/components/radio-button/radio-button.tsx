import React, {memo, useCallback} from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {IS_IOS} from '~/constants/layout';
import {FontWeight, TextColors, TextVariant} from '~/theme';
import {AppText, Radio} from '..';

interface RadioButtonProps<T> {
  isSelected?: boolean;
  onSelectItem?: (item?: T) => void;
  name: string;
  item?: T;
}

const gradientColors = ['rgba(102, 102, 102, 0.7)', 'rgba(102, 102, 102, 0)'];
const transparentColors = ['transparent', 'transparent'];

export const SimpleRadioButton = <T extends unknown>({
  name,
  isSelected,
  onSelectItem,
  item,
}: RadioButtonProps<T>) => {
  const handlePressButton = useCallback(() => {
    onSelectItem?.(item);
  }, [item, onSelectItem]);
  return (
    <TouchableOpacity onPress={handlePressButton} style={styles.root}>
      <LinearGradient
        style={styles.gradient}
        useAngle
        angle={130}
        colors={isSelected ? gradientColors : transparentColors}>
        <View style={[styles.body, !isSelected && styles.notSelectedStyle]}>
          <Radio isSelected={isSelected} onPress={handlePressButton} />
          <AppText
            style={styles.text}
            variant={TextVariant.M_B}
            color={TextColors.A100}
            fontWeight={FontWeight.W500}>
            {name}
          </AppText>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
};

export const RadioButton = memo(SimpleRadioButton) as typeof SimpleRadioButton;

const styles = StyleSheet.create({
  root: {
    height: vp(56),
  },
  body: {
    alignItems: 'center',
    flexDirection: 'row',
    flex: 1,
    margin: 1,
    backgroundColor: 'black',
    borderRadius: 18,
    paddingHorizontal: vp(16),
  },
  notSelectedStyle: {
    backgroundColor: 'transparent',
  },
  gradient: {
    flex: 1,
    borderRadius: 18,
  },
  text: {
    marginTop: IS_IOS ? vp(3) : 0,
    marginLeft: vp(16),
  },
});
