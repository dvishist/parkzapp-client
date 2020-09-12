import React, { useEffect } from 'react'
import { Text, View, Button, Image, StyleSheet, TouchableOpacity } from 'react-native'
import axios from 'axios'
import API_URL from '../../components/apiurl'
import AsyncStorage from '@react-native-community/async-storage'
import { AuthContext } from '../../components/context'
import { LinearGradient } from 'expo-linear-gradient'

export default function OptionScreen(props) {
    userProfile = props.userProfile
    const { signOut } = React.useContext(AuthContext)

    return (
        <>
            <LinearGradient colors={['#f20089', '#2d00f7']} style={styles.container}>
                <View style={styles.container}>
                    <View style={styles.profile}>
                        <Image
                            onLoad={() => null}
                            fadeDuration={0}
                            style={styles.image}
                            defaultource={require('../../assets/user.jpg')}
                            source={{ uri: `https://park-zapp.herokuapp.com/users/${userProfile._id}/avatar` }}
                        >
                        </Image>
                        <Text style={styles.userName}>{userProfile.name.toUpperCase()}</Text>
                        <Text style={styles.userEmail}>{userProfile.email}</Text>
                    </View>
                    <TouchableOpacity style={styles.options}>
                        <Text style={styles.optionsText}>Edit Profile</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.options}>
                        <Text style={styles.optionsText}>Change Profile Picture</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.options}>
                        <Text style={styles.optionsText}>Change Payment Method</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.options}>
                        <Text style={styles.optionsText}>Change Password</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.options} onPress={() => signOut()}>
                        <Text style={styles.optionsText}>LOG OUT</Text>
                    </TouchableOpacity>
                </View>
            </LinearGradient>
        </>

    )
}


const styles = StyleSheet.create({
    image: {
        height: 150,
        width: 150,
        borderWidth: 2,
        borderColor: 'white',
        backgroundColor: 'gray',
        borderRadius: 100
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    profile: {
        marginBottom: 60
    },
    userName: {
        alignSelf: 'center',
        fontWeight: 'bold',
        marginTop: 8,
        fontSize: 25,
        color: 'white'
    },
    userEmail: {
        alignSelf: 'center',
        color: 'white'
    },
    options: {
        backgroundColor: 'white',
        width: 330,
        alignItems: 'center',
        justifyContent: 'center',
        height: 40,
        marginVertical: 5,
        borderRadius: 20
    },
    optionsText: {
        fontSize: 17,
    },
    logoutButton: {
        height: 45,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'black',
    }
})