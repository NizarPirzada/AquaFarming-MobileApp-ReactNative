import React, { useState } from 'react'
import { StyleService, Layout, Text, Card, Input, Icon, useStyleSheet, useTheme } from '@ui-kitten/components';
import { StyleSheet, SafeAreaView, Image, View, ScrollView } from 'react-native';
import CountDown from 'react-native-countdown-component';
import strings from '../../../Localization';
import moment from 'moment';


const maindate = (date) => {
    let utctime = moment.utc(date, "YYYY/MM/DD hh:mm:ss").fromNow();
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


const CardsValues = (props) => {
    const theme = useTheme();
    const styles = useStyleSheet(themedStyles);
    var duration = moment.duration(moment().diff(props.date));
    return props.data.map((data, i) => {
       
        return (
            <View key={data.monitoringStatusId}>
                <Card style={{ backgroundColor: `${props.color}`, borderRadius: 10, marginTop: 10 }} onPress={() => { !props.isNot ?  props.navigation.push('Action', { flagId:props.flagId,colorCode:props.color, flagName:props.flagName, data: data, measurements: props.measurements, user: props.route.params.user, timeData: new Date(data.monitoringStatusLastUpdated).getTime(),collapseState:false , date : props.date}) : props.navigation.push('Escalated', { flagId:props.flagId,colorCode:props.color, flagName:props.flagName, data: data,measurements: props.measurements, user: props.route.params.user, timeData: new Date(data.monitoringStatusLastUpdated).getTime(),collapseState:false, date : props.date }) }}>
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                        <View style={{ flex: 6 }}>
                            {data.monitoringStatusMessage.trim() != "" ? <Text category='s1' style={styles.text}>
                                {data.monitoringStatusMessage.trim().length > 50 ? data.monitoringStatusMessage.trim().substring(0, 50) + "..." : data.monitoringStatusMessage.trim()}
                            </Text> : null}
                            <Text category='s2' style={styles.text}>
                            {data.systemName.trim()} - {data.monitoringName} / {data.situationName.trim()}</Text>
                            {/* <Text style={styles.textHint}> */}
                            <Alldates date1 = {data.monitoringStatusTimeStamp} date2 = {data.monitoringStatusLastUpdated} styles = {styles} />
                        </View>
                        {props.isNot ? (
                            <View style={{ flex: 1 }}>
                                <Image source={require('../../../screens/assets/Frame_87.png')} />
                            </View>
                        ) : null}
                    </View>
                </Card>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center',marginTop:7,marginBottom:7 }}>

                <Text category='label' style={{ textAlign: "center" ,color:`${props.color}`}}>
                        {props.isNot ? strings.time_escalate : strings.time_action} </Text>

                    <CountDown

                        until={data.criticalTimeSeconds - duration.asSeconds()}
                        size={6}
                        digitStyle={{ backgroundColor: theme['background-basic-color-4'], borderWidth: 0, borderColor: '#1CC625', margin: 0,marginTop:-1.2 }}
                        digitTxtStyle={{ color:`${props.color}`, fontSize: 9 }}
                        timeLabelStyle={{ color:`${props.color}`, fontWeight: 'bold' }}
                        separatorStyle={{ color:`${props.color}`, fontSize: 9,marginTop:-2}}
                        timeToShow={['H','M', 'S']}
                        timeLabels={{ m: null, s: null }}
                        showSeparator
                    />
                    <Text  style={{ textAlign: "center" ,color:`${props.color}`,fontSize:11}}>
                        {strings.sec} </Text>

                </View>
            </View>

        )
    })
}

export default ImpCard = (props) => {
    const [watchHide, setWatchHide] = React.useState(strings.hide);
    const [show, setShow] = React.useState(true);
    const [timer, setTimer] = React.useState(0)
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
            {props.count != 0 ?
                <View style={{ flex: 1, flexDirection: 'row' }}>
                    <View style={{ flex: 1 }}>
                        <Text style={{ textAlign: 'left', marginBottom: 20, fontSize: 23, fontWeight: '800' }}>{props.name} ({props.count})</Text>
                    </View>
                    <View>
                        <Text style={{ textAlign: 'right', marginTop: 5, color: '#3366FF', fontSize: 14, fontWeight: 'bold' }} onPress={() => show_hide()}>{watchHide}</Text>
                    </View>
                </View> : null}
            {show ? (
                <View>
                    <CardsValues flagName = {props.name} flagId = {props.flagId} data={props.monitoringSituations} timer={{ timer, setTimer }} color={props.color} {...props} />
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
    time: {
        textAlign: "center",
        marginTop: 17
    }
});