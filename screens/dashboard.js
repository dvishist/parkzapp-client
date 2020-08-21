import React, { useEffect } from 'react'
import { View, Text, Button, Image } from 'react-native'
import axios from 'axios'

import { NavigationContainer } from '@react-navigation/native'
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs'
import Ionicons from 'react-native-vector-icons/Ionicons'



import { AuthContext } from '../components/context'
import HomeScreen from '../screens/appScreens/HomeScreen'
import ProfileScreen from '../screens/appScreens/ProfileScreen'


export default function Dashboard() {



    const { signOut } = React.useContext(AuthContext)

    const signoutHandle = () => {
        try {
            axios.post('/users/logout')
            signOut()
        } catch (err) {
            console.log(err)
        }

    }

    const Tabs = createMaterialBottomTabNavigator()

    return (
        <NavigationContainer>
            <Tabs.Navigator
                activeColor='white'
                inactiveColor='gray'
                barStyle={{ backgroundColor: '#5cdb94' }}
                screenOptions={({ route }) => ({
                    tabBarIcon: ({ focused }) => {
                        let iconName
                        let color
                        if (route.name === 'Login') {
                            iconName = 'ios-person'
                            color = focused ? 'white' : 'gray'
                        } else {
                            iconName = 'md-person-add'
                            color = focused ? 'white' : 'gray'
                        }
                        switch (route.name) {
                            case 'Home':
                                iconName = 'ios-person'
                                color = focused ? 'white' : 'gray'
                            case 'Profile':
                                iconName = 'ios-person'
                                color = focused ? 'white' : 'gray'

                        }

                        return <Ionicons name={iconName} size={20} color={color} />
                    }
                })}
            >
                <Tabs.Screen name='Home' component={HomeScreen} />
                <Tabs.Screen name='Profile' component={ProfileScreen} />
            </Tabs.Navigator>
        </NavigationContainer>

    )
}