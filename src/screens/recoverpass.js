import React from 'react';
import HideWithKeyboard from 'react-native-hide-with-keyboard';
import * as eva from '@eva-design/eva';
import { Layout, Text, Input, Icon, Button } from '@ui-kitten/components';
import { KeyboardAvoidingView, StyleSheet, View, Image, TouchableWithoutFeedback } from 'react-native';
import strings from '../Localization';

const AlertIcon = (props) => (
    <Icon {...props} name='alert-circle-outline' />
);

export default RecoverPassScreen = () => {
    const [value, setValue] = React.useState('');


    return (
        <Layout level="4" style={styles.layout}>
            <KeyboardAvoidingView>
                <View style={[styles.layout, styles.main]}>
                    <Image style={styles.logoImage} source={require('../screens/assets/splash.png')} />
                    <HideWithKeyboard>
                        <Text category='h2' style={styles.text_header}>{'UrbanBlue'}</Text>
                    </HideWithKeyboard>
                    <HideWithKeyboard>
                        <Text category='h3' style={styles.text_header_second}>{strings.slogan}</Text>
                    </HideWithKeyboard>
                </View>
                <View style={[styles.layout, styles.input]}>
                    <Input
                        style={styles.inputbox}
                        label={"Email".toUpperCase()}
                        placeholder={strings.email_placeholder}
                        value={value}
                        onChangeText={nextValue => setValue(nextValue)}
                    />
                    <Text category='s1'>{strings.recover_desc}</Text>
                    <Button style={{ alignSelf: 'stretch', marginTop: 30 }}>
                        {strings.recover_mail}
                    </Button>
                </View>

            </KeyboardAvoidingView>
        </Layout>
    );
};
const styles = StyleSheet.create({
    layout: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        fontSize: 20,
        fontWeight: "bold",
    },
    span: {
        backgroundColor: '#3366ff',
        color: 'white',
    },
    logoImage: {
        margin: 15,
        width:150,
        height:150,
        resizeMode:"stretch"
    },
    input: {
        marginLeft: 20,
        marginRight: 20,
        marginTop: 50,
        marginBottom: 200
    },
    inputbox: {
        marginTop: 200,
        marginBottom: 30
    },
    forgot: {
        color: "#3366ff",
        marginTop: 30
    },
    main: {
        marginTop: 50
    },
    contact: {
        fontWeight: "bold"
    },
    text: {
        fontSize: 20,
        fontWeight: "bold",
    },
    text_header_second: {
        fontSize: 18,
        color: '#56617a',
        fontWeight: "bold"
    }
});