import {FontWeight, TextColors, TextVariant, useTheme} from '~/theme';
import React, {memo} from 'react';
import {StyleSheet, Text as DefaultText} from 'react-native';
import {GradientText} from '~/components';

type InnerAppTextProps = {
  variant?: TextVariant;
  color?: TextColors;
  fontWeight?: FontWeight;
  size?: number;
  withGradient?: boolean;
  gradientColors?: (string | number)[];
  locations?: number[];
};

export type AppTextProps = InnerAppTextProps & DefaultText['props'];

export const AppText: React.FC<AppTextProps> = memo(({style, ...props}) => {
  const themeStyle = useStyles(props);
  if (props.withGradient) {
    return (
      <GradientText
        locations={props.locations}
        style={style}
        colors={props.gradientColors}>
        <DefaultText style={[themeStyle.text, style]} {...props} />
      </GradientText>
    );
  }
  return <DefaultText style={[themeStyle.text, style]} {...props} />;
});

const useStyles = (props: InnerAppTextProps) => {
  const {theme} = useTheme();
  const defaultStyle = theme.text[props.variant ?? 'R'];
  const fontFamily = props.fontWeight
    ? theme.fontFamily[props.fontWeight]
    : defaultStyle.fontFamily;
  const color = props.color
    ? theme.colors.textColors[props.color]
    : defaultStyle.color;
  const fontSize = props.size ? props.size : defaultStyle.fontSize;
  return StyleSheet.create({
    text: {
      ...defaultStyle,
      color: color,
      fontFamily: fontFamily,
      fontSize,
    },
  });
};
