import React, { useState } from 'react'
import { StyleService, Layout, Text, Card, Input, Icon, useStyleSheet,useTheme } from '@ui-kitten/components';
import { StyleSheet, SafeAreaView, Image, View, ScrollView } from 'react-native';
import strings from '../../../Localization';
import { getHistory } from '../../../api';
import CountDown from 'react-native-countdown-component';
import moment from 'moment';


const maindate = (date) =>{
  let utctime = moment.utc(date,"YYYY/MM/DD hh:mm:ss").fromNow();
  return utctime;
}

const Alldates = ({date1,date2,styles}) =>{
    if (maindate(date1) != maindate(date2))
    {return (
        <Text style={{ fontSize: 12, fontWeight: 'bold', lineHeight: 24, color: "rgba(255, 255, 255, 0.48)" }}>For {maindate(date1).replace(' ago','')}, confirmed {maindate(date2)}</Text>
    )}
    else{
        return (
        <Text style={{ fontSize: 12, fontWeight: 'bold', lineHeight: 24, color: "rgba(255, 255, 255, 0.48)" }}>{maindate(date2)}</Text>
    )
}
}


const getData = (props, data, name, color, user ,timeData, flagId) => {
    // getHistory(user.companyId,data.monitoringStatusId)
    // .then((response)=>{
    props.navigation.push('Watchlist', { data: data, name: name, color: color, user: user, timeData: timeData ,measurements:props.measurements,flagId:flagId})
    // })
}


const CardsValues = (props) => {
    const theme = useTheme();
    const styles = useStyleSheet(themedStyles);
    var duration = moment.duration(moment().diff(props.date));
    return props.data.map((data, i) => {
        return (
            <View>
            <Card key={i} style={{ backgroundColor: `${props.color}`, borderRadius: 10, marginTop: 10 }} onPress={() => { props.navigation.push('Watchlist', { data: data, name: props.name, color: props.color, user: props.route.params.user, timeData: new Date(data.monitoringStatusLastUpdated).getTime(), measurements: props.measurements, flagId: props.flagId, date : props.date }) }}>                
                <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                    <View>
                        {data.monitoringStatusMessage.trim() != "" ? <Text category='s1' style={styles.text}>
                            {data.monitoringStatusMessage.trim().length > 50 ? data.monitoringStatusMessage.trim().substring(0, 50) + "..." : data.monitoringStatusMessage.trim()}
                        </Text> : null}
                        <Text category='s2' style={styles.text}>
                        {data.systemName.trim()} - {data.monitoringName} / {data.situationName.trim()}</Text>
                            <Alldates date1 = {data.monitoringStatusTimeStamp} date2 = {data.monitoringStatusLastUpdated} styles = {styles} />
                     
                            </View>
                </View>
            </Card>
            {props.flagId == 3 &&  data.criticalTimeSeconds != null ?
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' ,marginTop:7,marginBottom:7 }}>

                    <Text  style={{ textAlign: "center", color: `${props.color}`,fontSize:11}}>
                        { strings.time_watchlist} </Text>

                    <CountDown

                        until={data.criticalTimeSeconds - duration.asSeconds()}
                       
                        size={6}
                        digitStyle={{ backgroundColor: theme['background-basic-color-4'], borderWidth: 0, borderColor: '#1CC625', margin: 0 ,marginTop:-1.2 }}
                        digitTxtStyle={{ color: `${props.color}`, fontSize: 9 }}
                        timeLabelStyle={{ color: `${props.color}`, fontWeight: 'bold' }}
                        separatorStyle={{ color: `${props.color}`, fontSize: 9 ,marginTop: -2 }}
                        timeToShow={['H','M', 'S']}
                        timeLabels={{ m: null, s: null }}
                        showSeparator
                    />
                    <Text  style={{ textAlign: "center", color: `${props.color}`,fontSize:11}}>
                        {strings.sec} </Text>

                </View> : null}
            </View>


        )
    })
}

export default othersCard = (props) => {
    const [watchHide, setWatchHide] = React.useState(strings.hide);
    const [show, setShow] = React.useState(true);

    const show_hide = () => {
        if (show === true) {
            setWatchHide(strings.show)
            setShow(false)
        }
        else {
            setWatchHide(strings.hide)
            setShow(true)
        }
    }
    return (
        <View style={{ marginLeft: 20, marginRight: 20, marginTop: 20 }}>
            <View style={{ flex: 1, flexDirection: 'row' }}>
                <View style={{ flex: 1 }}>
                    <Text style={{ textAlign: 'left', marginBottom: 20, fontSize: 22, fontWeight: 'bold' }}>{props.name} ({props.count})</Text>
                </View>
                <View>
                    <Text style={{ textAlign: 'right', marginTop: 5, color: '#3366FF', fontSize: 14, fontWeight: 'bold' }} onPress={() => show_hide()}>{watchHide}</Text>
                </View>
            </View>
            {show ? (
                <View>
                    <CardsValues data={props.monitoringSituations} name={props.name} flagId = {props.flagId} userName = {props.userName} color={props.color} {...props} />
                </View>
            ) : null}

        </View>
    );
};
const themedStyles = StyleService.create({
    layout: {
        flex: 1,
    },
    text: {
        color: 'text-control-color'
    },
    textHint: {
        color: 'color-basic-control-transparent-600'
    },
});