import {HapticFeedbackTypes} from 'react-native-haptic-feedback';
import {IS_IOS} from './layout';

export const hapticFeedbackTriggerType: HapticFeedbackTypes = IS_IOS
  ? HapticFeedbackTypes.impactMedium
  : HapticFeedbackTypes.effectTick;

export const hapticFeedbackOptions = {
  enableVibrateFallback: true,
  ignoreAndroidSystemSettings: false,
};
