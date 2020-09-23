import React, { useEffect } from 'react'
import { Text, View, StyleSheet } from 'react-native'
import MapView from 'react-native-maps'
import * as Permissions from 'expo-permissions'

import axios from 'axios'
import API_URL from '../../components/apiurl'


export default function HomeScreen(props) {

    axios.defaults.baseURL = API_URL
    axios.defaults.headers.common['Authorization'] = props.userToken

    //by default set location to Melbourne coordinates
    const [locationState, setState] = React.useState({
        latitude: -37.8136,
        longitude: 144.9631,
        latitudeDelta: 0.03,
        longitudeDelta: 0.03

    })

    async function getLocation() {
        try {
            const { status } = await Permissions.getAsync(Permissions.LOCATION)
            if (status !== 'granted') {
                await Permissions.askAsync(Permissions.LOCATION)
            }
            navigator.geolocation.getCurrentPosition(
                ({ coords: { latitude, longitude } }) => {
                    setState({ ...locationState, latitude, longitude })
                },
                error => console.log(error)
            )
        } catch (err) {
            console.log(err)
        }

    }

    async function getParkingsNearby() {
        try {
            const parkings = await axios.post('/parkings/findNearby', {
                latitude: locationState.latitude,
                longitude: locationState.longitude
            })
            parkings.data.forEach(item => {
                console.log(`Name : ${item.parking.name}`)
                console.log(`Address : ${JSON.stringify(item.parking.address)}`)
                console.log(`Distance : ${item.distance / 1000}km`)
                console.log('       ')
            })
        } catch (err) {
            console.log(err)
        }
    }



    useEffect(() => {
        getLocation()
        getParkingsNearby()
    }, [])

    return (
        <MapView
            showsUserLocation
            style={styles.map}
            provider="google"
            region={{
                latitude: locationState.latitude,
                longitude: locationState.longitude,
                latitudeDelta: locationState.latitudeDelta,
                longitudeDelta: locationState.longitudeDelta
            }}
        >

        </MapView>

    )
}


const styles = StyleSheet.create({
    map: {
        flex: 1
    }
})