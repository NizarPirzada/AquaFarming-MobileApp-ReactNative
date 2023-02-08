import React, { useState } from 'react';

import { Icon, TopNavigation, TopNavigationAction, Layout, Text, Card, Button, Input, useTheme, Spinner, Menu, MenuGroup, ListItem, Divider } from '@ui-kitten/components';
import { StyleSheet, SafeAreaView, View, StatusBar, ScrollView, Image, TouchableWithoutFeedback,KeyboardAvoidingView } from 'react-native';
import CountDown from 'react-native-countdown-component';
import uuid from 'react-native-uuid';
import fs from 'react-native-fs';
import { decode } from 'base64-arraybuffer';
import ImagePicker from 'react-native-image-picker';
import { flagApi, postApi } from '../api';
import strings from '../Localization';
import moment from 'moment';
import { MeasureICON } from '../components/icons';
import { s3bucket } from '../controls'
import {Bucket} from '../../aws.json';
import { StackActions } from '@react-navigation/native';
import HideWithKeyboard from 'react-native-hide-with-keyboard';

// import {CheckDevice} from "../components/deviceInfo";


const maindate = (date) => {
    let utctime = date != null ? moment.utc(date, "YYYY/MM/DD hh:mm:ss").fromNow(): "";
    return utctime;
}


const Alldates = ({ date1, date2, styles }) => {
    if (maindate(date1) != maindate(date2)) {
        return (
            <Text style={{ fontSize: 12, fontWeight: 'bold', lineHeight: 24, color: "rgba(255, 255, 255, 0.48)" }}>For {maindate(date1).replace(' ago', '')}, confirmed {maindate(date2)}</Text>
        )
    }
    else {
        return (
            <Text style={{ fontSize: 12, fontWeight: 'bold', lineHeight: 24, color: "rgba(255, 255, 255, 0.48)" }}>{maindate(date2)}</Text>
        )
    }
}


