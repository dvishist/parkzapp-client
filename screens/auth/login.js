import React from 'react';
import { StyleSheet, Text, TextInput, View, Image } from 'react-native'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { LinearGradient } from 'expo-linear-gradient'


export default function LoginScreen() {
    return (
        <LinearGradient colors={['#5cdb95', '#05386b']} style={styles.container}>
            <Image
                source={require('../../assets/logo-car.png')}
                style={styles.logo}
            />
            <View style={styles.loginView}>
                <Text style={styles.text}>EMAIL</Text>
                <TextInput style={styles.textInput}></TextInput>
                <Text style={styles.text}>PASSWORD</Text>
                <TextInput secureTextEntry={true} style={styles.textInput}></TextInput>

            </View>


        </LinearGradient>

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
        borderRadius: 80,
        height: 140,
        width: 140,
        margin: 20
    },
    loginView: {
        alignItems: 'center',
        height: '70%',
        width: '90%',
        padding: 20
    },
    text: {
        fontFamily: 'monospace',
        fontSize: 25,
        fontWeight: 'bold',
        color: 'white'
    },
    textInput: {
        borderRadius: 20,
        backgroundColor: 'white',
        height: 40,
        width: 300,
        padding: 10,
        marginVertical: 10
    }
})