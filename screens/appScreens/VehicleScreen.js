import React, { useEffect } from 'react'
import { Text, View, StyleSheet, FlatList, TouchableOpacity, ScrollView, Button } from 'react-native'
import axios from 'axios'
import API_URL from '../../components/apiurl'
import { TextInput } from 'react-native-gesture-handler'

export default function VehicleScreen(props) {
    const [vehicles, setVehicles] = React.useState(null)
    const [selected, setSelected] = React.useState(0)

    const [formValues, setFormValues] = React.useState(null)

    axios.defaults.baseURL = API_URL
    axios.defaults.headers.common['Authorization'] = props.userToken


    //set the clicked vehicle to selected
    const setSelectedVehicle = key => {
        setSelected(key)
    }

    //update state on form Input change
    const formInputChange = (field, value) => {
        setFormValues({
            ...formValues,
            [field]: value
        })
    }

    //register button handler
    const registerHandler = async () => {
        const { manufacturer, model, idNumber } = formValues
        try {
            const vehicle = await axios.post('/vehicles', { manufacturer, model, idNumber })
        } catch (err) {
            console.log(err)
        }
    }

    //load vehicles from server
    useEffect(() => {
        async function setup() {
            try {
                const { data } = await axios.get('users/vehicles')
                const vehicleList = data.map(item => {
                    return { item, key: data.indexOf(item).toString() }
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
            <Text style={{ ...styles.headingText, color: 'darkslategray', alignSelf: 'center' }}>REGISTERED VEHICLES</Text>
            <FlatList
                style={{ marginVertical: 10 }}
                data={vehicles}
                renderItem={({ item }) => (
                    <TouchableOpacity onPress={() => { setSelectedVehicle(item.key) }}>
                        <View style={{ ...styles.vehicleItem, backgroundColor: item.key == selected ? '#34eb92' : 'darkgray' }}>
                            <Text style={styles.headingText}>{`${item.item.manufacturer} ${item.item.model}`.toUpperCase()}</Text>
                            <Text >{new String(item.item.idNumber)}</Text>
                            <Text >{`Registered on: ${new Date(item.item.createdAt).toDateString()}`}</Text>
                        </View>
                    </TouchableOpacity>
                )}
            />
            <View style={styles.addVehicle}>
                <Text style={styles.headingText}>REGISTER NEW VEHICLE</Text>
                <Text>Manufacturer</Text>
                <TextInput style={styles.textInput} placeholder={'Nissan'} onChangeText={value => { formInputChange('manufacturer', value) }}></TextInput>
                <Text>Model</Text>
                <TextInput style={styles.textInput} placeholder={'Skyline'} onChangeText={value => { formInputChange('model', value) }}></TextInput>
                <Text>Identification Number</Text>
                <TextInput style={styles.textInput} placeholder={'A1B2C3'} onChangeText={value => { formInputChange('inNumber', value) }}></TextInput>
                <Button title={"REGISTER"} onPress={registerHandler} />
            </View>
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
        padding: 8,
        marginVertical: 5,
        borderRadius: 2
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
    }
})