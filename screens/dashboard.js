import React from 'react'
import { View, Text, Button, Image, StatusBar } from 'react-native'

import { NavigationContainer } from '@react-navigation/native'
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs'
import Ionicons from 'react-native-vector-icons/Ionicons'


import HomeScreen from './appScreens/HomeScreen'
import HistoryScreen from '../screens/appScreens/HistoryScreen'
import VehicleScreen from '../screens/appScreens/VehicleScreen'
import OptionScreen from './appScreens/OptionScreen'


export default function Dashboard() {
    const Tabs = createMaterialBottomTabNavigator()

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
                    <Tabs.Screen name='Home' component={HomeScreen} />
                    <Tabs.Screen name='Vehicles' component={VehicleScreen} />
                    <Tabs.Screen name='History' component={HistoryScreen} />
                    <Tabs.Screen name='Options' component={OptionScreen} />
                </Tabs.Navigator>
            </NavigationContainer>
        </>
    )
}