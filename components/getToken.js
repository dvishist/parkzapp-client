import AsyncStorage from '@react-native-community/async-storage'

const getToken = async () => {
    try {
        const userToken = await AsyncStorage.getItem('userToken')
        return userToken
    } catch (err) {
        console.log(err)
    }
}

export default getToken