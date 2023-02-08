import React, { Component } from 'react';
import * as eva from '@eva-design/eva';
import { Layout, Text, Button } from '@ui-kitten/components';
import { StyleSheet, View, Image, ProgressBarAndroid } from 'react-native';
import * as Progress from 'react-native-progress';
// import PushNotificationIOS from "@react-native-community/push-notification-ios";
// import PushNotification from "react-native-push-notification";
import AsyncStorage from '@react-native-community/async-storage';
import messaging from '@react-native-firebase/messaging';
import string from '../Localization';
// import {CheckDevice} from '../components/deviceInfo';




export default class Intro_fifth_Screen extends Component {

    constructor() {
        super()
        // PushNotification.configure({
        //     largeIcon: "vector",
        //     smallIcon: "vector",
        //     permissions: {
        //         alert: true,
        //         badge: true,
        //         sound: true,
        //     },
        //     onNotification: function(notification) {
        //         console.log("NOTIFICATION:", notification.action);
        //       },

        //     popInitialNotification: true,
        //     requestPermissions: true,
        // });
    }
    
    

    render() {
        return (
            <Layout style={styles.layout} level = "1">
                <View style={{ flex: 1, justifyContent: "flex-start" }}>
                <Progress.Bar style={{ marginTop: 70 }} borderWidth = {0} unfilledColor = "#E4E9F2" height = {7} width = {100} indeterminate={false} progress={1.0} styleAttr="Horizontal" color="#2196F3" />
                </View>
                <View style={{ flex: 1, justifyContent: "center", alignItems: 'center' }}>
                    <Image style={{ marginTop: 40, marginBottom: 80 ,width: 250,
    height: 250,resizeMode: 'stretch'}} source={require('../screens/assets/undraw_my_notifications_rjej_2.png')} />
                </View>
                <View style={[styles.layout, styles.input]}>
                    <View style={{ marginBottom: 50 }}>
                        <Text style={{ textAlign: 'center', fontWeight: "bold" }} category='h4'>{string.screen_title_5}</Text>
                        <Text style={{ textAlign: 'center', }} category='s1'>{string.screen_desc_5}</Text>
                    </View>
                   
                </View>
                <View style={[{ alignSelf: 'stretch', justifyContent:'space-between',marginBottom:30 },styles.input]}>
                    <Button style={{ alignSelf: 'stretch', borderRadius: 10 }} onPress={() => {
                        this.storeData()
                    }}>
                        {string.give_perm}
                    </Button>
                    
                    </View>
            </Layout>
        );
    }
    storeData = async () => {
        try {
            await AsyncStorage.setItem('@storage_Key', 'Done')
            // PushNotification.localNotification({
            //     largeIcon: "vector",
            //     smallIcon: "vector",
            //     title: "UrbanBlue",
            //     message: "Notifications Activited", // (required)
            // });
            const authorizationStatus = await messaging().requestPermission();
            if (authorizationStatus){
                console.log('permission granted')
            }
            this.props.navigation.replace("Login")
        } catch (e) {
            // CheckDevice(e)
            console.log(e)
        }
    }

};
const styles = StyleSheet.create({
    layout: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
    },
    input: {
        marginLeft: 20,
        marginRight: 20,
        marginTop: 50
    }
});