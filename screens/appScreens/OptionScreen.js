import React, { useEffect } from 'react'
import { Text, View, Button, Image, StyleSheet, TouchableOpacity } from 'react-native'
import * as ImagePicker from 'expo-image-picker'
import ImageResizer from 'react-native-image-resizer'

import axios from 'axios'
import API_URL from '../../components/apiurl'
import { AuthContext } from '../../components/context'
import { LinearGradient } from 'expo-linear-gradient'

export default function OptionScreen(props) {
    axios.defaults.baseURL = API_URL
    axios.defaults.headers.common['Authorization'] = props.userToken

    userProfile = props.userProfile
    const { signOut } = React.useContext(AuthContext)

    //the string parameter is to avoid image cache on android, which loads the same image everytime
    const [image, setImage] = React.useState({ uri: `${API_URL}/users/${userProfile._id}/avatar?string=${Math.random().toString(36).substring(7)}` })


    //prompt image load from library
    const pickImage = async () => {
        try {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.All,
                allowsEditing: true,
                aspect: [4, 4],
                quality: 1,
            })
            if (!result.cancelled) {
                setImage({ uri: result.uri })
                console.log(result.uri)
                ImageResizer.createResizedImage(result.uri, 80, 80, 'PNG', 5, 0, null, true).then(async ({ uri }) => {
                    const data = new FormData()
                    data.append('avatar',
                        {
                            uri: uri,
                            name: `uploadImage.jpg`,
                            type: 'image/png'
                        }
                    )
                    await axios.post('users/self/avatar', data)
                }).catch(err => {
                    console.log(err)
                })

            }
        } catch (err) {
            console.log(err)
        }
    }

    return (
        <>
            <LinearGradient colors={['#ef6698', '#492cac']} style={styles.container}>
                <View style={styles.container}>
                    <View style={styles.profile}>
                        <Image
                            onLoad={() => null}
                            fadeDuration={0}
                            style={styles.image}
                            source={image}
                        >
                        </Image>
                        <Text style={styles.userName}>{userProfile.name.toUpperCase()}</Text>
                        <Text style={styles.userEmail}>{userProfile.email}</Text>
                    </View>
                    <TouchableOpacity style={styles.options}>
                        <Text style={styles.optionsText}>Edit Profile</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.options} onPress={pickImage}>
                        <Text style={styles.optionsText}>Change Profile Picture</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.options}>
                        <Text style={styles.optionsText}>Change Payment Method</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.options}>
                        <Text style={styles.optionsText}>Change Password</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={{ ...styles.options }} onPress={signOut}>
                        <LinearGradient colors={['#00BFA5', '#43A047']} style={
                            {
                                height: '100%',
                                width: '100%',
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderRadius: 25
                            }
                        }>
                            <Text style={{ ...styles.optionsText, color: 'white' }}>Log Out</Text>
                        </LinearGradient>
                    </TouchableOpacity>

                </View>
            </LinearGradient>
        </>
    )
}


const styles = StyleSheet.create({
    image: {
        height: 150,
        width: 150,
        borderWidth: 1.5,
        borderColor: 'white',
        backgroundColor: 'gray',
        borderRadius: 100,
        alignSelf: 'center'
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    profile: {
        marginBottom: 60
    },
    userName: {
        alignSelf: 'center',
        fontWeight: 'bold',
        fontSize: 25,
        marginTop: 6,
        color: 'white'
    },
    userEmail: {
        color: 'white',
        alignSelf: 'center'
    },
    options: {
        backgroundColor: 'white',
        width: 340,
        alignItems: 'center',
        justifyContent: 'center',
        height: 40,
        marginVertical: 5,
        borderRadius: 20
    },
    optionsText: {
        fontSize: 17,
    },
    logoutButton: {
        height: 45,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'black',
    }
})