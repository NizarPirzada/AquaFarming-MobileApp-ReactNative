import React, { useState, useEffect } from 'react';

import { StyleService, Spinner, useStyleSheet, Icon, TopNavigation, Input, TopNavigationAction, Menu, ListItem, Layout, Text, Card, useTheme, Divider, MenuGroup, MenuItem } from '@ui-kitten/components';
import { SafeAreaView, View, StatusBar, ScrollView, Image } from 'react-native';
import strings from '../Localization';
import { getHistory } from '../api';
import moment from 'moment';
import { MeasureICON } from '../components/icons';
import CountDown from 'react-native-countdown-component';
// import { CheckDevice } from '../components/deviceInfo';


let dict = {};

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



const LoadingIndicator = (props) => (
    <View style={{ flex: 1, justifyContent: "center", alignItems: 'center', flexDirection: "column" }}>
        <Spinner size='small' />
    </View>
);
const colorChoose = (flagId) => {
    if ((flagId == 2) || (flagId == 1)) {
        return '#17C8EC'
    }
    else if ((flagId == 4) || (flagId == 5)) {
        return '#FF5927'
    }
    else if (flagId == 3) {
        return '#47CE8C'
    }
    else if ((flagId == 6) || (flagId == 9) || (flagId == 10)) {
        return '#6241D9'
    } else {
        return '#8F9BB3'
    }
}



const BackIcon = (props) => (
    <View style={{ paddingRight: 10, paddingBottom: 10, paddingTop: 60 }}>
        <Image {...props} style={{ backgroundColor: "#fffff", width: 18, height: 15, resizeMode: "stretch" }} source={require('../screens/assets/IconBack.png')} />
    </View>);

const back_color = (color) => {
    
    return {
        backgroundColor: color,
        color: "#FFFFFF"
    }
}


const Measures = ({ theme, measure, name, flagId ,styles,colorCode}) => {
    return measure.map((data, i) => {
        if (data.mainReading && data.actualReading) {
            return (
                <View>
                    {/* <ListItem style={{ backgroundColor: theme['background-basic-color-2'] }}
                   key={i} title={data.title} description={data.time} accessoryRight={() => { return <View><View style = {{backgroundColor:'#FF3D71'}}><Text style={{ fontSize: 13 }}>{data.s_temp}</Text></View><View><Text style={{ fontSize: 11 }}>{data.d_temp}</Text></View></View> }} accessoryLeft={SmartphoneIcon} />
                 */}
                    <ListItem style={{ backgroundColor: theme['background-basic-color-1'], marginRight: 10 }}
                        key={i} title={data.measureName}
                        description={<Text style={{ fontSize: 12, fontWeight: 'bold', color: "#c4cad7", lineHeight: 27 }}>{strings.current} : {maindate(data.actualTime)}</Text>}
                        accessoryRight={() => { return <View><View style={{ paddingLeft: 5, paddingRight: 5, borderRadius: 3 },[styles.readingText, data.ruleTriggered ? back_color(colorCode) : null]}><Text style={data.ruleTriggered ? styles.fontCol : null}>{data.mainReading ? data.mainReading.trim() : null} {data.unitName ? data.unitName.trim() : null}</Text></View><View style={{ paddingLeft: 5, paddingRight: 5 }}><Text style={[{ fontSize: 12, fontWeight: 'bold', color: "#c4cad7", lineHeight: 27 },styles.readingText]}>{data.actualReading} {data.unitName}</Text></View></View> }}
                        accessoryLeft={() => { return <MeasureICON flagId={flagId} name={name} rule={data.ruleTriggered} icon={data.icon} /> }} />
                    <Divider style={{ height: 2 }} />

                </View>
            )
        } else {
            return false
        }

    })
}

