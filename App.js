import React from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { LinearGradient } from 'expo-linear-gradient'
import LoginScreen from './screens/auth/login'



export default function App() {
  return (
    <LoginScreen></LoginScreen>
  )
}

const styles = StyleSheet.create({

})
