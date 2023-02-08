import React, { Component } from 'react';
import * as eva from '@eva-design/eva';
import HideWithKeyboard from 'react-native-hide-with-keyboard';
import { Layout, Text, Input, Icon, Button, Spinner, useTheme } from '@ui-kitten/components';
import { KeyboardAvoidingView, StyleSheet, View, Image, ActivityIndicator, StatusBar } from 'react-native';
import { flagApi } from '../api';
import string from '../Localization';
import { ThemeContext } from '../theme-context';
import { API_URL, PORT } from '../../env.json';
import AsyncStorage from '@react-native-community/async-storage';
import { Context} from "../notification-context";
// import {CheckDevice} from '../components/deviceInfo';

const LoadingIndicator = (props) => (
    <View style={[props.style, styles.indicator]}>
        <Spinner size='small' />
    </View>
);
const keyboardVerticalOffset = Platform.OS === 'ios' ? -100 : 0
class LoginScreen extends Component {

    constructor() {
        super();
        this.state = {
            email: '',
            pass: '',
            loader: false,
            err_text: '',
        };
    }

    timeoutPromise(ms, promise) {
        return new Promise((resolve, reject) => {
            const timeoutId = setTimeout(() => {
                reject("An Error Occurred")
            }, ms);
            promise.then(
                (res) => {
                    clearTimeout(timeoutId);
                    resolve(res);
                },
                (err) => {
                    clearTimeout(timeoutId);
                    reject(err);
                }
            );
        })
    }

    updateValue(text, field) {
        if (field == 'email') {
            this.setState({
                email: text,
            })
        }
        else if (field == 'pass') {
            this.setState({
                pass: text,
            })
        }
    }

    emailValidator() {
        if (this.state.email == '') {
            this.setState({
                err_text: string.validation_email
            })
        }
        else {
            this.setState({
                err_text: ''
            })
        }

    }

    passValidator() {
        if (this.state.pass == '') {
            this.setState({
                err_text: string.validation_password
            })
        }
        else {
            this.setState({
                err_text: ''
            })
        }

    }

