import React from 'react';
import { StatusBar, StyleSheet, Text, TouchableOpacity, TextInput, View, Image, Button, KeyboardAvoidingView, ScrollView } from 'react-native'
import { createStackNavigator } from '@react-navigation/stack'
import { LinearGradient } from 'expo-linear-gradient'


export default function Signup() {
    return (
        <>
            <ScrollView>
                <LinearGradient colors={['#5cdb95', '#05386b']} style={styles.container}>

                    <View style={styles.loginView}>
                        <View>
                            <Text style={styles.titleText1}>WELCOME TO</Text>
                            <Text style={styles.titleText2}>PARKZAPP</Text>
                        </View>
                        <Text style={styles.text}>NAME</Text>
                        <TextInput style={styles.textInput} placeholder={'John Doe'} ></TextInput>
                        <Text style={styles.text}>EMAIL</Text>
                        <TextInput style={styles.textInput} placeholder={'abc@example.com'}></TextInput>
                        <Text style={styles.text}>PHONE</Text>
                        <TextInput style={styles.textInput} placeholder={'0123456789'}></TextInput>
                        <Text style={styles.text}>PASSWORD</Text>
                        <TextInput secureTextEntry={true} placeholder={'password'} style={styles.textInput}></TextInput>
                        <Text style={styles.text}>CONFIRM PASSWORD</Text>
                        <TextInput secureTextEntry={true} placeholder={'password'} style={styles.textInput}></TextInput>
                        < View style={{ marginTop: 8, alignItems: 'center' }}>
                            <TouchableOpacity>
                                <LinearGradient colors={['#00BFA5', '#43A047']} style={styles.loginButton}>
                                    <Text style={styles.signupButtonText}>CREATE ACCOUNT</Text>
                                </LinearGradient>
                            </TouchableOpacity>
                        </ View>
                    </View>
                </LinearGradient>
            </ScrollView>
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        height: '100%',
        paddingVertical: 20,
        paddingHorizontal: 10
    },
    titleText1: {
        color: 'white',
        fontSize: 30,
        fontWeight: 'bold',
    },
    titleText2: {
        color: '#cafae1',
        fontSize: 50,
        fontWeight: 'bold',
    },
    loginView: {
        marginTop: 90,
        justifyContent: 'center',
        height: '70%',
        width: '100%',
        padding: 10

    },
    text: {
        fontSize: 15,
        fontWeight: 'bold',
        color: 'beige',
        paddingLeft: 8
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
        justifyContent: 'center',
        borderRadius: 30,
        height: 45,
        width: 190,
    },
    signupButtonText: {
        fontWeight: 'bold',
        fontSize: 14,
        color: 'white'
    }
})