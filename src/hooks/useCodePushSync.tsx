import {useCallback, useEffect, useRef, useState} from 'react';
import {AppState, Platform} from 'react-native';
import codePush from 'react-native-code-push';
import {useSharedValue} from 'react-native-reanimated';
import {logger} from '~/utils';
import Config from 'react-native-config';

const deploymentKey = Platform.select({
  android: Config.CODE_PUSH_ANDROID_DEPLOYMENT,
  ios: Config.CODE_PUSH_IOS_DEPLOYMENT,
});

// Enum for different CodePush build statuses
export enum CodePushBuildStatus {
  MANDATORY = 'mandatory', // A mandatory update is available
  DEFAULT = 'default', // A non-mandatory update is available
  UP_TO_DATE = 'up_to_date', // The app is already up-to-date
}

// Custom hook for handling CodePush updates
export const useCodePushSync = () => {
  // State to store the current CodePush build status
  const [codePushBuildStatus, setCodePushBuildStatus] =
    useState<CodePushBuildStatus | null>(null);
  const [syncStatus, setSyncStatus] = useState<codePush.SyncStatus | null>(
    null,
  );
  // Shared value to track download progress
  const downloadProgress = useSharedValue<number>(0);
  const appState = useRef(AppState.currentState);

  const checkCodePushUpdates = useCallback(() => {
    if (syncStatus === null || syncStatus === codePush.SyncStatus.UP_TO_DATE) {
      // Check for available CodePush updates when the component mounts
      codePush
        .checkForUpdate(deploymentKey)
        .then(update => {
          if (update && !update.isPending) {
            if (update.isMandatory) {
              // A mandatory update is available
              setCodePushBuildStatus(CodePushBuildStatus.MANDATORY);
              setSyncStatus(codePush.SyncStatus.DOWNLOADING_PACKAGE);
              // Download and install the update with progress tracking
              update
                .download(progress => {
                  const downloadedProgress = Math.floor(
                    (progress.receivedBytes / progress.totalBytes) * 100,
                  );
                  downloadProgress.value = downloadedProgress;
                })
                .then(res => {
                  setSyncStatus(codePush.SyncStatus.INSTALLING_UPDATE);
                  res.install(codePush.InstallMode.ON_NEXT_RESTART).then(() => {
                    setSyncStatus(codePush.SyncStatus.UP_TO_DATE);

                    codePush.restartApp();
                  });
                })
                .catch(e => {
                  // Handle any errors during update download or installation
                  logger.warn(e);
                  setCodePushBuildStatus(null);
                });
            } else {
              // A non-mandatory update is available
              setCodePushBuildStatus(CodePushBuildStatus.DEFAULT);
              setSyncStatus(codePush.SyncStatus.DOWNLOADING_PACKAGE);

              // Download and install the update
              update
                .download()
                .then(res => {
                  setSyncStatus(codePush.SyncStatus.INSTALLING_UPDATE);
                  res.install(codePush.InstallMode.ON_NEXT_RESTART).then(() => {
                    // Set the build status to up-to-date after successful installation
                    setCodePushBuildStatus(CodePushBuildStatus.UP_TO_DATE);
                    setSyncStatus(codePush.SyncStatus.UP_TO_DATE);
                  });
                })
                .catch(e => {
                  // Handle any errors during update download or installation
                  logger.warn(e);
                  setCodePushBuildStatus(null);
                });
            }
          } else {
            setSyncStatus(codePush.SyncStatus.UP_TO_DATE);
            // No updates are available
            logger.log('The app is up to date!');
          }
        })
        .catch(e => {
          setSyncStatus(null);
          // Handle any errors that occur during the update check
          logger.warn(e);
        });
    }
  }, [downloadProgress, syncStatus]);

  useEffect(() => {
    checkCodePushUpdates();
  }, []);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (appState.current.match(/background/) && nextAppState === 'active') {
        checkCodePushUpdates();
      }

      appState.current = nextAppState;
    });
    return () => {
      subscription.remove();
    };
  }, [checkCodePushUpdates, syncStatus]);

  // Return the current CodePush build status and download progress
  return {
    codePushBuildStatus,
    downloadProgress,
  };
};
