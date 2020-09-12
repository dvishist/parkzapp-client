import React, { useEffect } from 'react'
import { Text, View, StyleSheet, FlatList, Modal, TouchableOpacity, KeyboardAvoidingView } from 'react-native'
import axios from 'axios'
import API_URL from '../../components/apiurl'
import { TextInput, ScrollView } from 'react-native-gesture-handler'


export default function VehicleScreen(props) {
    const [vehicles, setVehicles] = React.useState(null)
    const [selected, setSelected] = React.useState(props.userProfile.parkState.vehicle)
    const [modalActive, setModalActive] = React.useState(false)

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
        //update on client
        if (formValues.idNumber !== "" && formValues.model !== "" && formValues.manufacturer !== "") {
            setVehicles([
                ...vehicles,
                {
                    item: formValues,
                    key: vehicles.length.toString()
                }
            ])

            //update on server
            const { manufacturer, model, idNumber } = formValues
            try {
                await axios.post('vehicles', { manufacturer, model, idNumber })
                loadVehicles()
            } catch (err) {
                console.log(err)
            }
        }
    }

    //delete Vehicle
    const deleteVehicle = async (id) => {
        //update on client
        setVehicles(vehicles.filter(item => item.item._id !== id))

        //update on server
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



    if (!modalActive) {
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
                                <View style={{ ...styles.vehicleItem, backgroundColor: item.item._id == selected ? '#758bfd' : 'darkgray' }}>
                                    <Text style={styles.headingText}>{`${item.item.manufacturer} ${item.item.model}`.toUpperCase()}</Text>
                                    <Text>{`Number: ${new String(item.item.idNumber.toUpperCase())}`}</Text>
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

            </View >
        )
    } else {
        return (
            <Modal
                backgroundColor="black"
                visible={modalActive}
                transparent={true}
                style={styles.registerModal}
                animationType="slide"
            >
                <View
                    style={styles.addVehicle}
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
                    <Text style={{ color: 'white' }}>Manufacturer</Text>
                    <TextInput style={styles.textInput} placeholder={'Nissan'} onChangeText={value => { formInputChange('manufacturer', value) }}></TextInput>
                    <Text style={{ color: 'white' }}>Model</Text>
                    <TextInput style={styles.textInput} placeholder={'Skyline'} onChangeText={value => { formInputChange('model', value) }}></TextInput>
                    <Text style={{ color: 'white' }}>Identification Number</Text>
                    <TextInput style={styles.textInput} placeholder={'A1B2C3'} onChangeText={value => { formInputChange('idNumber', value) }}></TextInput>
                    <TouchableOpacity
                        style={{ alignItems: 'center', marginTop: 17 }}
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
                        <Text style={{ fontSize: 20, borderRadius: 25, backgroundColor: '#00BFA5', width: '50%', textAlign: 'center', padding: 5 }}>
                            REGISTER
                        </Text>
                    </TouchableOpacity>
                </View>
            </Modal>
        )
    }
}


const styles = StyleSheet.create({
    container: {
        paddingTop: 15,
        justifyContent: 'center',
        alignItems: 'center'
    },
    vehicleItem: {
        padding: 8,
        marginVertical: 5,
        width: 270,
        borderBottomStartRadius: 18,
        borderTopStartRadius: 18
    },
    deleteVehicleButton: {
        backgroundColor: 'red',
        padding: 8,
        marginVertical: 5,
        height: '89.1%',
        justifyContent: 'center',
        borderTopEndRadius: 18,
        borderBottomEndRadius: 18
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
        paddingHorizontal: 20,
        paddingVertical: 8,
        margin: 18,
        borderRadius: 35
    },
    addButton: {
        backgroundColor: '#f20089',
        paddingBottom: 5,
        height: 70,
        width: 70,
        marginVertical: 10,
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
    }

})