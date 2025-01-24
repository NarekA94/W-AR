import React, {FC} from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {TextColors, TextVariant} from '~/theme';
import {AppText} from '../app-text/app-text';

interface ChipProps {
  title?: string;
  isSelected?: boolean;
}

const gradientColors = ['rgba(102, 102, 102, 0.7)', 'rgba(102, 102, 102, 0.2)'];

export const Chip: FC<ChipProps> = ({title, isSelected}) => {
  return (
    <TouchableOpacity style={styles.root}>
      <LinearGradient
        style={styles.gradient}
        colors={gradientColors}
        useAngle
        angle={130}>
        <View style={[styles.body, isSelected && styles.selected]}>
          <AppText variant={TextVariant.S_R} color={TextColors.A100}>
            {title}
          </AppText>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  root: {
    marginRight: vp(8),
    height: vp(45),
  },
  text: {},
  gradient: {
    borderRadius: 12,
    flex: 1,
  },
  body: {
    borderRadius: 12,
    paddingHorizontal: vp(20),
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#333333',
    margin: 1,
  },
  selected: {
    backgroundColor: 'black',
    margin: 0,
  },
});
