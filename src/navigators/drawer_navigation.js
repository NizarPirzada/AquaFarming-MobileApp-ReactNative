import React, { useEffect, useState } from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer, DrawerActions } from '@react-navigation/native';
import { View, Image, StatusBar, AppState } from 'react-native';
import { Text, Spinner, Drawer, DrawerItem, Button, IndexPath, Divider, Icon, Layout, TopNavigationAction, TopNavigation, Modal, Card, useTheme } from '@ui-kitten/components';
import BottomNavigation from '../navigators/bottom_navigation';
import { ThemeContext } from '../theme-context';
import strings from '../Localization';
import AsyncStorage from '@react-native-community/async-storage';
import messaging from '@react-native-firebase/messaging';
import { Context } from '../notification-context';
import { NavigationContext } from '../navigation_context';
import { flagApi } from '../api';
import _ from 'lodash';
import * as RootNavigation from '../navigators/RootNavigation';


const { Navigator, Screen } = createDrawerNavigator();



const BackIcon = (props) => (
    <Icon {...props} fill='#DB2C66' name='log-out-outline' />
);

const BellIcon = (props) => (
    <Image {...props} source={require('../screens/assets/bell.png')} />
)
const SettingsIcon = (props) => (
    <Image {...props} source={require('../screens/assets/settings.png')} />
)
const toggleIconRight = (props) => (
    <Icon {...props} name='toggle-right-outline' />
);

const toggleIconLeft = (props) => (
    <Icon {...props} name='toggle-left-outline' />
);





