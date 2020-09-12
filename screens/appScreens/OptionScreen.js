import React, { useEffect } from 'react'
import { Text, View, Button, Image, StyleSheet, TouchableOpacity } from 'react-native'
import * as ImagePicker from 'expo-image-picker'
import { AuthContext } from '../../components/context'
import { LinearGradient } from 'expo-linear-gradient'

export default function OptionScreen(props) {
    userProfile = props.userProfile
    const { signOut } = React.useContext(AuthContext)
    const [image, setImage] = React.useState({ uri: `https://park-zapp.herokuapp.com/users/${userProfile._id}/avatar` })

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
                //console.log(result.uri)
                setImage({ uri: result.uri })
            }
        } catch (err) {
            console.log(err)
        }
    }

    return (
        <>
            <LinearGradient colors={['#f20089', '#2d00f7']} style={styles.container}>
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
                        <Text style={styles.optionsText}>Change Avatar</Text>
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
        borderRadius: 100
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