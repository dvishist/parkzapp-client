import React, { useEffect } from 'react'
import { Text, View, StyleSheet, FlatList, TouchableOpacity, ScrollView, Button } from 'react-native'
import axios from 'axios'
import API_URL from '../../components/apiurl'
import { TextInput } from 'react-native-gesture-handler'

export default function VehicleScreen(props) {
    const [vehicles, setVehicles] = React.useState(null)
    const [selected, setSelected] = React.useState(props.userProfile.parkState.vehicle)

    const [formValues, setFormValues] = React.useState({
        manufacturer: "",
        model: "",
        idNumber: ""
    })

    axios.defaults.baseURL = API_URL
    axios.defaults.headers.common['Authorization'] = props.userToken


    //update state on form Input change
    const formInputChange = (field, value) => {
        setFormValues({
            ...formValues,
            [field]: value
        })
    }

    //load vehicles from server
    const loadVehicles = async () => {
        try {
            const { data } = await axios.get('/users/vehicles')
            const vehicleList = data.map(item => {
                return { item, key: data.indexOf(item).toString() }
            })
            setVehicles(vehicleList)
        } catch (err) {
            console.log(err)
        }
    }

    //set selected vehicle on Parkstate
    const setSelectedVehicle = async (id) => {
        setSelected(id)
        try {
            await axios.post(`users/vehicle/${id}`)
        } catch (err) {
            console.log(err)
        }
    }

    //register button handler
    const registerVehicle = async () => {
        const { manufacturer, model, idNumber } = formValues
        try {
            const vehicle = await axios.post('vehicles', { manufacturer, model, idNumber })
            loadVehicles()
        } catch (err) {
            console.log(err)
        }
    }

    //delete Vehicle
    const deleteVehicle = async (id) => {
        try {
            await axios.delete(`/vehicles/${id}`)
            loadVehicles()
        } catch (err) {
            console.lof(err)
        }

    }



    useEffect(() => {
        loadVehicles()
    }, [])



    return (
        <View style={styles.container}>
            <Text style={{ ...styles.headingText, color: 'darkslategray', alignSelf: 'center' }}>REGISTERED VEHICLES</Text>
            <Text style={{ alignSelf: 'center' }}>Please select the vehicle in use</Text>
            <FlatList
                style={{ marginVertical: 10 }}
                data={vehicles}
                renderItem={({ item }) => (
                    <View style={styles.vehicleContainer}>
                        <TouchableOpacity delayPressIn={5} onPress={() => { setSelectedVehicle(item.item._id) }}>
                            <View style={{ ...styles.vehicleItem, backgroundColor: item.item._id == selected ? '#34eb92' : 'darkgray' }}>
                                <Text style={styles.headingText}>{`${item.item.manufacturer} ${item.item.model}`.toUpperCase()}</Text>
                                <Text>{`Number: ${new String(item.item.idNumber)}`}</Text>
                                <Text>{`Registered on: ${new Date(item.item.createdAt).toDateString()}`}</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => { deleteVehicle(item.item._id) }} style={styles.deleteVehicleButton}>
                            <Text style={{ color: 'white' }}>Delete</Text>
                        </TouchableOpacity>
                    </View>
                )}
            />
            {/* <View style={styles.addVehicle}>
                <Text style={styles.headingText}>REGISTER NEW VEHICLE</Text>
                <Text>Manufacturer</Text>
                <TextInput style={styles.textInput} placeholder={'Nissan'} onChangeText={value => { formInputChange('manufacturer', value) }}></TextInput>
                <Text>Model</Text>
                <TextInput style={styles.textInput} placeholder={'Skyline'} onChangeText={value => { formInputChange('model', value) }}></TextInput>
                <Text>Identification Number</Text>
                <TextInput style={styles.textInput} placeholder={'A1B2C3'} onChangeText={value => { formInputChange('idNumber', value) }}></TextInput>
                <Button title={"REGISTER"} onPress={registerVehicle} />
            </View> */}
        </View>
    )
}


const styles = StyleSheet.create({
    container: {
        padding: 15,
        flex: 1
    },
    vehicleItem: {
        padding: 8,
        marginVertical: 5,
        width: 270,
        borderTopStartRadius: 12,
        borderBottomStartRadius: 12
    },
    headingText: {
        fontWeight: 'bold',
        fontSize: 20,
        color: 'white'
    },
    addVehicle: {
        backgroundColor: '#5dd1e3',
        padding: 10
    },
    text: {
        fontSize: 15,
        fontWeight: 'bold',
        color: 'beige',
        paddingLeft: 8
    },
    textInput: {
        borderRadius: 5,
        backgroundColor: 'white',
        height: 30,
        marginVertical: 5,
        paddingHorizontal: 5
    },
    vehicleContainer: {
        width: '100%',
        flexDirection: 'row',
        flex: 1,
        justifyContent: 'center'
    },
    deleteVehicleButton: {
        backgroundColor: 'red',
        padding: 8,
        marginVertical: 5,
        height: '89%',
        justifyContent: 'center',
        borderTopEndRadius: 12,
        borderBottomEndRadius: 12
    }
})