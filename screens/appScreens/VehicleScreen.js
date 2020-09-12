import React, { useEffect } from 'react'
import { Text, View, StyleSheet, FlatList, Modal, TouchableOpacity, KeyboardAvoidingView } from 'react-native'
import axios from 'axios'
import API_URL from '../../components/apiurl'
import { TextInput } from 'react-native-gesture-handler'

export default function VehicleScreen(props) {
    const [vehicles, setVehicles] = React.useState(null)
    const [selected, setSelected] = React.useState(props.userProfile.parkState.vehicle)
    const [modalActive, setModalActive] = React.useState(true)

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
        setVehicles([
            ...vehicles,
            {
                item: formValues,
                key: vehicles.length.toString()
            }
        ])
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
        setVehicles(vehicles.filter(item => item.item._id !== id))
        try {
            await axios.delete(`/vehicles/${id}`)
            loadVehicles()
        } catch (err) {
            console.log(err)
        }

    }



    useEffect(() => {
        loadVehicles()
    }, [])



    return (
        <View
            style={styles.container}
            blurRadius={20}
        >
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
            <TouchableOpacity style={styles.addButton} onPress={() => { setModalActive(true) }}>
                <View>
                    <Text style={{ fontSize: 35, color: 'white' }}>+</Text>
                </View>
            </TouchableOpacity>
            <Modal
                visible={modalActive}
                transparent={true}
                style={styles.registerModal}
                animationType="slide"
            >
                <KeyboardAvoidingView
                    style={styles.addVehicle}
                    behavior="position"
                >
                    <TouchableOpacity style={styles.crossButton} onPress={() => {
                        setModalActive(false)
                        setFormValues({
                            manufacturer: "",
                            model: "",
                            idNumber: ""
                        })

                    }}>
                        <View>
                            <Text style={{ fontSize: 15, color: 'white' }}>✖</Text>
                        </View>
                    </TouchableOpacity>

                    <Text style={styles.headingModal}>REGISTER NEW VEHICLE</Text>
                    <Text style={{ color: 'white', marginTop: 20 }}>Manufacturer</Text>
                    <TextInput style={styles.textInput} placeholder={'Nissan'} onChangeText={value => { formInputChange('manufacturer', value) }}></TextInput>
                    <Text style={{ color: 'white' }}>Model</Text>
                    <TextInput style={styles.textInput} placeholder={'Skyline'} onChangeText={value => { formInputChange('model', value) }}></TextInput>
                    <Text style={{ color: 'white' }}>Identification Number</Text>
                    <TextInput style={styles.textInput} placeholder={'A1B2C3'} onChangeText={value => { formInputChange('idNumber', value) }}></TextInput>
                    <TouchableOpacity
                        style={{ alignItems: 'center', marginTop: 25 }}
                        onPress={() => {
                            registerVehicle()
                            setModalActive(false)
                            setFormValues({
                                manufacturer: "",
                                model: "",
                                idNumber: ""
                            })
                        }}
                    >
                        <Text style={{ fontSize: 20, backgroundColor: '#b3dee2', width: '50%', textAlign: 'center', padding: 8 }}>
                            REGISTER
                        </Text>
                    </TouchableOpacity>
                </KeyboardAvoidingView>
            </Modal>

        </View >
    )
}


const styles = StyleSheet.create({
    container: {
        padding: 15,
        justifyContent: 'center',
        alignItems: 'center'
    },
    vehicleItem: {
        padding: 8,
        marginVertical: 5,
        width: 250
    },
    headingText: {
        fontWeight: 'bold',
        fontSize: 20,
        color: 'white'
    },
    headingModal: {
        fontWeight: 'bold',
        fontSize: 24,
        alignSelf: 'center',
        color: 'white'
    },
    addVehicle: {
        backgroundColor: '#0c44ac',
        height: 400,
        padding: 20,
        margin: 10,
        marginTop: 130,
        borderRadius: 35
    },
    addButton: {
        backgroundColor: '#f20089',
        height: 70,
        width: 70,
        marginVertical: 15,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 50
    },
    crossButton: {
        backgroundColor: '#f20089',
        height: 30,
        width: 30,
        marginBottom: 10,
        paddingBottom: 3,
        alignSelf: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 50
    },
    registerModal: {
        justifyContent: 'center',
        margin: 20,
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
        height: '89.1%',
        justifyContent: 'center'
    }

})