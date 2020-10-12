import React, { useEffect } from 'react'
import { Text, View, FlatList, StyleSheet, TouchableOpacity } from 'react-native'
import Moment from 'moment'
import milisecondsToTime from '../../components/milisecondsToTime'

import axios from 'axios'
import API_URL from '../../components/apiurl'

export default function HistoryScreen(props) {
    axios.defaults.baseURL = API_URL
    axios.defaults.headers.common['Authorization'] = props.userToken

    const [sessions, setSessions] = React.useState([])
    const [loading, setLoading] = React.useState(true)

    const loadSessions = async () => {
        setLoading(true)
        try {
            let sessionList = await axios.get(`/parkingsessions/user/${props.userProfile._id}`)
            let data = sessionList.data

            //fetch and map vehicle and parking data into sessionList
            data = data.map(async session => {
                const vehicle = await axios.get(`/vehicles/${session.vehicle}`)
                const parking = await axios.get(`/parkings/${session.parking}`)
                return {
                    ...session,
                    vehicle: vehicle.data,
                    parking: parking.data
                }
            })

            Promise.all(data).then(sessions => {
                sessions = sessions.map(item => {
                    return { item, key: sessions.indexOf(item).toString() }
                })

                setSessions(sessions)
                setLoading(false)
            })

        } catch (err) {
            console.log(err)
        }
    }

    useEffect(() => {
        loadSessions()
    }, [])

    return (
        <View style={{
            alignItems: 'center',
            justifyContent: 'center',
            flex: 1
        }}>
            {
                !loading ?
                    <>
                        <TouchableOpacity style={styles.addButton} onPress={loadSessions}>
                            <View>
                                <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'white', paddingRight: 3 }}>⟲</Text>
                            </View>
                        </TouchableOpacity>
                        <FlatList
                            style={{ width: '100%', marginLeft: '10%' }}
                            data={sessions}
                            renderItem={({ item }) => (
                                <View style={styles.sessionItem}>


                                    <Text style={{ color: 'gold', fontWeight: 'bold' }}>{new Moment(item.item.timestamps.ingress).format('MMM Do, YYYY')}</Text>
                                    <Text style={{ color: 'beige', fontWeight: 'bold' }}>{item.item.parking.name.toUpperCase()}</Text>
                                    <Text style={{ color: 'silver', fontWeight: 'bold', }}>{`${item.item.parking.address.streetNumber} ${item.item.parking.address.streetName}, ${item.item.parking.address.city}`}</Text>
                                    <Text style={{ color: 'silver', fontWeight: 'bold', }}>{'Vehicle: ' + item.item.vehicle.manufacturer + ' ' + item.item.vehicle.model}</Text>
                                    <Text style={{ color: 'hotpink', fontWeight: 'bold', marginBottom: 10 }}>Rate: ${item.item.parking.charge}/hr</Text>

                                    <View style={{ display: 'flex', flexDirection: 'row' }}>
                                        <Text style={{ color: 'hotpink' }}>Parked In:       </Text>
                                        <Text style={{ color: 'white' }}>{new Moment(item.item.timestamps.ingress).format("LTS")}</Text>
                                    </View>

                                    <View style={{ display: 'flex', flexDirection: 'row' }}>
                                        <Text style={{ color: 'hotpink' }}>Parked Out:    </Text>
                                        <Text style={{ color: 'white' }}>{new Moment(item.item.timestamps.egress).format("LTS")}</Text>
                                    </View>

                                    <View style={{ display: 'flex', flexDirection: 'row' }}>
                                        <Text style={{ color: 'hotpink' }}>Duration:         </Text>
                                        <Text style={{ color: 'white' }}>{milisecondsToTime(Math.abs(new Date(item.item.timestamps.egress) - new Date(item.item.timestamps.ingress)))}</Text>
                                    </View>

                                    <View style={{ display: 'flex', flexDirection: 'row', alignSelf: 'center' }}>
                                        <Text style={{ color: 'gold', fontWeight: 'bold', fontSize: 20 }}>TOTAL: ${((Math.abs(new Date(item.item.timestamps.egress) - new Date(item.item.timestamps.ingress)) / 1000 / 60 / 60) * item.item.parking.charge).toFixed(2)}</Text>
                                        <Text style={{ color: 'white' }}>{}</Text>
                                    </View>
                                </View>



                            )}
                        >
                        </FlatList>
                    </>
                    :
                    <View>
                        <Text>Loading Sessions, Please wait....</Text>
                    </View>
            }
        </View>

    )
}

const styles = StyleSheet.create({
    sessionItem: {
        padding: 8,
        marginVertical: 5,
        width: '90%',
        borderRadius: 20,
        backgroundColor: 'gray'
    },
    addButton: {
        backgroundColor: '#f20089',
        paddingBottom: 5,
        height: 25,
        width: 25,
        marginVertical: 10,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 50
    },
})