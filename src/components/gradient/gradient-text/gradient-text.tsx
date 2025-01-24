import React, {FC} from 'react';
import {StyleProp, StyleSheet, Text, TextStyle} from 'react-native';
import MaskedView from '@react-native-masked-view/masked-view';
import LinearGradient from 'react-native-linear-gradient';

interface GradientTextProps {
  style?: StyleProp<TextStyle>;
  children?: React.ReactNode;
  colors?: (string | number)[];
  locations?: number[];
}
const textGradient = [
  'rgba(255, 255, 255, 0.3)',
  'rgba(255, 255, 255, 1)',
  'rgba(255, 255, 255, 0.3)',
];
const gradintLocations = [0, 0.5, 1];
export const GradientText: FC<GradientTextProps> = ({
  colors = textGradient,
  locations = gradintLocations,
  ...props
}) => {
  return (
    //need to add patch
    //@ts-ignore
    <MaskedView maskElement={<Text {...props} />}>
      <LinearGradient
        colors={colors}
        locations={locations}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 0}}>
        <Text {...props} style={[props.style, styles.text]}>
          {props.children}
        </Text>
      </LinearGradient>
    </MaskedView>
  );
};

const styles = StyleSheet.create({
  text: {
    opacity: 0,
  },
});
