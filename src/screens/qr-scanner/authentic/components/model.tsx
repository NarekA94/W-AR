import React, {FC, memo} from 'react';
import {StyleSheet, View} from 'react-native';
import {Defs, LinearGradient, Path, Stop, Svg} from 'react-native-svg';
import {Element3D} from '~/components';

const EllipsePath =
  'M287.5 49C287.5 55.5511 283.599 61.8679 276.37 67.6834C269.146 73.4953 258.662 78.7514 245.662 83.1749C219.668 92.0202 183.725 97.5 144 97.5C104.275 97.5 68.3321 92.0202 42.3377 83.1749C29.338 78.7514 18.8538 73.4953 11.6297 67.6834C4.40094 61.8679 0.5 55.5511 0.5 49C0.5 42.4489 4.40094 36.1321 11.6297 30.3166C18.8538 24.5047 29.338 19.2486 42.3377 14.8251C68.3321 5.9798 104.275 0.5 144 0.5C183.725 0.5 219.668 5.9798 245.662 14.8251C258.662 19.2486 269.146 24.5047 276.37 30.3166C283.599 36.1321 287.5 42.4489 287.5 49Z';

interface ModelProps {
  uri?: string;
}

export const Model: FC<ModelProps> = memo(props => {
  return (
    <View style={styles.root}>
      {props.uri && <Element3D modelUri={props.uri} height={vp(350)} />}
      <View style={styles.ellipseBlock}>
        <Svg width="100%" height="100%" viewBox="0 0 288 98" fill="none">
          <Path opacity="0.1" d={EllipsePath} stroke="url(#paint_linear)" />
          <Defs>
            <LinearGradient
              id="paint_linear"
              x1="144"
              y1="79"
              x2="143.878"
              y2="97.9992"
              gradientUnits="userSpaceOnUse">
              <Stop stopColor="white" stopOpacity="0.08" />
              <Stop offset="1" stopColor="white" />
            </LinearGradient>
          </Defs>
        </Svg>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  root: {
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: vp(332),
  },
  circle: {
    height: vp(260),
    width: vp(260),
    borderRadius: 150,
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
  },
  ellipseBlock: {
    height: vp(98),
    width: '100%',
    top: -vp(60),
    zIndex: -9,
  },
});
