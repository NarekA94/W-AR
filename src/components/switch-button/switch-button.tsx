import React, {
  forwardRef,
  memo,
  useCallback,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';

import buttonBgtest from '~/assets/images/buttons/small-bg.png';
import {StyleSheet, TouchableOpacity, View, Animated} from 'react-native';
import _ from 'lodash';

export interface SwitchButtonRef {
  on: () => void;
  off: () => void;
}

interface SwitchButtonProps {
  isOn?: boolean;
  toggleSwitcher?: (value: boolean) => void;
  disabled?: boolean;
  disableAutoSwitch?: boolean;
  debounceTime?: number;
}
const switcherWidth = vp(27);

export const SwitchButton = memo(
  forwardRef<SwitchButtonRef, SwitchButtonProps>(
    (
      {
        isOn = false,
        toggleSwitcher,
        disabled,
        disableAutoSwitch,
        debounceTime = 300,
      },
      ref,
    ) => {
      const [isSelected, setIsSelected] = useState<boolean | undefined>(isOn);
      const animation = useRef(new Animated.Value(isSelected ? 1 : 0)).current;

      const changeResult = () => {
        toggleSwitcher?.(!isSelected);
      };

      const toggleOnServer = useMemo(
        () => _.debounce(changeResult, debounceTime),
        [isOn],
      );

      const onPress = useCallback((): void => {
        toggleOnServer();
        if (disableAutoSwitch) {
          return;
        }
        setIsSelected(!isSelected);
        Animated.timing(animation, {
          toValue: isSelected ? 0 : 1,
          duration: 400,
          useNativeDriver: false,
        }).start();
      }, [animation, isSelected, toggleOnServer, disableAutoSwitch]);

      const animatedOpacityColor = animation.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 1],
      });

      const enableSwitcher = useCallback(() => {
        setIsSelected(true);
        Animated.timing(animation, {
          toValue: 1,
          duration: 400,
          useNativeDriver: false,
        }).start();
      }, [animation]);

      const disableSwitcher = useCallback(() => {
        setIsSelected(false);
        Animated.timing(animation, {
          toValue: 0,
          duration: 400,
          useNativeDriver: false,
        }).start();
      }, [animation]);

      useImperativeHandle(ref, () => ({
        off: disableSwitcher,
        on: enableSwitcher,
      }));

      return (
        <View style={[styles.mainContainer, disabled && styles.disabled]}>
          <View style={styles.imageBG} />
          <Animated.Image
            source={buttonBgtest}
            style={[styles.imageStyle, {opacity: animatedOpacityColor}]}
          />
          <TouchableOpacity
            style={styles.container}
            activeOpacity={0.9}
            hitSlop={25}
            disabled={disabled}
            onPress={onPress}>
            <View>
              <View
                style={[
                  styles.basicStyle,
                  {
                    marginLeft:
                      !isSelected || disabled ? vp(5) : switcherWidth - vp(12),
                  },
                ]}
              />
            </View>
          </TouchableOpacity>
        </View>
      );
    },
  ),
);

const styles = StyleSheet.create({
  mainContainer: {
    width: vp(27),
    height: vp(18),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
  },
  disabled: {
    opacity: 0.4,
  },
  container: {
    width: vp(27),
    height: vp(18),
    borderRadius: 20,
    justifyContent: 'center',
  },
  basicStyle: {
    height: 7,
    width: 7,
    borderRadius: 20,
    backgroundColor: '#171717',
    marginLeft: 5,
  },
  mainStyes: {
    borderRadius: 30,
    width: vp(27),
    height: vp(18),
    display: 'flex',
    justifyContent: 'center',
  },
  imageStyle: {
    width: '100%',
    height: '100%',
    borderRadius: 20,
    position: 'absolute',
  },
  imageBG: {
    width: '100%',
    height: '100%',
    borderRadius: 20,
    position: 'absolute',
    backgroundColor: '#4F4F4F',
  },
});
