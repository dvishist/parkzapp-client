import React, { useEffect } from 'react';
import { StyleSheet, ActivityIndicator, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs'
import Ionicons from 'react-native-vector-icons/Ionicons'
import AsyncStorage from '@react-native-community/async-storage'

import Dashboard from './screens/dashboard'

import { AuthContext } from './components/context'

import Auth from './screens/auth/auth'

const Tabs = createMaterialBottomTabNavigator()

export default function App() {
  // const [isLoading, setIsLoading] = React.useState(true)
  // const [userToken, setUserToken] = React.useState(null)


  //setup starting state of the app
  const initialLoginState = {
    isLoading: false,
    email: null,
    userToken: null
  }

  //reducer to execute different authentication scenarios
  const loginReducer = (prevState, action) => {
    switch (action.type) {
      case 'check-token':
        return {
          ...prevState,
          isLoading: false,
          userToken: action.token
        }
      case 'login':
        return {
          ...prevState,
          isLoading: false,
          userToken: action.token,
          email: action.email
        }
      case 'logout':
        return {
          ...prevState,
          isLoading: false,
          userToken: null,
          email: null
        }
      case 'signup':
        return {
          ...prevState, isLoading: false
        }
    }
  }

  //using the reducer to handle auth events (login,signup,logout and app bootup)
  const [loginState, dispatch] = React.useReducer(loginReducer, initialLoginState)

  //define the actual functions to execute on each event
  const authContext = React.useMemo(() => ({
    signIn: async (email, userToken) => {
      try {
        await AsyncStorage.setItem('userToken', userToken)
      } catch (e) {
        console.log(e)
      }
      dispatch({ type: 'login', email, token: userToken })
    },
    signOut: async () => {
      try {
        await AsyncStorage.removeItem('userToken')
      } catch (e) {
        console.log(e)
      }
      dispatch({ type: 'logout' })

    },
    // signUp: async (email,password) => {
    //   try {
    //     await AsyncStorage.setItem('userToken',userToken)
    //   } catch (e) {
    //     console.log(e)
    //   }
    //   dispatch({ type: 'logout' })
    // }
  }), [])

  useEffect(() => {
    async function getToken() {
      let userToken = null
      try {
        userToken = await AsyncStorage.getItem('userToken')
      } catch (e) {
        console.log(e)
      }
      dispatch({ type: 'check-token', token: userToken })
    }
    getToken()
  }, [])

  if (loginState.isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size='large' />
      </View>
    )
  }


  //verify user logged in and show the dashboard or login page respective to the scenario
  if (loginState.userToken) {
    return (
      <AuthContext.Provider value={authContext}>
        <Dashboard></Dashboard>
      </AuthContext.Provider>

    )
  } else {
    return (
      <AuthContext.Provider value={authContext}>
        <Auth></Auth>
      </AuthContext.Provider>
    )
  }


}