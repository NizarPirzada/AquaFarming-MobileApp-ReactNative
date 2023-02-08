import React, { useState,useRef, useEffect } from 'react';

import { Icon, TopNavigation, TopNavigationAction, Layout, Text, Card, ListItem, Menu, MenuGroup, MenuItem, Divider, CheckBox, Spinner, Button, Toggle, Input, useTheme } from '@ui-kitten/components';
import { StyleSheet, SafeAreaView, View, StatusBar, ScrollView, Image, TouchableWithoutFeedback, Switch } from 'react-native';
import { s3bucket } from '../controls'
import uuid from 'react-native-uuid';
import fs from 'react-native-fs';
import { decode } from 'base64-arraybuffer';
import ImagePicker from 'react-native-image-picker';
import { postApi, flagApi } from '../api';
import CountDown from 'react-native-countdown-component';
import strings from '../Localization';
import moment from 'moment';
import { MeasureICON } from '../components/icons';
import { Bucket } from '../../aws.json';
import { StackActions } from '@react-navigation/native';
import HideWithKeyboard from 'react-native-hide-with-keyboard';




const maindate = (date) => {
    let utctime = date != null ? moment.utc(date, "YYYY/MM/DD hh:mm:ss").fromNow(): "";
    return utctime;
}


const Alldates = ({ date1, date2, styles }) => {
    if (maindate(date1) != maindate(date2)) {
        return (
            <Text style={{ fontSize: 12, fontWeight: 'bold', lineHeight: 24, color: "rgba(255, 255, 255, 0.48)" }}>Since {maindate(date1)}(confirmed {maindate(date2)})</Text>
        )
    }
    else {
        return (
            <Text style={{ fontSize: 12, fontWeight: 'bold', lineHeight: 24, color: "rgba(255, 255, 255, 0.48)" }}>{maindate(date2)}</Text>
        )
    }
}



let dict = {};
const BackIcon = (props) => (<View style={{ paddingRight: 10, paddingBottom: 10, paddingTop: 60 }} >
    <Image {...props} style={{ backgroundColor: "#fffff", width: 18, height: 15, resizeMode: "stretch" }}
        source={require('../screens/assets/IconBack.png')}
    />
</View>);



const CloseIcon = (props) => (
    <Icon {...props} name='close-circle' />
);



const renderNoAnimationIcon = (props) => (
    <Icon
        {...props}
        name='camera-outline'
    />
);

const LoadingIndicator = (props) => (
    <View style={[props.style, styles.indicator]}>
        <Spinner size='small' />
    </View>
);

const back_color = (color) => {
    return {
        backgroundColor: color,
        color: "#FFFFFF"
    }
}


const useInputState = (initialValue = '') => {
    const [value, setValue] = React.useState(initialValue);
    return { value, onChangeText: setValue };
};


const Measures = ({ theme, measure, name, flagId ,colorCode}) => {
    return measure.map((data, i) => {
        if (data.mainReading && data.actualReading) {
            return (
                <View>
                    {/* <ListItem style={{ backgroundColor: theme['background-basic-color-1'] }}
                   key={i} title={data.title} description={data.time} accessoryRight={() => { return <View><View style = {{backgroundColor:'#FF3D71'}}><Text style={{ fontSize: 13 }}>{data.s_temp}</Text></View><View><Text style={{ fontSize: 11 }}>{data.d_temp}</Text></View></View> }} accessoryLeft={SmartphoneIcon} />
                 */}
                    <ListItem style={{ backgroundColor: theme['background-basic-color-1'], marginRight: 10 }}
                        key={i} title={data.measureName} description={<Text style={{ fontSize: 12, fontWeight: 'bold', color: "#c4cad7", lineHeight: 27 }}>{strings.current} : {maindate(data.actualTime)}</Text>} accessoryRight={() => { return <View><View style={{ paddingLeft: 5, paddingRight: 5, borderRadius: 3 },[styles.readingText, data.ruleTriggered ? back_color(colorCode) : null]}><Text style={data.ruleTriggered ? styles.fontCol : null} >{data.mainReading ? data.mainReading.trim() : null} {data.unitName ? data.unitName.trim() : null}</Text></View><View style={{ paddingLeft: 5, paddingRight: 5 }}><Text style={{ fontSize: 12, fontWeight: 'bold', textAlign: "center", color: "#c4cad7", lineHeight: 27 }}>{data.actualReading} {data.unitName}</Text></View></View> }}
                        accessoryLeft={() => { return <MeasureICON flagId={flagId} name={name} rule={data.ruleTriggered} icon={data.icon} /> }} />
                    <Divider style={{ height: 2 }} />

                </View>
            )
        } else {
            return false
        }

    })
}

