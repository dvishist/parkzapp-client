import React, { useEffect } from 'react';

import AsyncStorage from '@react-native-community/async-storage'

import Dashboard from './screens/dashboard'

import { AuthContext } from './components/context'

import Auth from './screens/auth/auth'

export default function App() {

  //setup starting state of the app
  const initialLoginState = {
    isLoading: false,
    email: null,
    id: null,
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
          email: action.email,
          id: action._id
        }
      case 'logout':
        return {
          ...prevState,
          isLoading: false,
          userToken: null,
          email: null,
          id: null
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
    signIn: async (email, _id, userToken) => {
      try {
        await AsyncStorage.setItem('userToken', userToken)
      } catch (e) {
        console.log(e)
      }
      dispatch({ type: 'login', email, _id, token: userToken })
    },
    signOut: async () => {
      try {
        await AsyncStorage.removeItem('userToken')
      } catch (e) {
        console.log(e)
      }
      dispatch({ type: 'logout' })

    }
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