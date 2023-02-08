import React, { Component } from 'react';
import * as eva from '@eva-design/eva';
import { Layout, Text, Button } from '@ui-kitten/components';
import { StyleSheet, View, Image, ProgressBarAndroid } from 'react-native';
import * as Progress from 'react-native-progress';
import string from '../Localization';
export default class Intro_fourth_Screen extends Component {
    render() {
        return (
            <Layout style={styles.layout} level="1">
                <View style={{ flex: 1, justifyContent: "flex-start" }}>
                <Progress.Bar style={{ marginTop: 70 }} borderWidth = {0} unfilledColor = "#E4E9F2" height = {7} width = {100} indeterminate={false} progress={0.8} styleAttr="Horizontal" color="#2196F3" />
                </View>
                <View style={{ flex: 1, justifyContent: "center", alignItems: 'center' }}>
                    <Image style={{
                        marginTop: 40, marginBottom: 80, width: 200,
                        height: 250, resizeMode: 'stretch'
                    }} source={require('../screens/assets/undraw_collaborating_g8k8_1.png')} />
                </View>
                <View style={[styles.layout, styles.input]}>
                    <View style={{ marginBottom: 50 }}>
                        <Text style={{ textAlign: 'center', fontWeight: "bold" }} category='h4'>{string.screen_title_4}</Text>
                        <Text style={{ textAlign: 'center', }} category='s1'>{string.screen_desc_4}</Text>
                    </View>

                </View>
                <View style={[{ alignSelf: 'stretch', justifyContent: 'space-between', marginBottom: 30 }, styles.input]}>
                    <Button style={{ alignSelf: 'stretch' ,borderRadius: 10}} onPress={() => {
                        this.props.navigation.navigate('IntroFifth')
                    }}>
                        {string.next}
                    </Button>
                </View>
            </Layout>
        );
    }
};
const styles = StyleSheet.create({
    layout: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
    },
    input: {
        marginLeft: 20,
        marginRight: 20,
        marginTop: 50
    }
});