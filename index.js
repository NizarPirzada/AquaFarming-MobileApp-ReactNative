/**
 * @format
 */
import React from 'react';
import {AppRegistry} from 'react-native';
import App from './src/App';
import {name as appName} from './app.json';
import messaging from '@react-native-firebase/messaging';
//import PushNotification from "react-native-push-notification";

messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log("Message handled in background" ,remoteMessage);
  });

AppRegistry.registerComponent(appName, () => App);
