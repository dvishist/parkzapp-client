import React from 'react';
import { StatusBar, StyleSheet, Text, TouchableOpacity, TextInput, View, Image, Button } from 'react-native'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { LinearGradient } from 'expo-linear-gradient'


export default function Signup({ navigation: { navigator } }) {
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
                    <TextInput style={styles.textInput}></TextInput>
                    <Text style={styles.text}>PASSWORD</Text>
                    <TextInput secureTextEntry={true} style={styles.textInput}></TextInput>
                    < View style={{ marginTop: 50 }}>
                        <TouchableOpacity>
                            <LinearGradient colors={['#00BFA5', '#43A047']} style={styles.loginButton}>
                                <Text style={styles.buttonText}>LOG IN</Text>
                            </LinearGradient>
                        </TouchableOpacity>
                        <TouchableOpacity>
                            <LinearGradient colors={['#00B8D4', '#00897B']} style={styles.loginButton}>
                                <Text style={styles.buttonText}>CREATE ACCOUNT</Text>
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
        fontSize: 25,
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
    buttonText: {
        fontWeight: 'bold',
        fontSize: 14,
        color: 'white'
    }
})