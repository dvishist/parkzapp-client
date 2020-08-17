import React, { useEffect } from 'react';
import { StyleSheet, ActivityIndicator, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs'
import Ionicons from 'react-native-vector-icons/Ionicons'

import Dashboard from './screens/dashboard'

import { AuthContext } from './components/context'

import Auth from './screens/auth/auth'

const Tabs = createMaterialBottomTabNavigator()

export default function App() {
  // const [isLoading, setIsLoading] = React.useState(true)
  // const [userToken, setUserToken] = React.useState(null)

  const initialLoginState = {
    isLoading: true,
    email: null,
    userToken: null
  }

  const loginReducer = (prevState, action) => {
    switch (action.type) {
      case 'check-token':
        return {
          ...prevState,
          isLoading: false,
          userToken: action.token
        }
      case 'login':
        console.log('login')
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

  const [loginState, dispatch] = React.useReducer(loginReducer, initialLoginState)

  const authContext = React.useMemo(() => ({
    signIn: (email, password) => {
      let userToken = null
      if (email === 'admin' && password === '1234') {
        userToken = 'token'
      }
      dispatch({ type: 'login', email, token: userToken })
    },
    signOut: () => {
      setUserToken(null)
      setIsLoading(false)
    },
    signUp: () => {
      setUserToken('asd')
      setIsLoading(false)
    }
  }), [])

  // useEffect(() => {
  //   dispatch({ type: 'check-token', token: 'token' })
  // })

  // if (loginState.isLoading) {
  //   return (
  //     <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
  //       <ActivityIndicator size='large' />
  //     </View>
  //   )
  // }

  if (loginState.userToken) {
    return (<Dashboard></Dashboard>)
  } else {
    return (
      <AuthContext.Provider value={authContext}>
        <Auth></Auth>
      </AuthContext.Provider>
    )
  }


}