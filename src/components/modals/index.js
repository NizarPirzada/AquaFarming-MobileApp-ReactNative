import React, { useState } from 'react';

import { Icon, TopNavigation, TopNavigationAction, Layout, Input, Button, useTheme ,Spinner} from '@ui-kitten/components';
import { StyleSheet, SafeAreaView, View, StatusBar, KeyboardAvoidingView } from 'react-native';
import { postApi,flagApi,postNotification } from '../../api';
import strings from '../../Localization';
import { ThemeContext } from '../../theme-context';
import { StackActions } from '@react-navigation/native';

const BackIcon = (props) => (
    <View style={{ paddingRight: 10, paddingBottom: 10, paddingTop: 60 }}>
    <Icon {...props} name='close-outline' />
    </View>
);
const useInputState = (initialValue = '') => {

    const [value, setValue] = React.useState(initialValue);
    return { value, onChangeText: setValue };
};

const keyboardVerticalOffset = Platform.OS === 'ios' ? 10 : 0

export default ModalScreen = ({ route, navigation }) => {
    let user = route.params.user;
    let monitorid = route.params.monitorId;
    let ImagePath = route.params.imagePath;
    let colorCode = route.params.colorCode;
    let flagId = route.params.flagId;
    let m_id = route.params.m_id;
    const [load,setLoad] = useState(false);
    const theme = useTheme();
    const multilineInputState = useInputState();
    const navigateBack = () => {
        navigation.goBack();
    };
    const themeContext = React.useContext(ThemeContext);
    const BackAction = () => (
        <TopNavigationAction icon={BackIcon} onPress={navigateBack} />
    );

    const LoadingIndicator = (props) => (
        <View style={[props.style, styles.indicator]}>
            <Spinner size='small' />
        </View>
    );

    const escalatehandle = () => {
        setLoad(true);
        var postObj = {
            "ActionsPerformed": [],
            "Comment": "",
            "IsFalseAlarm": false,
            "ImagePath": ImagePath,
            "FlagName": "escalated",
            "FlagId":flagId == 4 ? 5 : flagId == 10 ? 9 :null,
            "EscalatedText": multilineInputState.value,
            "MonitoringId":m_id,
            "UserId": user.userId,
            "MonitoringStatusId": monitorid,
            "CompanyId": user.companyId
        }
        postApi(postObj)
            .then(response => {
                setTimeout(() => {
                    flagApi(user,'action')
                    .then((resp) =>{
                        setLoad(false);
                        const cardData = resp;
                        navigation.dispatch(
                            StackActions.replace('DrawerNavigation', { user: user, data: cardData })
                        )
                        // let notification_data = {
                        //     "Title":"Action Escalated",
                        //     "Message":multilineInputState.value,
                        //     "Topic":"test"
                        // };
                        // postNotification(notification_data)
                        // .then((response)=>{
                        //     console.log(response);
                           
                        // })
                    })
                }, 1000)
            })
            .catch(err =>{
                setLoad(false);
            })
    }
    return (
            <Layout style={styles.layout} level = "1">
                  <StatusBar backgroundColor={colorCode} barStyle= {themeContext.theme == "light" ? "dark-content" : "light-content"}  />
            <TopNavigation style={{ backgroundColor: theme['background-basic-color-1'] }} alignment='center' accessoryLeft={BackAction} />
            <KeyboardAvoidingView style = {{flex:1,justifyContent:'center',alignItems:'center',marginTop:80}} behavior='padding' keyboardVerticalOffset={keyboardVerticalOffset}>
                <View style={{ backgroundColor: theme['background-basic-color-1'], flex: 1, justifyContent: "center", alignItems: "center", paddingBottom: 80, paddingLeft: 20, paddingRight: 20 }}>
                    <View>
                        <Input
                            multiline={true}
                            style={{width:"100%"}}
                            textStyle = {{height:120}}
                            containerStyle = {{ paddingHorizontal: 0 }}
                            label={strings.req_alert_title}
                            placeholder={strings.req_alert_msg_placeholder}
                            {...multilineInputState}
                        />
                    </View>
                </View>
                <View style={{ backgroundColor: theme['background-basic-color-1'], flex: 1,  paddingLeft: 20, paddingRight: 20,marginTop:50,alignSelf: 'stretch', justifyContent:'space-between', }}>
                { load ? <Button style={{ alignSelf: 'stretch', borderRadius: 10 }} appearance='outline' accessoryLeft={LoadingIndicator}>
                                {strings.Loading}
                </Button>:
                    <Button style={{ alignSelf: 'stretch', borderRadius: 10 }} disabled={multilineInputState.value == '' ? true : false} appearance='filled' onPress={() => { escalatehandle() }}>
                        {strings.confirm}
                             </Button>}
                </View>
                </KeyboardAvoidingView>
            </Layout>
    );
};
const styles = StyleSheet.create({
    layout: {
        flex: 1,
        flexDirection: "column",
    },
});