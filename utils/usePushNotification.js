import messaging from '@react-native-firebase/messaging';
import {PermissionsAndroid, Platform} from 'react-native';
import notifee from '@notifee/react-native';
import { navigationRef } from './navigationRef';

const usePushNotification = () => {
  const displayPushNotification = async (message) => {
    console.log('===', message.notification.title, '===')
    await notifee.displayNotification({
      title: message.notification.title,
      body: message.notification.body,
      android: {
        smallIcon: 'launcher',
        channelId: 'faithconnect',
        // pressAction is needed if you want the notification to open the app when pressed
        pressAction: {
          id: 'default',
        },
      },
    });
  }

  const notificationTapped = (message) => {
    if (message.data.page.toLowerCase() === 'feed') {
      navigationRef.current?.navigate('FeedsDetail', { id: message.data.id });
    }

    if (message.data.page.toLowerCase() === 'media') {
      navigationRef.current?.navigate('AudioDetails', { id: message.data.id });
    }
  }

  const requestUserPermission = async () => {
    if (Platform.OS === 'ios') {
      //Request iOS permission
      const authStatus = await messaging().requestPermission();
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

      if (enabled) {
        console.log('Authorization status:', authStatus);
      }
    } else if (Platform.OS === 'android') {
      //Request Android permission (For API level 33+, for 32 or below is not required)
      const res = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
      );
    }
  }

  const subscribeTopic = async (topic) => {
    await messaging()
      .subscribeToTopic(topic)
      .then(() => console.log("Subscribed to topic:", topic))
      .catch((e) => {
        console.log(e);
      });
  };

  const unsubscribeFromTopic = async (topic) => {
    try {
      await messaging().unsubscribeFromTopic(topic);
      console.log(`Unsubscribed from topic "${topic}"`);
    } catch (error) {
      console.error(`Error unsubscribing from topic "${topic}":`, error);
    }
  };

  const getFCMToken = async () => {
    const fcmToken = await messaging().getToken();
    if (fcmToken) {
      console.log('Your Firebase Token is:', fcmToken);
    } else {
      console.log('Failed', 'No token received');
    }
  };

  const listenToForegroundNotifications = async () => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      console.log(
        'A new message arrived! (FOREGROUND)',
        JSON.stringify(remoteMessage),
      );
      await displayPushNotification(remoteMessage)
    });
    return unsubscribe;
  }

  const listenToBackgroundNotifications = async () => {
    const unsubscribe = messaging().setBackgroundMessageHandler(
      async remoteMessage => {
        console.log(
          'A new message arrived! (BACKGROUND)',
          JSON.stringify(remoteMessage),
        );
          await displayPushNotification(remoteMessage)
        return remoteMessage
      },
    );
    return unsubscribe;
  }

  const onNotificationOpenedAppFromBackground = async () => {
    const unsubscribe = messaging().onNotificationOpenedApp(
      async remoteMessage => {
        console.log(
          'App opened from BACKGROUND by tapping notification:',
          JSON.stringify(remoteMessage),
          'clicked'
        );
        notificationTapped(remoteMessage)
      },
    );
    return unsubscribe;
  };

  const onNotificationOpenedAppFromQuit = async () => {
    const message = await messaging().getInitialNotification();

    if(message) {
      console.log('App opened from QUIT by tapping notification:', JSON.stringify(message));
      notificationTapped(message)
    }
  };

  notifee.onBackgroundEvent(async ({ type, detail }) => {
    // console.log(type, detail, 'reaching ')
   
    // const { notification, pressAction } = detail;
  
    // // Check if the user pressed the "Mark as read" action
    // if (type === EventType.ACTION_PRESS && pressAction.id === 'mark-as-read') {
    //   // Update external API
    //   await fetch(`https://my-api.com/chat/${notification.data.chatId}/read`, {
    //     method: 'POST',
    //   });
  
    //   // Remove the notification
    //   await notifee.cancelNotification(notification.id);
    // }
  });

  return {
    requestUserPermission,
    subscribeTopic,
    unsubscribeFromTopic,
    getFCMToken,
    listenToForegroundNotifications,
    listenToBackgroundNotifications,
    onNotificationOpenedAppFromBackground,
    onNotificationOpenedAppFromQuit,
  };
};

export default usePushNotification;