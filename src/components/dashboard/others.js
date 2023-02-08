import React from 'react'
import { Layout, Text, useTheme } from '@ui-kitten/components';
import { StyleSheet, SafeAreaView, Image, RefreshControl, View, Dimensions } from 'react-native';
import strings from '../../Localization';

export default Others = (props) => {
    const theme = useTheme();

    return (
            <Layout style={styles.layout,{backgroundColor:theme['background-basic-color-4']}}>
              
                    <View style={styles.layout}>
                        <Image style={{ marginTop: 40, marginBottom: 40 , width: 300,
    height: 200,
    resizeMode: 'stretch', }} source={require('../../screens/assets/undraw_not_found_60pq.png')} />

                        <Text style={{ flex: 1, textAlign: "center", marginLeft: 25, marginRight: 25, fontSize: 22, lineHeight: 24, fontWeight: 'bold', color: theme['text-basic-color'] }}>{strings.other_desc}</Text>

                        <Image style={{ marginTop: 20,marginBottom:20, width:100,height:50,resizeMode:"stretch"  }} source={require('../../screens/assets/Group_91.png')} />

                        <Text style={{ flex: 1, textAlign: "center", marginLeft: 25, marginRight: 25, fontSize: 18, lineHeight: 24, fontWeight: 'bold', color: "#8F9BB3" }}>{strings.dashboard_note}</Text>
                    </View>
               
            </Layout>
    );
};
var height = Dimensions.get('window').height;
const styles = StyleSheet.create({
    layout: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection:"column",
    },
});