export default MyDrawer = React.memo((props) => {

    const themeContext = React.useContext(ThemeContext);
    const [navigationContext, setNavigationContext] = React.useContext(NavigationContext);
    const [switching, setSwitching] = useState(false);
    const [visible, setVisible] = useState(false);
    const [context, setContext] = React.useContext(Context);
    const theme = useTheme();

    const [refresh, setRefresh] = React.useState(false);

    const [data, setData] = React.useState(props.route.params.data);

    const appState = React.useRef(AppState.currentState);
    const [appStateVisible, setAppStateVisible] = React.useState(appState.current);
    const [msg, setmsg] = React.useState();

    const LoadingIndicator = (props) => (
        <Layout style={{ flex: 1 }}>
            <View style={{
                position: 'absolute',
                alignSelf: 'center',
                marginTop: 200,
                backgroundColor: theme['background-basic-color-1']
            }}>
                <Spinner size='small' />
            </View>
        </Layout>
    );


    React.useEffect(() => {
        const unsubscribe = messaging().onMessage(async remoteMessage => {
            console.log(remoteMessage);
            setmsg(remoteMessage);
            setRefresh(true);
            flagApi(props.route.params.user, 'action')
                .then((resp) => {
                    setRefresh(false);
                    setData(resp);
                }).catch((err) => {
                    // CheckDevice(err)
                    setRefresh(false);

                })

        });
        return unsubscribe;
    }, []);



    React.useEffect(() => {
        AppState.addEventListener("change", _handleAppStateChange);

        return () => {
            AppState.removeEventListener("change", _handleAppStateChange);
        };
    }, []);

    const _handleAppStateChange = (nextAppState) => {
        if (
            appState.current.match(/inactive|background/) &&
            nextAppState === "active"
        ) {
            setRefresh(true);

            flagApi(props.route.params.user, 'action')
                .then((resp) => {
                    setRefresh(false);
                    setData(resp);
                })
                .catch((err) => {
                    // CheckDevice(err)
                    setRefresh(false);

                })
            // console.log("App has come to the foreground!");
        }

        appState.current = nextAppState;
        setAppStateVisible(appState.current);
        // console.log("AppState", appState.current);

    };




    const toggleSwitch = () => {
        themeContext.toggleTheme();
        if (switching == true) {
            setSwitching(false)
        }
        else {
            setSwitching(true)
        }
    };


    const navigateBack = () => {
        setVisible(true)
    };
    const removeItemValue = async () => {
        try {
            await AsyncStorage.removeItem('@user_data');
            await AsyncStorage.removeItem('@topic');
            messaging()
                .unsubscribeFromTopic(context)
                .then(() => console.log('Unsubscribed fom the topic!'));
            setContext('null');
            props.navigation.replace('Login');
        }
        catch (exception) {
            // CheckDevice(exception)
            console.log(exception)
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

    useEffect(()=>{
        messaging()
        .getInitialNotification()
        .then(remoteMessage => {
            
            // PushNotificationIOS.presentLocalNotification({
           
            //     alertTitle:remoteMessage.notification.title,
            //     alertBody:remoteMessage.notification.body
                       
            //        });
            if (remoteMessage) {
                getUser()
                    .then(_user => {
                        let user = JSON.parse(_user);
                        flagApi(user, 'action')
                            .then(response => {
                                const cardData = response.data;
                                cardData.forEach(element => {
                                    if (element.flagId == parseInt(remoteMessage.data.FlagType)) {
                                        element.monitoringSituations.forEach(elem => {
                                            if (elem.monitoringStatusId == parseInt(remoteMessage.data.MonitoringStatusId)) {
                                                element.flagId == 4 ? RootNavigation.navigate('Action', {flagId:4, flagName:element.flagName, data: elem, user: user, timeData: new Date(elem.monitoringStatusLastUpdated).getTime() }) : RootNavigation.navigate('Escalated', {flagId:4, flagName:element.flagName, data: elem, user: user, timeData: new Date(elem.monitoringStatusLastUpdated).getTime() })
                                            }
                                        });
                                    }
                                });
                            })
                    })
            }

        })
        .catch((err)=>{
            // CheckDevice(err)
          });
    },[])

    const modalFooter = () => (
        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-end', margin: 10 }}>
            <Button style={{ alignSelf: 'flex-end' }} appearance='ghost' onPress={() => setVisible(false)}>
                {strings.cancel}
            </Button>
            <Button style={{ alignSelf: 'flex-end' }} onPress={() => { removeItemValue() }}>
                {strings.log_out}
            </Button>
        </View>
    )




    const toggleAction = (props) => (
        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: "flex-end", paddingRight: 20,paddingTop:40 }}>
            <TopNavigationAction {...props} icon={switching ? toggleIconLeft : toggleIconRight} onPress={toggleSwitch} />
            <Text style={{ fontWeight: 'bold', textTransform: 'uppercase' }}>{switching ? "Light" : "Dark"}</Text>
        </View>
    )

    const OpenDrawerMenu = () => (
        props.navigation.dispatch(DrawerActions.openDrawer())
    )
    const Feed = () => {
        if (refresh)
            return <LoadingIndicator />
        else
            return <BottomNavigation alldata={data} openDrawerMenu={OpenDrawerMenu} initialScreen={navigationContext == 1 ? 'Sensors' : 'Situations'} {...props} />
    }

    const Settings = () => (
        <View>

        </View>
    )

    const DrawerContent = ({ navigation, state }) => (
        <Layout style={{ flex: 1 }}>
            {/* <StatusBar backgroundColor={theme['background-basic-color-1']} barStyle="light-content" {...props} /> */}
            <TopNavigation accessoryRight={toggleAction} />
            <View style={{
                flex: 1, justifyContent: 'center',
                alignItems: 'center',
            }}>
                <Image style={{
                    width: 150,
                    height: 150,
                    resizeMode: "stretch"
                }} source={require('../screens/assets/splash.png')} />
            </View>
            <Divider />
            <Drawer
                selectedIndex={new IndexPath(state.index)}
                onSelect={index => index != 2 ? navigation.navigate(state.routeNames[index.row]) : null}>
                <DrawerItem title='Home' style={{ display: 'none' }} accessoryLeft={BellIcon} />
                <DrawerItem title='Settings' accessoryLeft={SettingsIcon} />

                <Divider />
            </Drawer>
            <Divider />
            {/* Modal Logout */}
            <DrawerItem onPress={navigateBack} title={() => { return <Text style={{ color: '#DB2C66', flex: 1, fontWeight: 'bold' }}>Log out</Text> }} accessoryLeft={BackIcon} />
            <Divider style={{ marginBottom: 20 }} />
            <Modal
                visible={visible}
                backdropStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.7)' }}
                style={{ padding: 20 }}
            >
                <Card disabled={true} footer={modalFooter} style={{ backgroundColor: theme['background-basic-color-1'] }}>
                    <Text style={{ fontSize: 20, fontWeight: 'bold', lineHeight: 30 }}>{strings.logout_title}</Text>
                    <Text style={{ lineHeight: 30 }}>{strings.logout_desc}</Text>
                </Card>
            </Modal>

        </Layout>
    );
    return (
        // <NavigationContainer independent = {true}>
        <Navigator drawerContent={props => <DrawerContent {...props} />}>
            <Screen name="Situations" component={Feed} />
            <Screen name="Settings" component={Settings} />
        </Navigator>
        // </NavigationContainer>
    );
},(prevProps,nextProps) => {
    if(_.isEqual(prevProps.route.params.data,nextProps.route.params.data)){
        return true
    }
    return false
});