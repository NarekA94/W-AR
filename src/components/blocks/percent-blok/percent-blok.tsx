import React, {FC, useMemo} from 'react';
import {StyleSheet, View} from 'react-native';
import {RadialGradient} from '~/components';
import {WIDTH} from '~/constants/layout';
import {TextVariant, useTheme} from '~/theme';
import {AppText} from '../app-text/app-text';

type Variants = 'pink' | 'blue' | 'green';

interface PercentBlockProps {
  percent?: string | number;
  measurement?: string;
  variant?: Variants;
}

interface BoxTheme {
  textColor: string;
  backgroundColor: string[];
}

const itemWidth = (WIDTH - 2 * 24.5 - 16) / 3;

export const PercentBlock: FC<PercentBlockProps> = ({
  variant = 'pink',
  ...props
}) => {
  const {theme} = useTheme();

  const boxStyle = useMemo(() => {
    const boxTheme: Record<Variants, BoxTheme> = {
      pink: {
        textColor: theme.colors.pink.bold,
        backgroundColor: [theme.colors.pink.light, theme.colors.pink.medium],
      },
      blue: {
        textColor: theme.colors.blue.bold,
        backgroundColor: [theme.colors.blue.light, theme.colors.blue.medium],
      },
      green: {
        textColor: theme.colors.green.bold,
        backgroundColor: [theme.colors.green.light, theme.colors.green.medium],
      },
    };
    return boxTheme[variant || 'pink'];
  }, [variant]);

  return (
    <View style={styles.root}>
      <RadialGradient
        colors={boxStyle.backgroundColor}
        width={itemWidth}
        height={72}>
        <View style={styles.content}>
          <AppText
            style={[styles.text, {color: boxStyle.textColor}]}
            variant={TextVariant.H3_L}>
            {props.percent}%
          </AppText>
          <AppText style={{color: boxStyle.textColor}} variant={TextVariant.R}>
            {props.measurement}
          </AppText>
        </View>
      </RadialGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    marginRight: 8,
  },
  content: {
    paddingTop: 4,
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  text: {
    marginBottom: 7,
    fontSize: 28,
  },
});
