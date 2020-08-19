import React, { useEffect } from 'react'
import { View, Text, Button, Image } from 'react-native'
import axios from 'axios'
import AsyncStorage from '@react-native-community/async-storage'

import API_URL from '../components/apiurl'

import { AuthContext } from '../components/context'



export default function Dashboard() {
    const [userProfile, setUserProfile] = React.useState(null)
    axios.defaults.baseURL = API_URL;
    useEffect(() => {
        async function setup() {
            try {
                const userToken = await AsyncStorage.getItem('userToken')
                axios.defaults.headers.common['Authorization'] = userToken
                const { data } = await axios.get('users/self')

                const avatar = await axios.get(`users/${data._id}/avatar`)
                setUserProfile({ ...data, avatar })
                console.log(avatar)
            } catch (err) {
                console.log(err)
            }
        }
        setup()
    }, [])


    const { signOut } = React.useContext(AuthContext)

    const signoutHandle = () => {
        try {
            axios.post('/users/logout')
            signOut()
        } catch (err) {
            console.log(err)
        }

    }

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Image fadeDuration={0} style={{ height: 100, width: 100 }} source={{ uri: `https://park-zapp.herokuapp.com/users/5f3cdf5a6b32c400174d6fd2/avatar` }}></Image>
            <Text>Logged in as {userProfile ? userProfile.name : ''}</Text>
            <Button title='Log Out' onPress={() => signoutHandle()}></Button>

        </View>
    )
}