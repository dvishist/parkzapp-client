import React, { useEffect, useRef } from 'react'
import { Text, View, StyleSheet, Image, ScrollView, TouchableOpacity, Dimensions, Platform } from 'react-native'
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps'
import * as Permissions from 'expo-permissions'
import mapStyle from '../../components/mapstyle'
import API_KEY from '../../components/apiKey'
import MapViewDirections from 'react-native-maps-directions';
import * as geolib from 'geolib'

import axios from 'axios'
import API_URL from '../../components/apiurl'


export default function HomeScreen(props) {

    const [parkingsNearby, setParkingsNearby] = React.useState([])
    const [parkState, setParkState] = React.useState({ state: 'searching' })
    const [selectedParking, setSelectedParking] = React.useState({})
    const [distanceToParking, setDistanceToParking] = React.useState(0)


    axios.defaults.baseURL = API_URL
    axios.defaults.headers.common['Authorization'] = props.userToken

    //by default set location to Melbourne coordinates
    const [locationState, setLocationState] = React.useState({
        latitude: -37.8136,
        longitude: 144.9631,
        latitudeDelta: 0.03,
        longitudeDelta: 0.03

    })

    const map = useRef(null)

    const getLocation = async () => {
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

    const selectParking = (parking, distance) => {
        setParkState({
            state: 'driving',
        })
        setSelectedParking(parking)
        setDistanceToParking(distance)
        setLocationState({
            ...locationState,
            latitudeDelta: 0.003,
            longitudeDelta: 0.003
        })
    }

    const updateDistance = () => {
        if (parkState.state === 'driving') {
            navigator.geolocation.getCurrentPosition(
                async ({ coords: { latitude, longitude } }) => {
                    let distance = geolib.getDistance(
                        {
                            latitude,
                            longitude
                        },
                        selectedParking.coordinates,
                        1)

                    //update distance on selected parking state
                    setSelectedParking(selectedParking)
                    setDistanceToParking(distance)

                    //if distance is less than 10m, consider arrived
                    if (distance <= 100) {
                        setParkState({ state: 'arrived' })
                    }
                }
            )
        }
    }

    useEffect(() => {
        getLocation()
    }, [])

    return (
        <>
            <Image
                source={require('../../assets/header.png')}
                style={styles.header}
            />
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
                ref={map}
                onUserLocationChange={parkState.state === 'driving' ? updateDistance : null}
            >
                {
                    //parking lot markers
                    parkingsNearby && parkState.state === 'searching' ?
                        parkingsNearby.map(parking => (
                            <MapView.Marker
                                provider={PROVIDER_GOOGLE}
                                coordinate={parking.parking.coordinates}
                                key={parkingsNearby.indexOf(parking)}
                                title={parking.parking.name.toUpperCase()}
                                description={`${parking.parking.address.streetNumber} ${parking.parking.address.streetName}, ${parking.parking.address.city}`}
                            >
                            </MapView.Marker>
                        ))
                        : null
                }

                {
                    //directions to selected parking lot
                    parkState.state === 'driving' && selectedParking ?
                        <MapViewDirections
                            origin={{ latitude: locationState.latitude, longitude: locationState.longitude }}
                            destination={selectedParking.coordinates}
                            apikey={API_KEY}
                            strokeWidth={8}
                            strokeColor='hotpink'
                            optimizeWaypoints={true}
                        />
                        : null
                }

                {
                    parkState.state === 'driving' && selectedParking ?
                        <MapView.Marker
                            provider={PROVIDER_GOOGLE}
                            coordinate={selectedParking.coordinates}
                        >
                        </MapView.Marker>
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
                {parkingsNearby && parkState.state === 'searching' ?
                    parkingsNearby.map(parking => (
                        <View
                            key={parkingsNearby.indexOf(parking)}
                            style={styles.parkingCardItem}
                        >
                            <Text style={{ color: '#6115d4', fontWeight: 'bold', fontSize: 18 }}>{parking.parking.name.toUpperCase()}</Text>
                            <Text style={{ color: 'darkslategray' }}>{`${parking.parking.address.streetNumber} ${parking.parking.address.streetName}, ${parking.parking.address.city}`}</Text>
                            <Text>{`${(parking.distance / 1000).toFixed(2)}km   ${parking.parking.capacity - parking.parking.occupants}/${parking.parking.capacity} Available`}</Text>
                            <Text style={{ color: 'magenta', fontSize: 20 }}>{`$${parking.parking.charge}/hr`}</Text>
                            <TouchableOpacity style={styles.selectButton} onPress={() => { selectParking(parking.parking, parking.distance) }}>
                                <Text style={{ fontWeight: 'bold', color: '#ff196e' }}>SELECT</Text>
                            </TouchableOpacity>
                        </View>
                    ))
                    : null
                }
            </ScrollView>
            {
                //State : Driving to Parking
                parkState.state === 'driving' ?

                    <View style={styles.drivingInfo}>
                        <Text>Driving To</Text>
                        <Text style={{ color: '#ff196e', fontSize: 17 }}>{selectedParking.name}</Text>
                        <Text>{`${selectedParking.address.streetNumber} ${selectedParking.address.streetName}, ${selectedParking.address.city}`}</Text>
                        <Text>Distance:{
                            distanceToParking > 1000 ?
                                `${(distanceToParking / 1000).toFixed(2)}km`
                                : `${distanceToParking}m`
                        }</Text>

                        <TouchableOpacity style={styles.cancelButton} onPress={() => { setParkState({ state: 'searching' }); getLocation() }}>
                            <Text style={{ color: 'white' }}>CANCEL</Text>
                        </TouchableOpacity>
                    </View>

                    : null
            }


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
        backgroundColor: '#ebe6e8',
        padding: 5,
        borderWidth: 0.5,
        borderColor: '#ff196e',
        width: '100%',
        alignItems: 'center',
        alignSelf: 'center',
        borderRadius: 10
    },
    drivingInfo: {
        backgroundColor: 'white',
        width: '90%',
        height: '20%',
        alignSelf: 'center',
        position: 'absolute',
        bottom: 30,
        borderRadius: 15,
        padding: 10,
    },
    cancelButton: {
        backgroundColor: 'red',
        borderRadius: 5,
        width: '22%',
        alignItems: 'center',
        alignSelf: 'center'
    }
})