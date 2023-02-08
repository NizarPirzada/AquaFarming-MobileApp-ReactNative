import React from 'react';
import Others from '../components/other';
import OthersEmpty from '../components/dashboard/others';
import { Layout, Spinner } from '@ui-kitten/components';
import { ScrollView, RefreshControl, View } from 'react-native';
import { flagApi } from '../api';
import { StackActions } from '@react-navigation/native';
import strings from '../Localization';
// import {CheckDevice} from "../components/deviceInfo";



export default Other = (props) => {
    let newlist = [];
    const [refreshing, setRefreshing] = React.useState(false);
    const onRefresh = React.useCallback(() => {
        setRefreshing(true)
        setTimeout(() => {
            flagApi(props.route.params.user, 'action')
                .then((resp) => {
                    setRefreshing(false);
                    props.navigation.dispatch(
                        StackActions.replace('DrawerNavigation', { user: props.route.params.user, data: resp, newdata: resp })
                    );
                })
                .catch((err) => {
                    // CheckDevice(err)
                })
            setRefreshing(false);
        }, 1000)
    }, [refreshing]);

    try {
        props.newdata.forEach(element => {
            if ((!element.isImportant) && element.monitoringSituations.length != 0) {
                newlist.push(element);
            }
        });

    }
    catch (exception) {
        newlist = []
    }
    if (newlist.length != 0) {
        return (
            <Layout style={{ flex: 1 }} level='4'>
                <ScrollView contentContainerStyle={{ paddingBottom: 30 }} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
                    <Others {...props} newdata = {newlist}  />
                </ScrollView>
            </Layout>
        );
    }
    else {
        return (
            <Layout style={{ flex: 1 }} level='4'>

                <ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
                    <OthersEmpty />
                </ScrollView>

            </Layout>
        )
    }

};