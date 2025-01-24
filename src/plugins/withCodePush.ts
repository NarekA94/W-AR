import codePush from 'react-native-code-push';
const codePushOptions = {
  checkFrequency: codePush.CheckFrequency.MANUAL,
};
export const withCodePush = codePush(codePushOptions);