    submit() {

        if (this.state.email == '') {
            this.setState({
                err_text: string.validation_email
            })
        }
        else if(this.state.pass == '') {
            this.setState({
                err_text: string.validation_password
            })
        }

        else if (this.state.err_text == '') {
            this.setState({
                loader: true
            });
            let collection = {
                Email: this.state.email,
                Password: this.state.pass
            }

            const url = `${API_URL}/api/Account/surfboardlogin`;
            this.timeoutPromise(60000, fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(collection),
            }))
                .then(response => response.json())
                .then(data => {  
                    if (data.statusCode == "200") { 
                        flagApi(data)
                            .then(response => {
                                this.setState({
                                    loader: false
                                });
                                storeData(data.result.result,data.result.result.topicToSubscribe);
                                const cardData = response;
                                this.props.setContext(data.result.result.topicToSubscribe);
                                this.props.navigation.replace('DrawerNavigation', { user: data.result.result, data: cardData })
                            })
                    }
                    else {
                       
                        if (string.invalid_add.toLowerCase().trim() == data.message.toLowerCase().trim() || data.message.trim() == "Incorrect Email or Password") {
                            this.setState({
                                err_text: string.invalid_add,
                            })
                            this.setState({
                                loader: false
                            });
                        }
                        else {
                            this.setState({
                                err_text: data.message,
                            })
                            this.setState({
                                loader: false
                            });
                        }
                    }
                })
                .catch((error) => {
                    // CheckDevice(error)
                    console.log(error)
                    this.setState({
                        err_text: string.net_error
                    })
                    this.setState({
                        loader: false
                    });
                });

        }
    }

    render() {
        return (
            <Layout  level="1" style={styles.layout}>
                <StatusBar backgroundColor={this.props.theme['background-basic-color-1']} barStyle={this.props.themeContext.theme == "light" ? "dark-content" : "light-content"} {...this.props} />
                <KeyboardAvoidingView style={styles.layout} behavior='padding' keyboardVerticalOffset={keyboardVerticalOffset}>
                    <View style={[styles.layout, styles.main]}>
                        <Image style={styles.logoImage} source={require('../screens/assets/splash.png')} />
                        <HideWithKeyboard>
                            {this.props.themeContext.theme == "light" ?  <Image style={styles.title}  source = {require('../screens/assets/Layer1.png')} />:  <Image style={styles.title}  source = {require('../screens/assets/Layer2.png')} />}
                           
                        </HideWithKeyboard>
                        <HideWithKeyboard>
                            <Text category='h3' style={styles.text_header_second}>{string.slogan}</Text>
                        </HideWithKeyboard>
                    </View>
                    <View style={[styles.layout, styles.input]}>
                        <Input
                            style={styles.inputbox, { backgroundColor: this.props.theme['background-basic-color-2'] }}
                            label={()=>{return<Text  style = {{fontWeight:"bold",color:"#8F9BB3",paddingBottom:10}}>EMAIL</Text>}}
                            placeholder={string.email_placeholder}
                            onBlur={() => this.emailValidator()}
                            keyboardType="email-address"
                            onChangeText={(text) => this.updateValue(text, 'email')}
                        />
                         <HideWithKeyboard>
                      <Text>{'\n'}</Text>  
                      </HideWithKeyboard>
                        <Input
                            style={styles.inputbox, { backgroundColor: this.props.theme['background-basic-color-2'] }}
                            label={()=>{return<Text style = {{fontWeight:"bold",color:"#8F9BB3",paddingBottom:10,paddingTop:10}}>{string.password.toUpperCase()}</Text>}}
                            placeholder={string.pass_placeholder}
                            onBlur={() => this.passValidator()}
                            secureTextEntry={true}
                            onChangeText={(text) => this.updateValue(text, 'pass')}
                        />
                        <Text status='danger'>{this.state.err_text}</Text>
                        {!this.state.loader ? <Button style={{ alignSelf: 'stretch', marginTop: 20,borderRadius: 10  }} onPress={() => this.submit()}>
                            {string.LogIn}
                        </Button> : <Button style={{ alignSelf: 'stretch',marginTop: 20, borderRadius: 10}} appearance='outline' accessoryLeft={LoadingIndicator}>
                                {string.Loading}
                            </Button>}
                            <HideWithKeyboard>
                            <Text category='h3' style={[styles.text, styles.forgot]}>{string.forget_pass}</Text>
{/* 
<Text category='h3' style={[styles.text, styles.forgot]} onPress={() => {
                                this.props.navigation.navigate('RecoveryScreen')
                            }} >{string.forget_pass}</Text> */}
                        </HideWithKeyboard>
                    </View>

                    <View style={styles.layout}>
                        
                      
                    </View>

                    <View style={[{ alignSelf: 'center',marginBottom:30, justifyContent:'space-between'}]}>
                    <HideWithKeyboard>
                            <Text  category='s1'>{string.no_account}         <Text category='s1' style={[styles.forgot,styles.contact]}> {string.contact}</Text></Text>
                        </HideWithKeyboard>
                    </View>
                  

                </KeyboardAvoidingView>


            </Layout>
        );
    }
};

const storeData = async (data,topic) => {
    try {
        await AsyncStorage.setItem('@user_data', JSON.stringify(data));
        await AsyncStorage.setItem('@topic', topic);
    } catch (e) {
        // CheckDevice(e);
        console.log(e)
    }
}


export default function (props) {
    const theme = useTheme();
    const [context , setContext] = React.useContext(Context);
    const themeContext = React.useContext(ThemeContext);
    return <LoginScreen {...props} theme={theme} themeContext={themeContext} setContext = {setContext} />;
}
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
    text_header_second: {
        fontSize: 15,
        color: '#56617a',
        fontWeight: "bold"
    },
    text_header: {
        fontSize: 25,
        fontWeight: "bold",
    },
    span: {
        backgroundColor: '#3366ff',
        color: 'white',
    },
    logoImage: {
        
        width: 100,
        height: 100,
        resizeMode: "stretch"
    },
    input: {
        marginLeft: 20,
        marginRight: 20,
        marginTop: 50
    },
    inputbox: {
        marginTop: 10,
    },
    forgot: {
        color: "#3366ff",
        marginTop: 30
    },
    main: {
        marginTop: 50
    },
    contact: {
        fontWeight: "bold",
    },
    loading: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center'
    },
    indicator: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    title:{
        width: 150,
        height: 25,
        resizeMode: "stretch",
        marginBottom:10
    }
});