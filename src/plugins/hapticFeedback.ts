import {trigger} from 'react-native-haptic-feedback';
import {
  hapticFeedbackOptions,
  hapticFeedbackTriggerType,
} from '~/constants/global';

export const triggerHapticFeedback = () => {
  trigger(hapticFeedbackTriggerType, hapticFeedbackOptions);
};
