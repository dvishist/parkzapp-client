import React from 'react';
import { StatusBar, StyleSheet, Text, TouchableOpacity, TextInput, View, Image, Button } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'

import validator from 'validator'

import Signup from './signup'

export default function Login({ navigation }) {

    const [credentials, setCredentials] = React.useState({
        email: '',
        password: '',
        isValidEmail: true,
        isValidPassword: true
    })


    const textInputChange = value => {
        setCredentials({
            ...credentials,
            email: value
        })
    }

    const passwordInputChange = value => {
        setCredentials({
            ...credentials,
            password: value
        })
    }

    return (
        <>
            {/* <StatusBar></StatusBar> */}
            <LinearGradient colors={['#5cdb95', '#05386b']} style={styles.container}>
                <Image
                    source={require('../../assets/logo.png')}
                    style={styles.logo}
                />
                <View style={styles.loginView}>
                    <Text style={styles.text}>EMAIL</Text>
                    <TextInput
                        onChangeText={value => textInputChange(value)}
                        style={styles.textInput}
                        placeholder={'abc@example.com'}>
                    </TextInput>
                    {credentials.isValidEmail ? null :
                        <Text style={styles.errormsg}>Please enter a valid email</Text>
                    }

                    <Text style={styles.text}>PASSWORD</Text>
                    <TextInput
                        onChangeText={value => passwordInputChange(value)}
                        secureTextEntry={true}
                        placeholder={'password'}
                        style={styles.textInput}>
                    </TextInput>

                    {credentials.isValidPassword ? null :
                        <Text style={styles.errormsg}>Incorrect Email or Password</Text>
                    }
                    <TouchableOpacity style={{ alignItems: 'center', paddingLeft: 10 }}>
                        <Text style={{ color: 'white' }}>Forgot Password?</Text>
                    </TouchableOpacity>
                    < View style={{ marginTop: 60, alignItems: 'center', width: '100%' }}>
                        <TouchableOpacity>
                            <LinearGradient colors={['#00BFA5', '#43A047']} style={styles.loginButton}>
                                <Text style={styles.loginButtonText}>LOG IN</Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    </ View>
                </View>
            </LinearGradient>
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        height: '100%',
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 10
    },
    logo: {
        marginTop: 20,
        borderRadius: 20,
        height: 140,
        width: 140,
        margin: 20
    },
    loginView: {
        alignItems: 'flex-start',
        height: '70%',
        width: '100%',
        padding: 20,
    },
    text: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'beige',
        paddingLeft: 10
    },
    textInput: {
        borderRadius: 15,
        backgroundColor: 'white',
        height: 40,
        width: '100%',
        padding: 10,
        marginVertical: 10
    },
    loginButton: {
        alignItems: 'center',
        marginBottom: 15,
        justifyContent: 'center',
        borderRadius: 30,
        height: 45,
        width: 190,
    },
    loginButtonText: {
        fontWeight: 'bold',
        fontSize: 14,
        color: 'white'
    },
    signupButtonText: {
        fontWeight: 'bold',
        fontSize: 14,
        color: 'black'
    },
    errormsg: {
        color: '#ed0000',
        paddingLeft: 10
    }
})