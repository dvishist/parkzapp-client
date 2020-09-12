import React, { useEffect } from 'react'
import { Text, View, StyleSheet } from 'react-native'
import MapView from 'react-native-maps'
import * as Permissions from 'expo-permissions'


export default function HomeScreen(props) {
    //by default set location to Melbourne coordinates
    const [locationState, setState] = React.useState({
        latitude: -37.8136,
        longitude: 144.9631,
        latitudeDelta: 0.03,
        longitudeDelta: 0.03

    })

    useEffect(() => {
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
        getLocation()
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