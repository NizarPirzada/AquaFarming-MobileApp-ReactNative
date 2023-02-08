import React from 'react';
import SafeZone from '../components/dashboard';
import ImportantComp from '../components/important';
import { Layout } from '@ui-kitten/components';
import { ScrollView, RefreshControl, View, SafeAreaView } from 'react-native';
import { StackActions } from '@react-navigation/native';
import { flagApi } from '../api';
// import { CheckDevice } from '../components/deviceInfo';


export default Life_saving = (props) => {
    let action = false;

    const [refreshing, setRefreshing] = React.useState(false);
    const onRefresh = React.useCallback(() => {
        setRefreshing(true)
        setTimeout(() => {
            flagApi(props.route.params.user, 'action')
                .then((resp) => {
                    setRefreshing(false);
                    props.navigation.dispatch(
                        StackActions.replace('DrawerNavigation', { user: props.route.params.user, data: resp })
                    )
                })
                .catch((err) => {
                    // CheckDevice(err)
                })
            setRefreshing(false);
        }, 1000)
    }, [refreshing]);
    if (props.isImp) {
        action = true
    }
   
    if (action) {
        return (
            
            <Layout style={{ flex: 1 }} level='4'>
                <ScrollView contentContainerStyle={{ paddingBottom: 30 }} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
                    <ImportantComp  {...props} />
                </ScrollView>
            </Layout>
            

        );
    }
    else {
        return (
           
                <Layout style={{ flex: 1 }} level='4'>

                    <ScrollView contentContainerStyle={{ paddingBottom: 30 }} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
                        <SafeZone  {...props} />
                    </ScrollView>

                </Layout>
           

        );
    }
};