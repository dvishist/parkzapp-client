import React from 'react';
import { StyleSheet, Text, TouchableOpacity, TextInput, View, Image } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import axios from 'axios'
import validator from 'validator'

import { AuthContext } from '../../components/context'
import API_URL from '../../components/apiurl'

export default function Login({ navigation }) {
    axios.defaults.baseURL = API_URL;
    const [loading, setLoading] = React.useState(false)

    //login state to verify user loggedin with correct credentials
    const [credentials, setCredentials] = React.useState({
        email: '',
        password: '',
        isValidEmail: true,
        isValidPassword: true
    })

    //using the authContext created in App.js, which contains the loginReducer
    const { signIn } = React.useContext(AuthContext)

    //function to execute on login button press
    const loginHandle = async (email, password) => {
        setCredentials({ ...credentials, isValidEmail: true, isValidPassword: true })
        email = email.trim().toLowerCase()
        if (!validator.isEmail(email)) {
            setCredentials({
                ...credentials, isValidEmail: false
            })
            return
        }
        try {
            setLoading(true)
            const { data } = await axios.post('/users/login', { email, password })

            signIn(data.user.email, data.user._id, data.token)
        } catch (err) {
            setCredentials({
                ...credentials, isValidEmail: true, isValidPassword: false
            })
            setLoading(false)
        }

    }

    // to update email state on text change in email field
    const textInputChange = value => {
        setCredentials({
            ...credentials,
            email: value
        })
    }

    // to update password state on text change in password field
    const passwordInputChange = value => {
        setCredentials({
            ...credentials,
            password: value
        })
    }

    return (
        <>
            <LinearGradient colors={['#f20089', '#2d00f7']} style={styles.container}>
                <Image
                    source={require('../../assets/logo.png')}
                    style={styles.logo}
                />
                <View style={styles.loginView}>
                    <Text style={styles.text}>EMAIL</Text>
                    <TextInput
                        onChangeText={value => textInputChange(value)}
                        style={styles.textInput}
                        placeholder={'abc@example.com'}
                        autoCapitalize='none'
                    >
                    </TextInput>
                    {credentials.isValidEmail ? null :
                        <Text style={styles.errormsg}>Please enter a valid email</Text>
                    }

                    <Text style={styles.text}>PASSWORD</Text>
                    <TextInput
                        onChangeText={value => passwordInputChange(value)}
                        secureTextEntry={true}
                        placeholder={'password'}
                        autoCapitalize='none'
                        style={styles.textInput}>
                    </TextInput>

                    {credentials.isValidPassword ? null :
                        <Text style={styles.errormsg}>Incorrect Email or Password</Text>
                    }
                    <TouchableOpacity style={{ alignItems: 'center', paddingLeft: 10 }}>
                        <Text style={{ color: 'white' }}>Forgot Password?</Text>
                    </TouchableOpacity>
                    < View style={{ marginTop: 60, alignItems: 'center', width: '100%' }}>
                        <TouchableOpacity onPress={() => loginHandle(credentials.email, credentials.password)}>
                            <LinearGradient colors={['#00BFA5', '#43A047']} style={styles.loginButton}>
                                <Text style={styles.loginButtonText}>{loading ? 'Loading...' : 'LOG IN'}</Text>
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
        marginTop: 80,
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