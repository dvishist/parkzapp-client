import React, { useState } from 'react';
import { StatusBar, StyleSheet, Text, TouchableOpacity, TextInput, View, Image, Button, KeyboardAvoidingView, ScrollView } from 'react-native'
import { createStackNavigator } from '@react-navigation/stack'
import { LinearGradient } from 'expo-linear-gradient'
import { AuthContext } from '../../components/context'
import axios from 'axios'
import validator from 'validator';



export default function Signup() {
    const [loading, setLoading] = React.useState(false)
    const [formValues, setFormValues] = React.useState(null)
    const [isValidEmail, setIsValidEmail] = React.useState(true)
    const [isUniqueEmail, setIsUniqueEmail] = React.useState(true)
    const [isMatchingPassword, setIsMatchingPassword] = React.useState(true)
    const [isPasswordLength, setisPasswordLength] = React.useState(true)
    const [isNameProvided, setIsNameProvided] = React.useState(true)

    useState(() => {
        setFormValues({
            name: '',
            email: '',
            phone: '',
            password: '',
            confirmPassword: ''
        })
    })


    const { signIn } = React.useContext(AuthContext)

    const formInputChange = (field, value) => {
        setFormValues({
            ...formValues,
            [field]: value
        })
    }

    const signUp = async () => {
        setIsValidEmail(true)
        setIsUniqueEmail(true)
        setIsMatchingPassword(true)
        setisPasswordLength(true)

        let valid = true

        if (!formValues.name) {
            setIsNameProvided(false)
            valid = false
        } else setIsNameProvided(true)

        if (!formValues.email || !validator.isEmail(formValues.email)) {
            setIsValidEmail(false)
            valid = false
        }

        if (formValues.password !== formValues.confirmPassword) {
            setIsMatchingPassword(false)
            valid = false
        }

        if (formValues.password.length < 8 || formValues.confirmPassword.length < 8) {
            setisPasswordLength(false)
            valid = false
        }

        if (!valid) return

        const { name, email, phone, password } = formValues
        setLoading(true)
        try {
            const user = await axios.post('/users', { name, email, phone, password })
            if (user) {
                const { data } = await axios.post('/users/login', { email, password })
                signIn(data.user.email, data.user._id, data.token)
            }
        } catch (err) {
            if (err.response.data.includes('E11000 duplicate key error collection: parkzapp.users index: email_1 dup key:')) {
                setIsUniqueEmail(false)
            }
            setLoading(false)
        }
    }


    return (
        <>
            <ScrollView>
                <LinearGradient colors={['#ef6698', '#492cac']} style={styles.container}>
                    <View style={styles.loginView}>
                        <View>
                            <Text style={styles.titleText1}>WELCOME TO</Text>
                            <Text style={styles.titleText2}>PARKZAPP</Text>
                        </View>
                        <Text style={styles.text}>NAME</Text>
                        <TextInput style={styles.textInput} placeholder={'John Doe'} onChangeText={value => formInputChange('name', value)}></TextInput>
                        {isNameProvided ? null : <Text style={styles.errormsg}>Please enter a name</Text>}
                        <Text style={styles.text}>EMAIL</Text>
                        <TextInput autoCapitalize='none' style={styles.textInput} placeholder={'abc@example.com'} onChangeText={value => formInputChange('email', value)}></TextInput>
                        {isValidEmail ? null : <Text style={styles.errormsg}>Please enter a valid email</Text>}
                        {isUniqueEmail ? null : <Text style={styles.errormsg}>Email is already registered</Text>}
                        <Text style={styles.text}>PHONE</Text>
                        <TextInput style={styles.textInput} placeholder={'0123456789  (Optional)'} onChangeText={value => formInputChange('phone', value)}></TextInput>
                        <Text style={styles.text}>PASSWORD</Text>
                        <TextInput autoCapitalize='none' secureTextEntry={true} placeholder={'password'} style={styles.textInput} onChangeText={value => formInputChange('password', value)}></TextInput>
                        <Text style={styles.text}>CONFIRM PASSWORD</Text>
                        <TextInput autoCapitalize='none' secureTextEntry={true} placeholder={'password'} style={styles.textInput} onChangeText={value => formInputChange('confirmPassword', value)}></TextInput>
                        {isMatchingPassword ? null : <Text style={styles.errormsg}>Passwords do not match</Text>}
                        {isPasswordLength ? null : <Text style={styles.errormsg}>Password must be at least 8 characters</Text>}
                        < View style={{ marginTop: 8, alignItems: 'center' }}>
                            <TouchableOpacity onPress={signUp}>
                                <LinearGradient colors={['#00BFA5', '#43A047']} style={styles.loginButton}>
                                    <Text style={styles.signupButtonText}>{loading ? 'Loading...' : 'CREATE ACCOUNT'}</Text>
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
        height: 800,
        paddingHorizontal: 20,
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
    },
    errormsg: {
        color: '#ed0000',
        paddingLeft: 10
    }
})