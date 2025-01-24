import notifee, {Notification} from '@notifee/react-native';
import messaging, {
  FirebaseMessagingTypes,
} from '@react-native-firebase/messaging';

async function onMessageReceived(
  message: FirebaseMessagingTypes.RemoteMessage,
) {
  const channelId = await notifee.createChannel({
    id: 'remote',
    name: 'Remote Channel',
  });
  const notification: Notification = {
    title: message.notification?.title,
    body: message.notification?.body,
    android: {
      channelId,
      smallIcon: 'ic_stat_message',
      pressAction: {
        id: 'default',
      },
    },
  };
  if (message?.data) {
    notification.data = message?.data;
  }
  await notifee.displayNotification(notification);
}

messaging().onMessage(onMessageReceived);
// messaging().setBackgroundMessageHandler(onMessageReceived);
