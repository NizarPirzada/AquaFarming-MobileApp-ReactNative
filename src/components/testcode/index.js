import React from 'react'
import { Layout, Text, useTheme } from '@ui-kitten/components';
import { StyleSheet, SafeAreaView, Image, RefreshControl, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import strings from '../../Localization';

export default SafeZone = (props) => {
    const theme = useTheme();

    return (
        <Layout style={styles.layout} level="4">
            <ScrollView >
                <View style={styles.layout}>
                    <Image style={{
                        marginTop: 40, marginBottom: 40, width: 300,
                        height: 200,
                        resizeMode: 'stretch',
                    }} source={require('../../screens/assets/undraw_fish_bowl_uu88_1.png')} />

                    <Text style={{ flex: 1, textAlign: "center", marginLeft: 25, marginRight: 25, fontSize: 22, lineHeight: 24, fontWeight: 'bold', color: theme['text-basic-color'] }}>{strings.dashboard_desc}</Text>

                    <Image style={{ marginTop: 20, marginBottom: 20, width: 100, height: 50, resizeMode: "stretch" }} source={require('../../screens/assets/Group_91.png')} />

                    <Text style={{ flex: 1, textAlign: "center", marginLeft: 25, marginRight: 25, fontSize: 18, lineHeight: 24, fontWeight: '600', color: "#c5cee0" }}>{strings.dashboard_note}</Text>
                </View>
            </ScrollView>
        </Layout>

    );
};
const styles = StyleSheet.create({
    layout: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});