const BackIcon = (props) => (
    <View style={{ paddingRight: 10, paddingBottom: 10, paddingTop: 60 }}>
        <Image {...props} style={{ backgroundColor: "#fffff", width: 18, height: 15, resizeMode: "stretch" }} source={require('../screens/assets/IconBack.png')} />
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

const useInputState = (initialValue = '') => {

    const [value, setValue] = React.useState(initialValue);
    return { value, onChangeText: setValue };
};

const back_color = (color) => {
    return {
        backgroundColor: color,
        color: "#FFFFFF"
    }
}



const Measures = ({ theme, measure, name ,flagId,colorCode}) => {
    return measure.map((data, i) => {
        if (data.mainReading && data.actualReading) {
            return (
                <View>
                    {/* <ListItem style={{ backgroundColor: theme['background-basic-color-1'] }}
                   key={i} title={data.title} description={data.time} accessoryRight={() => { return <View><View style = {{backgroundColor:'#FF3D71'}}><Text style={{ fontSize: 13 }}>{data.s_temp}</Text></View><View><Text style={{ fontSize: 11 }}>{data.d_temp}</Text></View></View> }} accessoryLeft={SmartphoneIcon} />
                 */}
                    <ListItem style={{ backgroundColor: theme['background-basic-color-1'], marginRight: 10 }}
                        key={i} title={data.measureName} description={<Text style={{ fontSize: 12, fontWeight: 'bold', color: "#c4cad7", lineHeight: 27 }}>{strings.current} : {maindate(data.actualTime)}</Text>} accessoryRight={() => { return <View><View style={{ paddingLeft: 5, paddingRight: 5, borderRadius: 3 }, [styles.readingText, data.ruleTriggered ? back_color(colorCode) : null]}><Text style={data.ruleTriggered ? styles.fontCol : null}>{data.mainReading ? data.mainReading.trim() : null} {data.unitName ? data.unitName.trim() : null}</Text></View><View style={{ paddingLeft: 5, paddingRight: 5 }}><Text style={{ fontSize: 12, fontWeight: 'bold', textAlign: "center", color: "#c4cad7", lineHeight: 27 }}>{data.actualReading} {data.unitName}</Text></View></View> }}
                        accessoryLeft={() => { return <MeasureICON name={name} flagId={flagId} rule={data.ruleTriggered} icon={data.icon} /> }} />
                    <Divider style={{ height: 2 }} />

                </View>
            )
        } else {
            return false
        }

    })
}


export default Escalated = ({ route, navigation }) => {
    const [checkCollapsed,setCheckCollapsed] = useState(true);
    const [selectedIndex, setSelectedIndex] = React.useState(null);
    let data = route.params.data;
    let user = route.params.user;
    let flagId = route.params.flagId;
    let name = route.params.flagName;
    let colorCode = route.params.colorCode;
    const theme = useTheme();
    const [measure, setMeasure] = useState(strings.measure);
    var duration = moment.duration(moment().diff(route.params.date));
    const [imagePath, setImagePath] = useState('');
    const [photo, setPhoto] = useState('');
    const [load, setLoad] = useState(false);
    const multilineInputState = useInputState();
    const navigateBack = () => {
        navigation.goBack();
    };

    const menuCheck =() =>{
        setCheckCollapsed(false);
    }

    const BackAction = () => (
        <TopNavigationAction icon={BackIcon} onPress={navigateBack} />
    );

    const RenderImage = ({ uri, set }) => (
        <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
            <Image style={{ width: 50, height: 50 }} source={{ uri: uri }} />
            <Button size='giant' status='danger' appearance='ghost' style={{ bottom: 20, left: 10, position: 'absolute' }} accessoryLeft={CloseIcon} onPress={() => { set(''); setImagePath("") }} />
        </View>
    );

    const PostData = () => {
        setLoad(true);
        var postObj = {
            "ActionsPerformed": [0],
            "Comment": multilineInputState.value,
            "ImagePath": imagePath,
            "UserId": user.userId,
            "MonitoringStatusId": data.monitoringStatusId,
            "MonitoringId": data.monitoringId,
            "CompanyId": user.companyId,
            "FlagName": "watchlist",
            "FlagId":3,
        }
        
        postApi(postObj)
            .then(response => {
                setTimeout(() => {
                    flagApi(user, 'action')
                        .then((resp) => {
                            setLoad(false);
                            const cardData = resp;
                            navigation.dispatch(
                                StackActions.replace('DrawerNavigation', { user: user, data: cardData })
                            )
                        })
                }, 2000)
            })
            .catch(err => {
                // CheckDevice(err)
                setLoad(false);
            })
    }


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
             //   console.log('success');
             //   console.log("Response URL : " + data.Location);
                setImagePath(data.Location);
                setLoad(false);
            }
        });
    };


    const validation = () => {
        if (multilineInputState.value == "") { return true }
        else { return false }
    }

    return (
        <Layout style={{ flex: 1 }}>
            <StatusBar backgroundColor={colorCode} barStyle="light-content" />
            <TopNavigation title={()=>(<View style = {{marginTop:50}}><Text style={{ fontWeight: 'bold', fontSize: 18, color: "#ffffff" }}>{name}</Text></View>)} style={{ backgroundColor:`${colorCode}` }} alignment='center' accessoryLeft={BackAction} />
            <Layout style={styles.layout} level='4'>
                <ScrollView>
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', backgroundColor:`${colorCode}`, padding: 25, borderBottomEndRadius: 20, borderBottomStartRadius: 20 }}>
                        <View style={{ flex: 1 }}>
                            {data.monitoringStatusMessage.trim() != "" ? <Text style={{ fontSize: 16, color: "#FFFFFF", fontWeight: '600', lineHeight: 24 }}>
                                {data.monitoringStatusMessage.trim()}
                            </Text> : null}
                            <Alldates date1={data.monitoringStatusTimeStamp} date2={data.monitoringStatusLastUpdated} styles={styles} />
                        </View>
                        <View >
                            <Image source={require('../screens/assets/Frame_87.png')} />
                        </View>
                    </View>
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center',marginTop:7 }}>

                    <Text  style={{ textAlign: "center" ,color:`${colorCode}`,fontSize:11}}>
                        {strings.time_escalate} </Text>

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
                    <Text  style={{ textAlign: "center" ,color:`${colorCode}` ,fontSize:11}}>
                        {strings.sec} </Text>

                </View>
                    <View style={{ marginTop: 7 }}>

                        <HideWithKeyboard>
                        <Card style={{ backgroundColor: theme['background-basic-color-1'], borderColor: theme['border-basic-color-3'] }}>
                            <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                                <View style={{ flex: 2 }}>
                                    <Text style={{ fontSize: 14, fontWeight: 'bold', lineHeight: 24, color: "#8F9BB3" }}>
                                        {strings.location} </Text>
                                    <Text style={{ fontSize: 16, fontWeight: 'bold', lineHeight: 24 }}>
                                        {data.systemName.trim()} - {data.monitoringName} / {data.situationName.trim()}  </Text>
                                    <Text style={{ fontSize: 12, fontWeight: '600', lineHeight: 24, color: "#8F9BB3" }}>
                                        {data.monitoringDesc.trim()} </Text>
                                </View>
                            </View>
                        </Card>

                        <Card style={{ backgroundColor: theme['background-basic-color-1'], borderColor: theme['border-basic-color-3'] }}>
                            <Menu
                                style={{ marginRight: -14, marginLeft: -14, backgroundColor: theme['background-basic-color-1'] }}
                                
                                onSelect={index => setSelectedIndex(index)}>
                                <MenuGroup    onPressOut = {menuCheck} style={{ backgroundColor: theme['background-basic-color-1'] }} title={<Text style={{ fontSize: 14, fontWeight: 'bold', lineHeight: 24 }}>
                                    {measure} </Text>}>
                                    <Divider style={{ height: 2, marginTop: 12 }} />
                                    <Measures name={strings.escalated}  flagId={flagId} measure={data.measurements} colorCode = {colorCode} theme={theme} />
                                    <Divider style={{ height: 0.5 }} />

                                </MenuGroup>
                            </Menu>
                            {checkCollapsed ? 
                            <View style={{ marginRight: -14, marginLeft: -14, backgroundColor: theme['background-basic-color-1'] }}>
                                  <Divider style={{ height: 2,marginTop: 12 }} />
                            <Measures name={strings.action_req} flagId={flagId} measure={data.measurements} colorCode = {colorCode} theme={theme} />
                            </View>
                        :null}

                        </Card>
                        </HideWithKeyboard>
                        <KeyboardAvoidingView
    behavior={Platform.OS == "ios" ? "padding" : "height"}
    keyboardVerticalOffset={Platform.OS == "ios" ? 0 : 20}
    >
                        <View style={{ marginTop: 15, backgroundColor: theme['background-basic-color-1'] }}>
                            <Card style={{ backgroundColor: theme['background-basic-color-1'], borderColor: theme['border-basic-color-3'] }}>
                            
                                <Input
                                    multiline={true}
                                    textStyle={{ minHeight: 64 }}
                                    label={(<Text style={{ fontSize: 14, fontWeight: 'bold', lineHeight: 24, color: "#8F9BB3" }}>{strings.req_res_title}</Text>)}
                                    placeholder={strings.req_res_placeholder}
                                    {...multilineInputState}
                                />
                               
                            </Card>
                        </View>
                       
                        <View style={{ marginTop: 15, backgroundColor: theme['background-basic-color-1'] }}>
                            <Card style={{ backgroundColor: theme['background-basic-color-1'], borderColor: theme['border-basic-color-3'] }}>
                                <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                                    <View style={{ flex: 2 }}>
                                        <Text style={{ fontSize: 14, fontWeight: 'bold', color: "#8F9BB3", lineHeight: 24, paddingTop: 10 }}>
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
                        </KeyboardAvoidingView>
                    </View>
                    
                </ScrollView>
                <View style={{ backgroundColor: theme['background-basic-color-1'], flex: 1,marginTop:10, justifyContent: "center", alignItems: "center", paddingTop: 40, paddingBottom: 40, paddingLeft: 20, paddingRight: 20 }}>
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
        backgroundColor:"#FF5927",color:"#FFFFFF",fontSize: 13, textAlign: "center", paddingLeft: 10, paddingRight: 10, borderRadius: 5
    },
    fontCol:{
        color:"#FFFFFF"
    }
});