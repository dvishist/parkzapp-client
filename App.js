import React from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { LinearGradient } from 'expo-linear-gradient'
import Login from './screens/auth/login'
import Signup from './screens/auth/signup'

const Stack = createStackNavigator()

export default function App() {
  return (
    //<LoginScreen></LoginScreen>
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Signup" component={Signup} />
      </Stack.Navigator>
    </NavigationContainer>


  )
}

const styles = StyleSheet.create({

})