const AllCards = ({ theme, actions: { actions, setActions }, data, actionPerformedId: { actionPerformedId, setActionPerformedId } }) => {
    const temp = [...actionPerformedId];
    return data.actions.map((data, i) => {
        return (
            <ListItem
                style={{ backgroundColor: theme['background-basic-color-1'] }}
                key={i}
                title={data.actionName.trim() == "Other" || data.actionName.trim() == strings.More ? strings.More : data.actionName.trim()}
                description={data.actionDesc.trim() == strings.More_Desc || data.actionDesc.trim() == "Use this option to write a comment." ? strings.More_Desc : data.actionDesc.trim()}
                accessoryLeft={() => (<CheckBox style={{ paddingRight: 10 }} checked={
                    actions[data.actionName]
                } onChange={
                    () => {
                        if (!actions[data.actionName]) {
                            temp.push(data.actionId)
                        }
                        else {
                            const index = actionPerformedId.indexOf(data.actionId);
                            if (index > -1) {
                                temp.splice(index, 1);
                            }
                        }
                        setActions({
                            ...actions,
                            [data.actionName]: !actions[data.actionName]
                        });
                        setActionPerformedId(temp);
                    }
                } ></CheckBox>)}
            />
        )
    })
}




export default Actions = ({ route, navigation }) => {
    const [selectedIndex, setSelectedIndex] = React.useState(null);
    const [data, setData] = useState(route.params.data);
    const [user, setUser] = useState(route.params.user);
    const [colorCode] = useState(route.params.colorCode) 
    const [measure, setMeasure] = useState(strings.measure);
    var duration = moment.duration(moment().diff(route.params.date));
    const [checkCollapsed,setCheckCollapsed] = useState(true);
    const [checkMeasureCollapsed,setCheckMeasureCollapsed] = useState(true);
    const [actionPerformedId, setActionPerformedId] = useState([]);
    data.actions.forEach((element, i) => {
        dict[element.actionName] = false
    });
    const name = route.params.flagName;
    let flagId = route.params.flagId;
    const theme = useTheme();
    const [imagePath, setImagePath] = useState('');
    const [photo, setPhoto] = React.useState('');
    const [actions, setActions] = React.useState(dict)
    const [flag, setFlag] = React.useState(false);
    const [load, setLoad] = React.useState(false);
    const multilineInputState = useInputState();
    const multilineInputState_2 = useInputState();
    const navigateBack = () => {
        navigation.goBack();
    };

   
    const menuCheck =() =>{
        setCheckCollapsed(false);
    }


    const RenderImage = ({ uri, set }) => (
        <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
            <Image style={{ width: 50, height: 50 }} source={{ uri: uri }} />
            <Button size='giant' status='danger' appearance='ghost' style={{ bottom: 20, left: 10, position: 'absolute' }} accessoryLeft={CloseIcon} onPress={() => { set(''); setImagePath("") }} />
        </View>
    );


    const PostData = () => {
        setLoad(true);
        var postObj = {
            "ActionsPerformed": actionPerformedId,
            "Comment": multilineInputState_2.value,
            "IsFalseAlarm": flag,
            "ImagePath": imagePath,
            "FlagName": "watchlist",
            "FlagId": 3,
            "EscalatedText": multilineInputState.value,
            "UserId": user.userId,
            "MonitoringStatusId": data.monitoringStatusId,
            "MonitoringId": data.monitoringId,
            "CompanyId": user.companyId
        }
        postApi(postObj)
            .then(response => {
                console.log(response)
                setTimeout(() => {
                    flagApi(user, 'action')
                        .then((resp) => {
                            const cardData = resp;
                            navigation.dispatch(
                                StackActions.replace('DrawerNavigation', { user: user, data: cardData })
                            )
                        })
                }, 2000)
            })
            .catch(err => {
                console.log(err)
                setLoad(false);
            })
    }

    const BackAction = () => (
        <TopNavigationAction icon={BackIcon} onPress={navigateBack} />
    );

    const handleImagePicker = () => {
        const options = {
            noData: true
        };
        ImagePicker.showImagePicker(options, response => {
            if (response.uri) {
                setPhoto(response.uri)
                const file = {
                    uri: response.uri,
                    name: uuid.v4() + ".jpeg",
                    type: 'image/jpeg',
                };
                setLoad(true)
                uploadImageOnS3(file);
            }
        })
    }

    const uploadImageOnS3 = async (file) => {


        let contentType = 'image/jpeg';
        let contentDeposition = 'inline;filename="' + file.name + '"';
        const base64 = await fs.readFile(file.uri, 'base64');
        const arrayBuffer = decode(base64);
        const params = {
            Bucket: Bucket,
            Key: file.name,
            Body: arrayBuffer,
            ContentDisposition: contentDeposition,
            ContentType: contentType,
        };
        s3bucket.upload(params, (err, data) => {
            if (err) {
                // CheckDevice(err)
                console.log(err);
                setImagePath('Error in loading');
                setLoad(false);
            }
            else {
                // console.log('success');
                //  console.log("Response URL : " + data.Location);
                setImagePath(data.Location);
                setLoad(false);
            }
        });
    };


    const validation = () => {
        // console.log(actionPerformedId);
        if (flag) { return false }
        else if (actionPerformedId.length == 0 && !flag) { return true }
        else if (actionPerformedId.includes(0) && multilineInputState_2.value == '') { return true }
        else { return false }
    }


    return (
        <Layout style={{ flex: 1 }} >
            <StatusBar backgroundColor={colorCode} barStyle="light-content" />
           
            <TopNavigation  title={()=>(<View style = {{marginTop:50}}><Text style={{ fontWeight: 'bold', fontSize: 18, color: "#ffffff" }}>{name}</Text></View>)} style={{ backgroundColor:`${colorCode}` }} alignment='center' accessoryLeft={BackAction} />
          
            <Layout style={styles.layout} level='4'>
                <ScrollView>
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', backgroundColor: `${colorCode}`, padding: 25, borderBottomEndRadius: 20, borderBottomStartRadius: 20 }}>
                        <View>
                            {data.monitoringStatusMessage.trim() != "" ? <Text style={{ fontSize: 16, fontWeight: '600', lineHeight: 24, color: "#FFFFFF" }}>
                                {data.monitoringStatusMessage.trim()}
                            </Text> : null}
                            <Alldates date1={data.monitoringStatusTimeStamp} date2={data.monitoringStatusLastUpdated} styles={styles} />
                        </View>
                    </View>
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center',marginTop:7 }}>

                    <Text  style={{ textAlign: "center" ,color:`${colorCode}`,fontSize:11}}>
                        {strings.time_action} </Text>

                    <CountDown

                        until={data.criticalTimeSeconds - duration.asSeconds()}
                        size={6}
                        digitStyle={{ backgroundColor: theme['background-basic-color-4'], borderWidth: 0, borderColor: '#1CC625', margin: 0,marginTop:-1.2 }}
                        digitTxtStyle={{ color: `${colorCode}`, fontSize: 9 }}
                        timeLabelStyle={{ color: `${colorCode}`, fontWeight: 'bold' }}
                        separatorStyle={{ color: `${colorCode}`, fontSize: 9,marginTop:-2}}
                        timeToShow={['H','M', 'S']}
                        timeLabels={{ m: null, s: null }}
                        showSeparator
                    />
                    <Text  style={{ textAlign: "center" ,color:`${colorCode}`,fontSize:11}}>
                        {strings.sec} </Text>

                </View>
                    <View style={{ marginTop: 7 }}>
                      
                      <HideWithKeyboard>
                        <Card style={{ backgroundColor: theme['background-basic-color-1'], borderColor: theme['border-basic-color-3'] }}>
                            <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                                <View style={{ flex: 2 }}>
                                    <Text style={{ fontSize: 14, fontWeight: 'bold', lineHeight: 24, color: "#8F9BB3" }}>
                                        {strings.location}</Text>
                                    <Text style={{ fontSize: 16, fontWeight: 'bold', lineHeight: 24 }}>
                                        {data.systemName.trim()} - {data.monitoringName} / {data.situationName.trim()}</Text>
                                    <Text style={{ fontSize: 12, fontWeight: '600', lineHeight: 24, color: "#8F9BB3" }}>
                                        {data.monitoringDesc.trim()} </Text>
                                </View>

                                {/* <View>
                                    <Image style={{ borderRadius: 10 }} source={require('../screens/assets/Screenshot.png')} />
                                </View> */}
                            </View>

                        </Card>
                        <Card style={{ backgroundColor: theme['background-basic-color-1'], borderColor: theme['border-basic-color-3'] }}>
                            <Menu
                                style={{ marginRight: -14, marginLeft: -14, backgroundColor: theme['background-basic-color-1'] }}
                                
                                onSelect={index => setSelectedIndex(index)}>
                                <MenuGroup  style={{ backgroundColor: theme['background-basic-color-1'] }} onPressOut = {menuCheck} title={<Text style={{ fontSize: 14, fontWeight: 'bold', lineHeight: 24 }}>
                                    {measure} </Text>}>
                                     
                                    <Divider style={{ height: 2,marginTop: 12  }} />
                                  
                                    <Measures name={strings.action_req} flagId={flagId} measure={data.measurements} colorCode = {colorCode} theme={theme} />
                               
                                    <Divider style={{ height: 0.5 }} />
                                   

                                </MenuGroup>
                            </Menu>
                            {checkCollapsed ? 
                            <View style={{ marginRight: -14, marginLeft: -14, backgroundColor: theme['background-basic-color-1'] }}>
                                  <Divider style={{ height: 2,marginTop: 12  }} />
                            <Measures name={strings.action_req} flagId={flagId} measure={data.measurements} colorCode = {colorCode} theme={theme} />
                            </View>
                        :null}
                        </Card>
                      
                        </HideWithKeyboard>
                        <View style={{ marginTop: 15, backgroundColor: theme['background-basic-color-1'] }}>
                            <Card style={{ backgroundColor: theme['background-basic-color-1'], borderColor: theme['border-basic-color-3'] }}>
                               <HideWithKeyboard>
                                <View style={{ flex: 2 }}>
                                    <Text style={{ fontSize: 14, fontWeight: 'bold', lineHeight: 24, color: "#8F9BB3" }}>
                                        {strings.detail_screen_action_title} </Text>
                                </View>
                                </HideWithKeyboard>
                                <View>
                                    <HideWithKeyboard>
                                    <AllCards data={data} theme={theme} actions={{ actions, setActions }} actionPerformedId={{ actionPerformedId, setActionPerformedId }} />
                                    </HideWithKeyboard>
                                    <View>
                                        {actions['Other'] ? <Input
                                            multiline={true}
                                            textStyle={{ minHeight: 64 }}
                                            label={(<Text style={{ fontSize: 14, fontWeight: 'bold', lineHeight: 24, color: "#8F9BB3" }}>{strings.req_res_title}</Text>)}
                                            placeholder={strings.req_res_placeholder}
                                            {...multilineInputState_2}
                                        /> : null}
                                    </View>

                                </View>

                            </Card>
                        </View>
                        <View style={{ marginTop: 15, backgroundColor: theme['background-basic-color-1'] }}>
                            <Card style={{ backgroundColor: theme['background-basic-color-1'], borderColor: theme['border-basic-color-3'] }}>
                                <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                                    <View style={{ flex: 2 }}>
                                        <Text style={{ fontSize: 14, color: "#8F9BB3", fontWeight: 'bold', lineHeight: 24, paddingTop: 10 }}>
                                            {strings.img} </Text>
                                    </View>
                                    <View>
                                        <TouchableWithoutFeedback>
                                            <View>
                                                {photo ? <RenderImage uri={photo} set={setPhoto} /> : <Button
                                                    appearance='ghost'
                                                    status='primary'
                                                    style={{ fontSize: 14, fontWeight: 'bold', padding: 0 }}
                                                    accessoryLeft={renderNoAnimationIcon}
                                                    onPress={() => { handleImagePicker() }}>
                                                    {strings.add_pic}
                                                </Button>}

                                            </View>
                                        </TouchableWithoutFeedback>
                                    </View>
                                </View>

                            </Card>
                        </View>
                        <View style={{ marginTop: 15 }}>
                            <Card style={{ backgroundColor: theme['background-basic-color-1'], borderColor: theme['border-basic-color-3'] }}>
                                <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                                    <View style={{ flex: 2 }}>
                                        <Text style={{ fontSize: 16, fontWeight: 'bold', lineHeight: 24 }}>
                                            {strings.alarm} </Text>
                                        <Text style={{ fontSize: 12, fontWeight: '600', lineHeight: 24, color: "#8F9BB3" }}>
                                            {strings.alarm_desc}  </Text>
                                    </View>
                                    <View>
                                        <Toggle style={{ thumbBackgroundColor: "#ffffff" }} checked={flag} onChange={() => { setFlag(!flag) }} />
                                    </View>
                                </View>
                            </Card>
                        </View>
                        <View style={{ marginTop: 15, flex: 1, justifyContent: "center", alignItems: "center" }}>
                            <Button style={{ alignSelf: 'stretch', marginLeft: 20, marginRight: 20, marginBottom: 20, borderRadius: 10 }} appearance='outline' onPress={() => { navigation.push('MyModal', { user: user, colorCode: colorCode , flagId : flagId ,monitorId: data.monitoringStatusId, m_id: data.monitoringId, imagePath: imagePath }) }}>
                                {strings.alert_team}
                            </Button>
                        </View>
                    </View>
                </ScrollView>
                <View style={{ backgroundColor: theme['background-basic-color-1'], flex: 1, justifyContent: "center", alignItems: "center", paddingTop: 40, paddingBottom: 40, paddingLeft: 20, paddingRight: 20 }}>
                    {load ? <Button style={{ alignSelf: 'stretch',borderRadius: 10 }} appearance='outline' accessoryLeft={LoadingIndicator}>
                        {strings.Loading}
                    </Button> : <Button style={{ alignSelf: 'stretch', borderRadius: 10 }} disabled={validation()} appearance='filled' onPress={() => { PostData() }}>
                        {strings.resolve}
                    </Button>}

                  
                </View>
            </Layout>
        </Layout>
    );
};
const styles = StyleSheet.create({
    layout: {
        flex: 1,
        flexDirection: "column",
    },
    readingText: {
        fontSize: 13, textAlign: "center", paddingLeft: 10, paddingRight: 10, borderRadius: 5
    },
    readingTextRule: {
        backgroundColor:"#FF5927",fontSize: 13, textAlign: "center", paddingLeft: 10, paddingRight: 10, borderRadius: 5
    },
    visibility : {
        display:'none'
    },
    fontCol : {
        color:"#ffffff"
    }
});