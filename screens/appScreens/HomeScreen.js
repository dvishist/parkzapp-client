import React, { useEffect } from 'react'
import { Text, View, StyleSheet, Image } from 'react-native'
import MapView from 'react-native-maps'
import * as Permissions from 'expo-permissions'
import mapStyle from '../../components/mapstyle'

import axios from 'axios'
import API_URL from '../../components/apiurl'


export default function HomeScreen(props) {

    const [parkingsNearby, setParkingsNearby] = React.useState([])

    axios.defaults.baseURL = API_URL
    axios.defaults.headers.common['Authorization'] = props.userToken

    //by default set location to Melbourne coordinates
    const [locationState, setLocationState] = React.useState({
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
                async ({ coords: { latitude, longitude } }) => {
                    setLocationState({ ...locationState, latitude, longitude })
                    const { data } = await axios.post('/parkings/findNearby', { latitude, longitude })
                    setParkingsNearby(data)
                },
                error => console.log(error)
            )
        } catch (err) {
            console.log(err)
        }

    }



    useEffect(() => {
        getLocation()

    }, [])

    return (
        <MapView
            showsUserLocation
            style={styles.map}
            customMapStyle={mapStyle}
            provider="google"
            region={{
                latitude: locationState.latitude,
                longitude: locationState.longitude,
                latitudeDelta: locationState.latitudeDelta,
                longitudeDelta: locationState.longitudeDelta
            }}
        >
            {
                parkingsNearby ?
                    parkingsNearby.map(parking => {
                        return (
                            <MapView.Marker
                                key={parkingsNearby.indexOf(parking)}
                                coordinate={parking.parking.coordinates}
                                title={parking.parking.name}
                                description={`${parking.parking.address.streetNumber} ${parking.parking.address.streetName}, ${parking.parking.address.city} `}
                            >
                                <Image source={require('../../assets/marker.png')}
                                    style={{ height: 40, width: 40 }}
                                >

                                </Image>

                            </MapView.Marker>
                        )
                    })
                    : null
            }

        </MapView>

    )
}


const styles = StyleSheet.create({
    map: {
        flex: 1
    }
})
