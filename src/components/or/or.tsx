import React, {FC, memo} from 'react';
import {StyleProp, StyleSheet, View, ViewStyle} from 'react-native';
import {AppText} from '..';
import {FontWeight, TextColors, TextVariant} from '~/theme';
import LinearGradient from 'react-native-linear-gradient';

const start = {x: 0, y: 0};
const end = {x: 1, y: 0};
const colors = ['#292929', '#636363', '#292929'];

interface ORProps {
  containerStyle?: StyleProp<ViewStyle>;
  title?: string;
  textSize?: number;
}

export const OR: FC<ORProps> = memo(({title = 'or', ...props}) => {
  return (
    <View style={[styles.root, props.containerStyle]}>
      <LinearGradient
        colors={colors}
        start={start}
        end={end}
        style={styles.linearGradient}
      />
      <AppText
        style={styles.text}
        variant={TextVariant.H4_B}
        fontWeight={FontWeight.W400}
        size={props.textSize}
        color={TextColors.A100}>
        {title}
      </AppText>
      <LinearGradient
        colors={colors}
        start={start}
        end={end}
        style={styles.linearGradient}
      />
    </View>
  );
});

const styles = StyleSheet.create({
  root: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  text: {
    marginHorizontal: vp(17),
  },
  linearGradient: {
    flex: 1,
    height: 1,
  },
});
