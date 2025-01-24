import React, {FC} from 'react';
import {CodePushBuildStatus, useCodePushSync} from '~/hooks/useCodePushSync';
import {CodePushCongratulationScreen} from './congratulation';
import {CodePushNotification} from './notification';
import {CodePushProgressScreen} from './progress-screen';

export const CodePushScreen: FC = () => {
  const {codePushBuildStatus, downloadProgress} = useCodePushSync();
  if (codePushBuildStatus === CodePushBuildStatus.MANDATORY) {
    return <CodePushProgressScreen progress={downloadProgress} />;
  }
  if (codePushBuildStatus === CodePushBuildStatus.DEFAULT) {
    return <CodePushNotification />;
  }
  if (codePushBuildStatus === CodePushBuildStatus.UP_TO_DATE) {
    return <CodePushCongratulationScreen />;
  }
  return <></>;
};
