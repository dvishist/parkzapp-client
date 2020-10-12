import React, { useEffect } from 'react'
import { View, Text, Button, Image, StatusBar, ActivityIndicator } from 'react-native'

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
    const [loading, setLoading] = React.useState(true)

    useEffect(() => {
        async function setup() {
            try {
                axios.defaults.headers.common['Authorization'] = props.userToken
                const { data } = await axios.get('users/self')
                setUserProfile({ ...data })
                setLoading(false)
            } catch (err) {
                console.log(err)
            }
        }
        setup()
    }, [])


    return loading ? (<ActivityIndicator size='large' style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }} />)
        :
        (
            <>
                <StatusBar backgroundColor='#ef6698'></StatusBar>

                <NavigationContainer>
                    <Tabs.Navigator
                        activeColor='white'
                        inactiveColor='gray'
                        barStyle={{ backgroundColor: '#492cac' }}
                        screenOptions={({ route }) => ({
                            tabBarIcon: ({ focused }) => {
                                let iconName
                                let color
                                switch (route.name) {
                                    case 'Home':
                                        iconName = 'md-map'
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
                        <Tabs.Screen name='Home' children={() => <HomeScreen userProfile={userProfile} userToken={props.userToken} />} />
                        <Tabs.Screen name='Vehicles' children={() => <VehicleScreen userProfile={userProfile} userToken={props.userToken} />} />
                        <Tabs.Screen name='History' children={() => <HistoryScreen userProfile={userProfile} userToken={props.userToken} />} />
                        <Tabs.Screen name='Options' children={() => <OptionScreen userProfile={userProfile} userToken={props.userToken} />} />
                    </Tabs.Navigator>
                </NavigationContainer>
            </>
        )
}