import React, { useEffect } from 'react'
import { Text, View, FlatList, Card, CardItem } from 'react-native'
import axios from 'axios'
import API_URL from '../../components/apiurl'
import AsyncStorage from '@react-native-community/async-storage'
import { Title } from 'react-native-paper'

export default function VehicleScreen() {
    const [vehicles, setVehicles] = React.useState(null)

    axios.defaults.baseURL = API_URL;
    useEffect(() => {
        async function setup() {
            try {
                const userToken = await AsyncStorage.getItem('userToken')
                axios.defaults.headers.common['Authorization'] = userToken
                const { data } = await axios.get('users/vehicles')
                setVehicles(data)
                console.log(vehicles)
            } catch (err) {
            }
        }
        setup()
    }, [])

    return (
        <View style={{
            alignItems: 'center',
            justifyContent: 'center',
            flex: 1
        }}>

        </View>

    )
}
