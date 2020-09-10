import React, { useEffect } from 'react'
import { Text, View, Button, Image, StyleSheet } from 'react-native'
import axios from 'axios'
import API_URL from '../../components/apiurl'
import AsyncStorage from '@react-native-community/async-storage'
import { AuthContext } from '../../components/context'
import { TouchableOpacity } from 'react-native-gesture-handler'

export default function OptionScreen(props) {
    userProfile = props.userProfile
    const { signOut } = React.useContext(AuthContext)

    return (
        <>
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
                </View>
                <TouchableOpacity style={styles.options}>
                    <Text style={styles.optionsText}>Edit Profile</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.options}>
                    <Text style={styles.optionsText}>Change Avatar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.options}>
                    <Text style={styles.optionsText}>Change Payment Method</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.options}>
                    <Text style={styles.optionsText}>Change Password</Text>
                </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.logoutButton} onPress={() => signOut()}>
                <Text style={{ color: 'white', fontWeight: 'bold' }}>LOG OUT</Text>
            </TouchableOpacity>
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
        backgroundColor: 'beige'
    },
    profile: {
        marginBottom: 60
    },
    userName: {
        alignSelf: 'center',
        fontWeight: 'bold',
        fontSize: 20
    },
    options: {
        backgroundColor: 'white',
        width: 350,
        alignItems: 'center',
        justifyContent: 'center',
        height: 40,
        borderWidth: 1,
        marginVertical: 2,
        borderRadius: 12
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