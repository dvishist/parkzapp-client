import React from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs'
import Ionicons from 'react-native-vector-icons/Ionicons'
import MaterialCommunityIcons from 'react-native-vector-icons'

import Login from './login'
import Signup from './signup'

const Tabs = createMaterialBottomTabNavigator()

export default function App() {
    return (
        <NavigationContainer>
            <Tabs.Navigator
                activeColor='teal'
                barStyle={{ backgroundColor: 'beige' }}
                screenOptions={({ route }) => ({
                    tabBarIcon: ({ focused }) => {
                        let iconName
                        let color
                        if (route.name === 'Login') {
                            iconName = 'ios-person'
                            color = focused ? 'teal' : 'gray'
                        } else {
                            iconName = 'md-person-add'
                            color = focused ? 'teal' : 'gray'
                        }
                        return <Ionicons name={iconName} size={20} color={color} />
                    }
                })}
            >
                <Tabs.Screen name='Login' component={Login} />
                <Tabs.Screen name='Signup' component={Signup} />
            </Tabs.Navigator>
        </NavigationContainer >
    )
}


const styles = StyleSheet.create({
    navigation: {
        backgroundColor: 'white',
        justifyContent: 'space-evenly'
    }
})