export default Watchlist = ({ route, navigation }) => {
    const [checkCollapsed, setCheckCollapsed] = useState(true);
    const [selectedIndex, setSelectedIndex] = React.useState(null);
    let data = route.params.data;
    let user = route.params.user;
    const [history, setHistory] = useState({});
    const [loading, setLoading] = useState(true);
    const [measure, setMeasure] = useState(strings.measure);
    var duration = moment.duration(moment().diff(route.params.date));
    useEffect(() => {
        getHistory(user.companyId, data.monitoringId)
            .then((response) => {
                setHistory(response)

                setLoading(false);
            })
            .catch((err) => {
                // CheckDevice(err)
            });
    }, []);


    // let user = route.params.user;
    let color = route.params.color;
    let name = route.params.name;

    let flagId = route.params.flagId;
    let newdata;

    const menuCheck = () => {
        setCheckCollapsed(false);
    }

    const styles = useStyleSheet(themeStyle);
    const theme = useTheme();
    const navigateBack = () => {
        navigation.goBack();
    };
    const BackAction = () => (
        <TopNavigationAction icon={BackIcon} onPress={navigateBack} />
    );

    const RenderMenu = (props) => {
        if (history.data != null) {
            if (history.data.length > 10) {
                newdata = history.data.slice(0, 10);
            }
            else {
                newdata = history.data;
            }

            return newdata.map((element, index) => {
                return (
                
                    <MenuGroup key={index} style={styles.MenuGroup} title={() => (<View><Text style={{ color: colorChoose(element.flagId) }}>{element.flagName}</Text><Text style={{ fontSize: 12, fontWeight: '600', lineHeight: 24 }}> {element.timeStamp} </Text></View>)}  >
                        <MenuItem style={{ backgroundColor: theme['background-basic-color-4'] }} title={<Text><Text style={{ fontWeight: 'bold' }}>{strings.comment}:{'\n'}</Text><Text>{element.comment}</Text></Text>} />
                        {/* <Text>sdsds</Text> */}
                    </MenuGroup>
                    
                )
            })
        }
        else {
            return null
        }
    }


    return (
        <Layout style={{ flex: 1 }}>
            <StatusBar backgroundColor={color} barStyle="light-content" />
            <TopNavigation appearance="control" title={()=>(<View style = {{marginTop:50}}><Text style={{ fontWeight: 'bold', fontSize: 18, color: "#FFFFFF" }}>{name}</Text></View>)} style={{ backgroundColor: `${color}` }} alignment='center' accessoryLeft={BackAction} />
            <Layout style={styles.layout} level='4'>
                <ScrollView>
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', backgroundColor: `${color}`, padding: 25, borderBottomEndRadius: 20, borderBottomStartRadius: 20 }}>
                        <View style={{ flex: 1 }}>
                            <Text style={{ fontSize: 16, fontWeight: '600', color: "#FFFFFF" }}>
                                {data.monitoringStatusMessage.trim()} </Text>
                            {data.userName && name == strings.watchlist ? <Text style={{ fontSize: 16, fontWeight: '600', color: "#FFFFFF" }}>
                                {data.userName.trim()} </Text> : null}
                            <Alldates date1={data.monitoringStatusTimeStamp} date2={data.monitoringStatusLastUpdated} styles={styles} />
                        </View>
                    </View>
                    {flagId == 3 && data.criticalTimeSeconds != null ?
                         <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center',marginTop:7 }}>

                         <Text  style={{ textAlign: "center" ,color: `${color}`,fontSize:11}}>
                             {strings.time_watchlist} </Text>
     
                         <CountDown
     
                             until={data.criticalTimeSeconds - duration.asSeconds()}
                             size={6}
                             digitStyle={{ backgroundColor: theme['background-basic-color-4'], borderWidth: 0, borderColor: '#1CC625', margin: 0,marginTop:-1.2 }}
                             digitTxtStyle={{ color: `${color}`, fontSize: 9 }}
                             timeLabelStyle={{ color: `${color}`, fontWeight: 'bold' }}
                             separatorStyle={{ color: `${color}`, fontSize: 9,marginTop:-2}}
                             timeToShow={['H','M', 'S']}
                             timeLabels={{ m: null, s: null }}
                             showSeparator
                         />
                         <Text  style={{ textAlign: "center" ,color: `${color}`,fontSize:11}}>
                             {strings.sec} </Text>
     
                     </View>: null}
                    <View style={{ marginTop: 15, paddingBottom: 15 }}>
                        <Card style={{ backgroundColor: theme['background-basic-color-1'], borderColor: theme['border-basic-color-3'] }}>
                            <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                                <View style={{ flex: 2 }}>
                                    <Text style={{ fontSize: 14, fontWeight: 'bold', lineHeight: 24, color: "#8F9BB3" }}>
                                        {strings.location} </Text>
                                    <Text style={{ fontSize: 16, fontWeight: 'bold', lineHeight: 24 }}>
                                        {data.systemName.trim()} - {data.monitoringName} / {data.situationName.trim()}</Text>
                                    <Text style={{ fontSize: 12, fontWeight: '600', lineHeight: 24, color: "#8F9BB3" }}>
                                        {data.monitoringDesc.trim()} </Text>
                                </View>
                            </View>
                        </Card>

                        <Card style={{ backgroundColor: theme['background-basic-color-1'], borderColor: theme['border-basic-color-3'] }}>
                            <Menu
                                style={{ marginRight: -14, marginLeft: -14, backgroundColor: theme['background-basic-color-1'] }}
                               
                                onSelect={index => setSelectedIndex(index)}>
                                <MenuGroup style={{ backgroundColor: theme['background-basic-color-1'] }} onPressOut={menuCheck} title={<Text style={{ fontSize: 14, fontWeight: 'bold', lineHeight: 24 }}>
                                    {measure} </Text>}>

                                    <Divider style={{ height: 2, marginTop: 12 }} />

                                    <Measures name={strings.action_req} colorCode = {color} flagId={flagId} measure={data.measurements} theme={theme} styles = {styles} />

                                    <Divider style={{ height: 0.5 }} />


                                </MenuGroup>
                            </Menu>
                            {checkCollapsed ?
                                <View style={{ marginRight: -14, marginLeft: -14, backgroundColor: theme['background-basic-color-1'] }}>
                                    <Divider style={{ height: 2, marginTop: 12 }} />
                                    <Measures name={strings.action_req} colorCode = {color} flagId={flagId} measure={data.measurements} theme={theme} styles = {styles} />
                                </View>
                                : null}

                        </Card>

                        <View style={{ marginTop: 15 ,backgroundColor: theme['background-basic-color-1']}}>
                            <Card style={{ backgroundColor: theme['background-basic-color-1'], borderColor: theme['border-basic-color-3'] }}>
                                {loading == false ?

                                    // <Menu
                                    //     style={{ backgroundColor: theme['background-basic-color-1'] }}
                                        
                                    //     onSelect={index => setSelectedIndex(index)}
                                    // >


                                        <MenuGroup style={{ backgroundColor: theme['background-basic-color-1']}} title={() => {
                                            return <Text style={{ fontSize: 14, fontWeight: 'bold', lineHeight: 24, color: "#8F9BB3", textTransform: "uppercase" }}>
                                                {strings.history} </Text>
                                        }}>
                                             
                                            <RenderMenu colorCode = {color} />
                                            
                                        </MenuGroup>

                                    // </Menu>
                                    : <LoadingIndicator />}
                            </Card>

                        </View>

                        <Divider />
                    </View>
                </ScrollView>
            </Layout>
        </Layout>
    );
};
const themeStyle = StyleService.create({
    layout: {
        flex: 1,
        flexDirection: "column",
    },
    MenuGroup: {
        
        backgroundColor: 'background-basic-color-1',

    },
    readingText: {
        fontSize: 13, textAlign: "center", paddingLeft: 10, paddingRight: 10, borderRadius: 5
    },
    fontCol:{
        color:"#ffffff"
    }
});