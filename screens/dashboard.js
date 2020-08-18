import React from 'react'
import { View, Text, Button } from 'react-native'

import { AuthContext } from '../components/context'



export default function Dashboard() {
    const { signOut } = React.useContext(AuthContext)

    const signoutHandle = () => {
        signOut()
    }

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>This is the dashboard page</Text>
            <Button title='Log Out' onPress={() => signoutHandle()}></Button>
        </View>
    )
}