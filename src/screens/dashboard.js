import React, { useState, useEffect } from 'react';
import { TopNavigation, Text, useTheme, Layout, Spinner, Button } from '@ui-kitten/components';
import Tab_navigation from '../navigators/tab_navigation';
import { View, StatusBar, BackHandler, RefreshControl,SafeAreaView } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { flagApi } from '../api';
import { ThemeContext } from '../theme-context';
import SafeZone from '../components/dashboard';
import { StackActions } from '@react-navigation/native';
import strings from '../Localization';

import { dot } from '../dot-context';
import PushNotificationIOS from '@react-native-community/push-notification-ios';

const LoadingIndicator = (props) => (
  <View style={{
    position: 'absolute',
    alignSelf: 'center',
    marginTop: 200
  }}>
    <Spinner size='small' />
  </View>
);





export default Dashboard = (props) => {
  // const appState = React.useRef(AppState.currentState);
  // const [appStateVisible, setAppStateVisible] = useState(appState.current);
  const themeContext = React.useContext(ThemeContext);
  const [dot_check, setDot] = React.useState(false);
  const theme = useTheme();
  const [refresh,setRefresh] = useState(false);
  const [msg, setmsg] = useState();
  const [isImp, setIsImp] = useState(false); 
  const [data, setData] = useState(props.alldata.data);
  const [load, setLoad] = useState(0);
  const handleBackButtonClick = () => {
    BackHandler.exitApp();
    return true;
  }


  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(() => {
    setRefresh(true)
    setRefreshing(true)
    setTimeout(() => {
      flagApi(props.route.params.user, 'action')
        .then((resp) => {
          setRefresh(false)
          setRefreshing(false);
          props.navigation.dispatch(
            StackActions.replace('DrawerNavigation', { user: props.route.params.user, data: resp })
        )
        })
        .catch((err) => {
          // CheckDevice(err)
        })
      setRefreshing(false);
    }, 1000)


  }, [refreshing]);


  React.useEffect(() => {
    setLoad(load + 1);
  }, []);

  React.useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', handleBackButtonClick);
    return () => {
      BackHandler.removeEventListener('hardwareBackPress', handleBackButtonClick);
    };
  }, []);







  const SafeElem = () => (
    <Layout level = '4' style={{flex:1}}>
    <ScrollView scrollEnabled={true} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />} >
      <SafeZone />
    </ScrollView>
    </Layout>
  )
  const Navcheck = () => {
    var checkelems = false
    data.forEach(element => {
      if ((element.isImportant) && element.monitoringSituations.length != 0) {
        checkelems = true
      }
    });
    if (checkelems) {
      setIsImp(true);
      return true
    }
    else {
      setIsImp(false)
      return false
    }
  }

  return (
   
    <Layout level="1" style={{ flex: 1 }} key={load} >

      <dot.Provider value={[dot_check, setDot]} >
        <StatusBar backgroundColor={theme['background-basic-color-1']} barStyle={themeContext.theme == "light" ? "dark-content" : "light-content"} {...props} />
       
    <TopNavigation  style = {{marginTop:50}} {...props} title={(<Text style={{ fontWeight: 'bold', fontSize: 18 }}>{strings.dashboard_title}</Text>)} alignment='center' />
        {
          data != null ? <Tab_navigation refresh={refreshing} isImp = {isImp} navcheck={Navcheck} newdata={data} date = {props.alldata.hitTime} {...props} /> : <SafeElem />}
        {/* </ScrollView> */}
        {/* <Button style={{ alignSelf: 'stretch',  }} onPress={() => {
                       requestUserPermission();
                    }}>
                        {strings.give_perm}
                    </Button> */}
      </dot.Provider>
    </Layout>
 

  );
};

