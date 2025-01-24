import React, {FC, memo} from 'react';
import {
  View,
  StyleSheet,
  StyleProp,
  ViewStyle,
  ActivityIndicator,
} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {AppText} from '~/components';
import {TextVariant} from '~/theme';

export enum GameButtonState {
  IDLE,
  SUCCESS,
  ERROR,
  LOADING,
}
interface GameButtonProps {
  state?: GameButtonState;
  onPress?: () => void;
  children: string | React.ReactNode;
  containerStyle?: StyleProp<ViewStyle>;
  disabled?: boolean | undefined;
  fontSize?: number | undefined;
}

export const GameButton: FC<GameButtonProps> = memo(props => {
  return (
    <View style={[styles.buttonOuterContainer, props.containerStyle]}>
      <TouchableOpacity
        disabled={props.disabled}
        onPress={props.onPress}
        style={
          props.state === undefined ||
          props.state === GameButtonState.IDLE ||
          props.state === GameButtonState.LOADING
            ? [styles.touchable]
            : props.state === GameButtonState.SUCCESS
            ? [styles.touchable, styles.buttonSuccess]
            : [styles.touchable, styles.buttonError]
        }>
        <View style={styles.buttonInnerContainer}>
          {props.state !== GameButtonState.LOADING ? (
            <AppText
              variant={TextVariant.M_B}
              size={props.fontSize}
              style={styles.buttonText}>
              {props.children}
            </AppText>
          ) : (
            <ActivityIndicator color="black" size="large" />
          )}
        </View>
      </TouchableOpacity>
    </View>
  );
});

const styles = StyleSheet.create({
  buttonOuterContainer: {
    borderRadius: 28,
    overflow: 'hidden',
  },
  touchable: {
    borderRadius: 28,
    overflow: 'hidden',
    backgroundColor: 'white',
    height: vp(48),
    justifyContent: 'center',
  },
  buttonInnerContainer: {},

  buttonSuccess: {
    backgroundColor: '#07CC64',
  },
  buttonError: {
    backgroundColor: '#FF835B',
  },
  buttonText: {
    color: 'black',
    textAlign: 'center',
    textTransform: 'uppercase',
  },
  pressed: {
    opacity: 0.75,
  },
});
