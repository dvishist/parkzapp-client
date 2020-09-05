import React, { useEffect } from 'react'
import { View, Text, Button, Image, StatusBar } from 'react-native'

import { NavigationContainer } from '@react-navigation/native'
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs'
import Ionicons from 'react-native-vector-icons/Ionicons'
import API_URL from '../components/apiurl'
import axios from 'axios'

import HomeScreen from './appScreens/HomeScreen'
import HistoryScreen from '../screens/appScreens/HistoryScreen'
import VehicleScreen from '../screens/appScreens/VehicleScreen'
import OptionScreen from './appScreens/OptionScreen'


export default function Dashboard(props) {
    const Tabs = createMaterialBottomTabNavigator()
    axios.defaults.baseURL = API_URL;
    const [userProfile, setUserProfile] = React.useState(null)

    useEffect(() => {
        async function setup() {
            try {
                axios.defaults.headers.common['Authorization'] = props.userToken
                const { data } = await axios.get('users/self')
                setUserProfile({ ...data })
            } catch (err) {
                console.log(err)
            }
        }
        setup()
    }, [])

    return (
        <>
            <StatusBar backgroundColor='#5cdb94'></StatusBar>
            <NavigationContainer>
                <Tabs.Navigator
                    activeColor='white'
                    inactiveColor='gray'
                    barStyle={{ backgroundColor: '#5cdb94' }}
                    screenOptions={({ route }) => ({
                        tabBarIcon: ({ focused }) => {
                            let iconName
                            let color
                            switch (route.name) {
                                case 'Home':
                                    iconName = 'ios-search'
                                    color = focused ? 'white' : 'gray'
                                    break
                                case 'History':
                                    iconName = 'ios-refresh'
                                    color = focused ? 'white' : 'gray'
                                    break
                                case 'Vehicles':
                                    iconName = 'ios-car'
                                    color = focused ? 'white' : 'gray'
                                    break
                                case 'Options':
                                    iconName = 'ios-menu'
                                    color = focused ? 'white' : 'gray'
                                    break

                            }

                            return <Ionicons name={iconName} size={20} color={color} />
                        }
                    })}
                >
                    {/* <Tabs.Screen name='Home'>{() => <HomeScreen userProfile={userProfile} />} </Tabs.Screen> */}
                    <Tabs.Screen name='Home' children={() => <HomeScreen userProfile={userProfile} userToken={props.userToken} />} />
                    <Tabs.Screen name='Vehicles' children={() => <VehicleScreen userProfile={userProfile} userToken={props.userToken} />} />
                    <Tabs.Screen name='History' children={() => <HistoryScreen userProfile={userProfile} userToken={props.userToken} />} />
                    <Tabs.Screen name='Options' children={() => <OptionScreen userProfile={userProfile} userToken={props.userToken} />} />
                </Tabs.Navigator>
            </NavigationContainer>
        </>
    )
}