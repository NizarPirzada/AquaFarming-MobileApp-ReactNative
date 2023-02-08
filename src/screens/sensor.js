import React from 'react';
import { StyleSheet, SafeAreaView, View, ScrollView, RefreshControl,StatusBar } from 'react-native';
import { Layout, TopNavigation, Text, useTheme, Menu, MenuGroup, Divider, ListItem, Spinner } from '@ui-kitten/components';
import { getSensors } from '../api';
import strings from '../Localization';
import moment from 'moment';
import { MeasureICON } from '../components/icons';
import SafeZone from '../components/sensor';
import { ThemeContext } from '../theme-context';



const maindate = (date) => {
    let utctime = date != null ? moment.utc(date, "YYYY/MM/DD hh:mm:ss").fromNow(): "";
    return utctime;
}




const LoadingIndicator = (props) => (
    <View style={{
        position: 'absolute',
        alignSelf: 'center',
        marginTop: 200
    }}>
        <Spinner size='small' />
    </View>
);


const SensorData = ({ sensor }) => {
    return sensor.map((item, index) => {
        return (<View key={index}><ListItem
            title={item.deviceName}
            style={{ paddingLeft: 20, paddingRight: 20 }}
            description={maindate(item.timeStamp)}
            accessoryLeft={() => { return <MeasureICON flagId={''} rule={''} icon={item.entityIcon} /> }}
            accessoryRight={() => { return <View style={{ flexDirection: "column" }}><Text> {item.reading ? item.reading : "n/a"} {item.reading ? item.unitName : ""} </Text></View> }}
        /><Divider /></View>)
    })
}

const SystemData = ({ system, theme }) => {
    const [selectedIndex, setSelectedIndex] = React.useState(null);
    return system.map((sys, index) => {
        return <View key={index}>

            <Menu
                style={{ marginRight: -14, marginLeft: -14 }}
                
                onSelect={index => setSelectedIndex(index)}>
                <MenuGroup title={<Text style={{ fontSize: 16, fontWeight: 'bold', lineHeight: 24 }} >
                    {sys.systemName} </Text>}>
                    <SensorData sensor={sys.sensors} />
                    <Divider style={{ height: 0.5 }} />

                </MenuGroup>

                <Divider style={{ height: 0.5 }} />
            </Menu>
        </View>
    })

}

const FacilityData = ({ data, theme }) => {
    return data['data'].map((d, index) => {
        return <View key={index} style={{ backgroundColor: theme['background-basic-color-4'], paddingLeft: 20, paddingRight: 20, flex: 1 }}>
            <Text style={{ fontSize: 14, fontWeight: 'bold', color: "#8F9BB3", marginTop: 20, marginBottom: 20, textTransform: 'uppercase' }}>
                {d.facilityName}</Text>
            <SystemData system={d.systems} theme={theme} />
        </View>
    })

}




export default Sensor = (props) => {
    const [data, setData] = React.useState(null)
    const [refresh, setRefresh] = React.useState(false)
    const themeContext = React.useContext(ThemeContext);
    let user = props.route.params['user']
    const [refreshing, setRefreshing] = React.useState(false);
    const onRefresh = React.useCallback(() => {
        setRefresh(true);
        setData(null);
        setRefreshing(true)
        setTimeout(() => {
            getSensors(user.companyId, user.userId)
                .then((resp) => {
                    setRefreshing(false);
                    resp.data != null ? setData(resp) : setData(null);
                    setRefresh(false);
                })
                .catch((err) => {
                    // CheckDevice(err)
                    setRefresh(false);
                })

            setRefreshing(false);
        }, 1000)
    }, [refreshing]);
    React.useEffect(() => {
        setRefresh(true);
        setData(null);
        getSensors(user.companyId, user.userId)
            .then((resp) => {

                resp.data != null ? setData(resp) : setData(null);
                setRefresh(false);
            })
            .catch((err) => {
                // CheckDevice(err)
                setRefresh(false);
            })

    }, [])
    const theme = useTheme();
    return (
       
            <Layout level='1' style={styles.layout} >
                        <StatusBar backgroundColor={theme['background-basic-color-1']} barStyle={themeContext.theme == "light" ? "dark-content" : "light-content"} {...props} />
                <TopNavigation  style = {{marginTop:50}} {...props} title={(<Text style={{ fontWeight: 'bold', fontSize: 18 }}>{strings.sensor_title}</Text>)} alignment='center' />
                {refresh ? <LoadingIndicator /> :
                    // 

                    <View style={{ backgroundColor: theme['background-basic-color-4'], flex: 1 }}>
                        <ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
                            {data != null ? <FacilityData data={data} theme={theme} /> :
                                <SafeZone />}
                        </ScrollView>
                    </View>
                    //</ScrollView>
                }
            </Layout>
       
    )
}

const styles = StyleSheet.create({
    layout: {
        flex: 1,

    }
});