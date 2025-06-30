import React, { useEffect } from 'react';
import { persistStore } from "redux-persist";
import { NavigationContainer } from "@react-navigation/native";
import { PersistGate } from "redux-persist/integration/react";
import { Provider } from "react-redux";
import { store } from './redux/store';
import AppRoute from './navigation/AppTabs';
import { PaperProvider } from 'react-native-paper';
import usePushNotification from './utils/usePushNotification';
import Notifee, { AndroidImportance } from '@notifee/react-native';
import { useSelector } from 'react-redux';
import { Linking } from 'react-native';
import { navigationRef } from './utils/navigationRef';


const createNotificationChannels = async () => {
  await Notifee.createChannel({
    id: 'TCC',
    name: 'TCC',
    importance: AndroidImportance.HIGH,
    vibration: true,
  });
};

// let persistor = persistStore(store);

function App(): React.JSX.Element {

  React.useEffect(() => {
    createNotificationChannels();
  }, []);


  const {
    requestUserPermission,
    subscribeTopic,
    // getFCMToken,
    listenToBackgroundNotifications,
    listenToForegroundNotifications,
    onNotificationOpenedAppFromBackground,
    onNotificationOpenedAppFromQuit,
  } = usePushNotification()


  React.useEffect(() => {
    const listenToNotifications = () => {
      try {
        // getFCMToken();
        requestUserPermission();
        onNotificationOpenedAppFromQuit();
        listenToBackgroundNotifications();
        listenToForegroundNotifications();
        onNotificationOpenedAppFromBackground();
      } catch (error) {
        console.log(error);
      }
    };

    listenToNotifications();
  }, []);

  interface LinkEvent {
    url: string
  }

  const handleUrl = (e: LinkEvent) => {
    const url: string = e.url;
    const route = url?.replace(/.*?:\/\//g, "");
    const id = route.split('/').pop()
    if (route.includes('feeddetail')) {
      navigationRef.current?.navigate('FeedsDetail', { id });
    }
    // Add other unique naviation screens here
  }

  useEffect(() => {
    Linking.addEventListener('url', handleUrl);
  }, [])

  return (
    <Provider store={store}>
      {/* <PersistGate loading={null} persistor={persistor}> */}
      <PaperProvider>
        <AppRoute />
      </PaperProvider>
      {/* </PersistGate> */}
    </Provider>
  );
}

export default App;