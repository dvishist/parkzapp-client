import React, { useEffect } from 'react'
import { Text, View, StyleSheet, Image, ScrollView, TouchableOpacity, Dimensions, Platform } from 'react-native'
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps'
import * as Permissions from 'expo-permissions'
import mapStyle from '../../components/mapstyle'

import axios from 'axios'
import API_URL from '../../components/apiurl'


export default function HomeScreen(props) {

    const [parkingsNearby, setParkingsNearby] = React.useState([])
    const [parkState, setParkState] = React.useState({
        state: 'searching',
    })
    const [selectedParking, setSelectedParking] = React.useState({})


    axios.defaults.baseURL = API_URL
    axios.defaults.headers.common['Authorization'] = props.userToken

    //by default set location to Melbourne coordinates
    const [locationState, setLocationState] = React.useState({
        latitude: -37.8136,
        longitude: 144.9631,
        latitudeDelta: 0.03,
        longitudeDelta: 0.03

    })

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

    const selectParking = parking => {
        setParkState({
            state: 'driving',
        })
        setSelectedParking(parking)
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
            >
                {
                    //parking lot markers
                    parkingsNearby && parkState.state === 'searching' ?
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
                            <TouchableOpacity style={styles.selectButton} onPress={() => { selectParking({ ...parking.parking, distance: parking.distance }) }}>
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
                        <Text>Distance:{`${(selectedParking.distance / 1000).toFixed(2)}km`}</Text>

                        <TouchableOpacity style={styles.cancelButton} onPress={() => { setParkState({ state: 'searching' }) }}>
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
    header: {
        borderRadius: 20,
        position: 'absolute',
        zIndex: 1,
        resizeMode: 'contain',
        width: 220,
        alignSelf: 'center'

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