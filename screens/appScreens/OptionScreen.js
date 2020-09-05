import React, { useEffect } from 'react'
import { Text, View, Button, Image } from 'react-native'
import axios from 'axios'
import API_URL from '../../components/apiurl'
import AsyncStorage from '@react-native-community/async-storage'
import { AuthContext } from '../../components/context'

export default function OptionScreen(props) {
    userProfile = props.userProfile
    const { signOut } = React.useContext(AuthContext)

    const signOutHandle = () => {
        signOut()
    }

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            {userProfile ?
                <Image
                    onLoad={() => null}
                    fadeDuration={0}
                    style={{ height: 150, width: 150, backgroundColor: 'gray', borderRadius: 100 }}
                    defaultource={require('../../assets/user.jpg')}
                    source={{ uri: `https://park-zapp.herokuapp.com/users/${userProfile._id}/avatar` }}
                >
                </Image>
                : null
            }
            <Text>Logged in as {userProfile ? userProfile.name : ''}</Text>
            <Button title='Log Out' onPress={() => signOutHandle()}></Button>

        </View>
    )
}