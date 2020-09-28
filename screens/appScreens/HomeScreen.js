import React, { useEffect } from 'react'
import { Text, View, StyleSheet, Image, ScrollView, TouchableOpacity, Dimensions, Platform } from 'react-native'
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps'
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
                    const filtered = data.filter(parking => parking.parking.capacity > parking.parking.occupants)
                    setParkingsNearby(filtered)
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
        <>
            <MapView
                showsUserLocation
                style={styles.map}
                provider="google"
                customMapStyle={mapStyle}
                region={{
                    latitude: locationState.latitude,
                    longitude: locationState.longitude,
                    latitudeDelta: locationState.latitudeDelta,
                    longitudeDelta: locationState.longitudeDelta
                }}
            >
                {
                    parkingsNearby ?
                        parkingsNearby.map(parking => (
                            <MapView.Marker
                                provide={PROVIDER_GOOGLE}
                                coordinate={parking.parking.coordinates}
                                key={parkingsNearby.indexOf(parking)}
                                title={parking.parking.name.toUpperCase()}
                                description={`${parking.parking.address.streetNumber} ${parking.parking.address.streetName}, ${parking.parking.address.city}`}
                            >

                            </MapView.Marker>
                        ))
                        : null
                }
            </MapView>
            <ScrollView
                horizontal
                scrollEventThrottle={1}
                showsHorizontalScrollIndicator={false}
                style={styles.parkingList}
                pagingEnabled
                snapToInterval={(Dimensions.get('window').width * 0.8) + 20}
                snapToAlignment={'center'}
                contentInset={{
                    top: 0,
                    left: (Dimensions.get('window').width * 0.1 - 10),
                    bottom: 0,
                    right: (Dimensions.get('window').width * 0.1 - 10)
                }}
                contentContainerStyle={{
                    paddingHorizontal: Platform.OS === 'android' ? (Dimensions.get('window').width * 0.1 - 10) : 0
                }}
            >
                {parkingsNearby ?
                    parkingsNearby.map(parking => (
                        <View
                            key={parkingsNearby.indexOf(parking)}
                            style={styles.parkingCardItem}
                        >
                            <Text style={{ color: '#6115d4', fontWeight: 'bold', fontSize: 18 }}>{parking.parking.name.toUpperCase()}</Text>
                            <Text style={{ color: 'darkslategray' }}>{`${parking.parking.address.streetNumber} ${parking.parking.address.streetName}, ${parking.parking.address.city}`}</Text>
                            <Text>{`${(parking.distance / 1000).toFixed(2)}km   ${parking.parking.capacity - parking.parking.occupants}/${parking.parking.capacity} Available`}</Text>
                            <Text style={{ color: 'magenta', fontSize: 20 }}>{`$${parking.parking.charge}/hr`}</Text>
                            <TouchableOpacity style={styles.selectButton}>
                                <Text style={{ fontWeight: 'bold' }}>SELECT</Text>
                            </TouchableOpacity>
                        </View>
                    ))
                    : null
                }
            </ScrollView>
        </>

    )
}


const styles = StyleSheet.create({
    map: {
        flex: 1
    },
    parkingList: {
        position: 'absolute',
        bottom: 30
    },
    parkingCardItem: {
        backgroundColor: 'white',
        borderRadius: 15,
        marginHorizontal: 10,
        padding: 10,
        width: Dimensions.get('window').width * 0.8
    },
    selectButton: {
        backgroundColor: 'silver',
        padding: 5,
        borderWidth: 0.5,
        width: '100%',
        alignItems: 'center',
        alignSelf: 'center',
        borderRadius: 10
    }
})