import React, { useEffect } from 'react';
import * as eva from '@eva-design/eva';
import { StatusBar, Linking } from 'react-native';
import { ApplicationProvider, IconRegistry } from '@ui-kitten/components';
import { EvaIconsPack } from '@ui-kitten/eva-icons';
import HomeScreen from '../src/navigators/stack_navigation';
import { ThemeContext } from './theme-context';
import messaging from '@react-native-firebase/messaging';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import { Context } from './notification-context';
import AsyncStorage from '@react-native-community/async-storage';
import Smartlook from 'smartlook-react-native-wrapper';
import { getAppstoreAppMetadata } from "react-native-appstore-version-checker";
import DeviceInfo from 'react-native-device-info';
import SplashScreen from 'react-native-splash-screen';
import {NavigationContext} from './navigation_context';
import * as RootNavigation from '../src/navigators/RootNavigation';
import { flagApi } from '../src/api';

// import { CheckDevice } from '../src/components/deviceInfo';

const defaultAppMessaging = messaging().getToken();
export default () => {
  const [theme, setTheme] = React.useState('light');
  const [context, setContext] = React.useState("null");
  const [navigationContext,setNavigationContext] = React.useState(0);
  const toggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);
  };

  const getData = async () => {
    try {
      const value = await AsyncStorage.getItem('@topic')
      return value
    } catch (exception) {
      console.log(exception);
      return null
    }
  }

  const getUser = async () => {
    try {
        const value = await AsyncStorage.getItem('@user_data')
        return value
    }
    catch (exception) {
        console.log(exception);
        return null
    }
}

  // getAppstoreAppMetadata("com.urbanbluestaging") //put any apps packageId here
  //   .then(metadata => {
  //     if (metadata.version != DeviceInfo.getVersion()) {
  //       const PLAY_STORE_LINK = `https://play.google.com/store/apps/details?id=com.urbanbluestaging`;
  //       Linking.openURL(PLAY_STORE_LINK).catch(err =>
  //         console.error("An error occurred", err)
  //       );
  //     }
  //   })
  //   .catch(err => {
  //     console.log("error occurred", err);
  //   });
  // useEffect(() => {
  //   CheckDevice()
  // }, [])

  useEffect(() => {
    SplashScreen.hide();
    Smartlook.setupAndStartRecording("692746764a5385a3555a5265639f934d42af9747");
    console.log('Rec started');



  }, [])




  useEffect(() => {
    getData()
      .then(response => {
        if (response != null) {
          console.log("App.js", response.toString());
          setContext(response.toString())
        }
        messaging()
          .subscribeToTopic(context)
          .then(() => {
            console.log('Subscribed to topic!')
            console.log(context);
          })
          .catch((err) => {
            // CheckDevice(err)
          })
      })
      .catch((err) => {
        // CheckDevice(err)
      })



    const unsubscribe = messaging().onMessage(async remoteMessage => {
      const message = remoteMessage
      PushNotificationIOS.presentLocalNotification({
               
        alertTitle:remoteMessage.notification.title,
        alertBody:remoteMessage.notification.body
               
           });
    });
    return unsubscribe;
   }, [context]);


   useEffect(() => {
    PushNotificationIOS.addEventListener('localNotification', onRemoteNotification);
  });





  const onRemoteNotification = (notification) => {
    const isClicked = notification.getData().userInteraction === 1;
    if (isClicked) {
      if (Object.keys(notification).length != 0) {
        getUser()
            .then(_user => {

                let user = JSON.parse(_user);
                flagApi(user, 'action')
                    .then(response => {
                     //   console.log(response);
                        const cardData = response.data;
                        cardData.forEach(element => {
                            if (element.flagId == parseInt(notification._data.FlagType)) {
                                element.monitoringSituations.forEach(elem => {
                                    if (elem.monitoringStatusId == parseInt(notification._data.MonitoringStatusId)) {
                                        !element.isNot ? RootNavigation.navigate('Action', {flagId:4,colorCode:element.colorCode, flagName:element.flagName, data: elem, user: user, timeData: new Date(elem.monitoringStatusLastUpdated).getTime() }) : RootNavigation.navigate('Escalated', {flagId:4,colorCode:element.colorCode, flagName:element.flagName, data: elem, user: user, timeData: new Date(elem.monitoringStatusLastUpdated).getTime() })
                                    }
                                });
                            }
                        });
                    })
                    .catch((err)=>{
                        // CheckDevice(err)
                      })
            })
    }
        } else {
      // Do something else with push notification
    }
  };



  return (<>
    <IconRegistry icons={EvaIconsPack} />
    <NavigationContext.Provider value = {[navigationContext,setNavigationContext]}>
    <Context.Provider value={[context, setContext]}>
      <ThemeContext.Provider value={{ theme, toggleTheme }}>
        <ApplicationProvider {...eva} theme={eva[theme]}>
          <StatusBar backgroundColor={theme == 'light' ? '#FFFFFF' : '#101426'} barStyle={theme == 'light' ? 'dark-content' : 'light-content'} />
          <HomeScreen />
        </ApplicationProvider>
      </ThemeContext.Provider>
    </Context.Provider>
    </NavigationContext.Provider>
  </>
  );
};