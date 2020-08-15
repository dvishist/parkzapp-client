import React from 'react';
import { StatusBar, StyleSheet, Text, TouchableOpacity, TextInput, View, Image, Button } from 'react-native'
import { createStackNavigator } from '@react-navigation/stack'
import { LinearGradient } from 'expo-linear-gradient'
import Signup from './signup'

export default function Login({ navigation }) {
    return (
        <>
            <StatusBar></StatusBar>
            <LinearGradient colors={['#5cdb95', '#05386b']} style={styles.container}>
                <Image
                    source={require('../../assets/logo.png')}
                    style={styles.logo}
                />
                <View style={styles.loginView}>
                    <Text style={styles.text}>EMAIL</Text>
                    <TextInput style={styles.textInput} placeholder={'abc@example.com'}></TextInput>
                    <Text style={styles.text}>PASSWORD</Text>
                    <TextInput secureTextEntry={true} placeholder={'password'} style={styles.textInput}></TextInput>
                    < View style={{ marginTop: 50 }}>
                        <TouchableOpacity>
                            <LinearGradient colors={['#00BFA5', '#43A047']} style={styles.loginButton}>
                                <Text style={styles.loginButtonText}>LOG IN</Text>
                            </LinearGradient>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => navigation.navigate(Signup)}>
                            <LinearGradient colors={['white', 'beige']} style={styles.loginButton}>
                                <Text style={styles.signupButtonText}>CREATE ACCOUNT</Text>
                            </LinearGradient>
                        </TouchableOpacity>
                        <TouchableOpacity style={{ alignItems: 'center' }}>
                            <Text style={{ color: 'white' }}>Forgot Password?</Text>
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
        alignItems: 'center',
        height: '70%',
        width: '100%',
        padding: 20,
    },
    text: {
        fontFamily: 'monospace',
        fontSize: 20,
        fontWeight: 'bold',
        color: 'beige'
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
    }
})