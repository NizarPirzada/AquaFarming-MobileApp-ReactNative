import React, { Component } from 'react';
import * as eva from '@eva-design/eva';
import { Layout, Text, Button } from '@ui-kitten/components';
import { StyleSheet, View, Image, ProgressBarAndroid } from 'react-native';
import * as Progress from 'react-native-progress';
import string from '../Localization';
export default class Intro_second_Screen extends Component {
    render() {
        return (
            <Layout style={styles.layout} level="1">
                <View style={{ flex: 1, justifyContent: "flex-start" }}>
                <Progress.Bar style={{ marginTop: 70}} borderWidth = {0} unfilledColor = "#E4E9F2" height = {7} width = {100} indeterminate={false} progress={0.4} styleAttr="Horizontal" color="#2196F3" />
                </View>
                <View style={{ flex: 1, justifyContent: "center", alignItems: 'center' }}>
                    <Image style={{
                        marginTop: 40, marginBottom: 80, width: 300,
                        height: 250, resizeMode: 'stretch'
                    }} source={require('../screens/assets/undraw_warning_cyit_2.png')} />
                </View>
                <View style={[styles.layout, styles.input]}>
                    <View style={{ marginBottom: 50 }}>
                        <Text style={{ textAlign: 'center', fontWeight: "bold" }} category='h4'>{string.screen_title_2}</Text>
                        <Text style={{ textAlign: 'center', }} category='s1'>{string.screen_desc_2}</Text>
                    </View>
                   
                </View>
                <View style={[{ alignSelf: 'stretch', justifyContent:'space-between',marginBottom:30 },styles.input]}>
                    <Button style={{ alignSelf: 'stretch' ,borderRadius: 10}} onPress={() => {
                        this.props.navigation.navigate('IntroThird')
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