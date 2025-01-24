import {useEffect, useMemo} from 'react';
import {Keyboard} from 'react-native';
import {useSharedValue} from 'react-native-reanimated';

export const useAnimatedKeyboard = () => {
  const isKeyboardOpen = useSharedValue(false);
  const keyboardHeight = useSharedValue(0);
  useEffect(() => {
    const showSubscription = Keyboard.addListener('keyboardDidShow', e => {
      isKeyboardOpen.value = true;
      keyboardHeight.value = e.endCoordinates.height;
    });
    const hideSubscription = Keyboard.addListener('keyboardDidHide', e => {
      isKeyboardOpen.value = false;
      keyboardHeight.value = e.endCoordinates.height;
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);
  return useMemo(
    () => ({isKeyboardOpen, keyboardHeight}),
    [isKeyboardOpen, keyboardHeight],
  );
};
