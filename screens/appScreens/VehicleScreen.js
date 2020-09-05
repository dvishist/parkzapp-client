import React, { useEffect } from 'react'
import { Text, View, StyleSheet, FlatList, TouchableOpacity, ScrollView } from 'react-native'
import axios from 'axios'
import API_URL from '../../components/apiurl'
import AsyncStorage from '@react-native-community/async-storage'

export default function VehicleScreen(props) {
    const [vehicles, setVehicles] = React.useState(null)
    axios.defaults.baseURL = API_URL
    axios.defaults.headers.common['Authorization'] = props.userToken

    //load vehicles from server
    useEffect(() => {
        async function setup() {
            try {
                const { data } = await axios.get('users/vehicles')
                const vehicleList = data.map(item => {
                    return { item, key: data.indexOf(item) }
                })
                setVehicles(vehicleList)
            } catch (err) {
                console.log(err)
            }
        }
        setup()
    }, [])

    return (
        <View style={styles.container}>
            <Text style={{ alignSelf: 'center' }}>REGISTERED VEHICLES</Text>
            <FlatList
                data={vehicles}
                renderItem={({ item }) => (
                    <TouchableOpacity>
                        <View style={{ ...styles.vehicleItem, backgroundColor: item.item.model == 'R8' ? 'green' : 'silver' }}>
                            <Text style={styles.headingText}>{`${item.item.manufacturer} ${item.item.model}`.toUpperCase()}</Text>
                            <Text >{item.item.idNumber}</Text>
                            <Text >{`Registered on: ${new Date(item.item.createdAt).toDateString()}`}</Text>
                        </View>
                    </TouchableOpacity>

                )}
            />
        </View>
    )
}


const styles = StyleSheet.create({
    container: {
        padding: 15,
        flex: 1
    },
    vehicleItem: {
        borderColor: 'black',
        borderWidth: 1,
        padding: 8,
        marginVertical: 5,
        backgroundColor: 'silver',
        borderRadius: 20
    },
    headingText: {
        fontWeight: 'bold',
        fontSize: 20
    }
})