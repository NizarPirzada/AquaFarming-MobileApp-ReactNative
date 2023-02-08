import React, { Component } from 'react';
import * as eva from '@eva-design/eva';
import { Layout, Text } from '@ui-kitten/components';
import AsyncStorage from '@react-native-community/async-storage';
import { StyleSheet, View, Image, Alert, BackHandler } from 'react-native';
// import PushNotification from 'react-native-push-notification';
import messaging from '@react-native-firebase/messaging';
import firebase from '@react-native-firebase/app';
import { flagApi } from '../api';
import strings from '../Localization';
// import {CheckDevice} from '../components/deviceInfo';
import * as RootNavigation from '../navigators/RootNavigation';


export default class SplashScreen extends Component {
    constructor(props) {
        super(props);
        setTimeout(() => {
            this.getData()
        }, 5000)
    }
    componentDidMount() {
        messaging().onNotificationOpenedApp(remoteMessage => {
            console.log("onNotificationOpenedApp =>",remoteMessage);
            if (Object.keys(remoteMessage).length != 0) {
                this.getUser()
                    .then(_user => {
                        let user = JSON.parse(_user);
                        flagApi(user, 'action')
                            .then(response => {
                             //   console.log(response);
                                const cardData = response.data;
                                cardData.forEach(element => {
                                    if (element.flagId == parseInt(remoteMessage.data.FlagType)) {
                                        element.monitoringSituations.forEach(elem => {
                                            if (elem.monitoringStatusId == parseInt(remoteMessage.data.MonitoringStatusId)) {
                                                element.flagId == 4 ? this.props.navigation.push('Action', { data: elem, user: user, timeData: new Date(elem.monitoringStatusLastUpdated).getTime() }) : this.props.navigation.push('Escalated', { data: elem, user: user, timeData: new Date(elem.monitoringStatusLastUpdated).getTime() })
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
        });

        


    }
    timeoutPromise(ms, promise) {
        return new Promise((resolve, reject) => {
            const timeoutId = setTimeout(() => {
                reject("An Error Occurred")
            }, ms);
            promise.then(
                (res) => {
                    clearTimeout(timeoutId);
                    resolve(res);
                },
                (err) => {
                    clearTimeout(timeoutId);
                    reject(err);
                }
            );
        })
    }

    getUser = async () => {
        try {
            const value = await AsyncStorage.getItem('@user_data')
            return value
        }
        catch (exception) {
            console.log(exception);
            return null
        }
    }

    getData = async () => {
        try {
            const value = await AsyncStorage.getItem('@storage_Key')
            const alldata = await AsyncStorage.getItem('@user_data')
            if (alldata != null) {
                let data = JSON.parse(alldata);
                this.timeoutPromise(60000, flagApi(data, 'action'))
                    .then(response => {
                        const cardData = response;
                        this.props.navigation.replace('DrawerNavigation', { user: data, data: cardData })
                    })
                    .catch(error => {
                        // CheckDevice(error)
                        // Alert.alert(strings.net_error)
                        // setTimeout(() => {
                        //     BackHandler.exitApp();
                        // }, 2000)

                    })
            }
            else if (value === 'Done') {
                this.props.navigation.replace("Login")
            }
            else {
                this.props.navigation.replace("IntoNavigator")
            }
        } catch (e) {
            // CheckDevice(e)
            console.log(e)
        }
    }
    render() {
        return (
            <Layout level="1" style={styles.layout}>
                <Image style={styles.logoImage} source={require('../screens/assets/splash.png')} />
            </Layout>
        );
    }
};
const styles = StyleSheet.create({
    layout: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        fontSize: 20,
        fontWeight: "bold",
    },
    span: {
        backgroundColor: '#3366ff',
        color: 'white',
    },
    logoImage: {
        margin: 15,
        width: 150,
        height: 150,
        resizeMode: "stretch"
    }
});