import React, { useEffect } from 'react'
import { Text, View, Button, Image, StyleSheet, TouchableOpacity, Modal, TextInput } from 'react-native'
import * as ImagePicker from 'expo-image-picker'
import ImageResizer from 'react-native-image-resizer'

import axios from 'axios'
import API_URL from '../../components/apiurl'
import { AuthContext } from '../../components/context'
import { LinearGradient } from 'expo-linear-gradient'

export default function OptionScreen(props) {
    axios.defaults.baseURL = API_URL
    axios.defaults.headers.common['Authorization'] = props.userToken

    const [userProfile, setUserProfile] = React.useState(props.userProfile)
    const { signOut } = React.useContext(AuthContext)

    const [defaultScreen, setDefaultScreen] = React.useState(true)
    const [editProfileScreen, setEditProfileScreen] = React.useState(false)
    const [changePasswordScreen, setchangePasswordScreen] = React.useState(false)
    const [paymentMethodScreen, setPaymentMethodScreen] = React.useState(false)

    const [passwordsMatch, setPasswordsMatch] = React.useState(true)
    const [correctPassword, setCorrectPassword] = React.useState(true)

    const [editProfileFormValues, setEditProfileFormValues] = React.useState({})
    const [changePasswordFormValues, setChangePasswordFormValues] = React.useState({})
    const [paymentMethodFormValues, setPaymentMethodFormValues] = React.useState({})

    //update state on form Input change
    const editProfileFormInputChange = (field, value) => {
        setEditProfileFormValues({
            ...editProfileFormValues,
            [field]: value
        })
    }

    //update state on form Input change
    const changepasswordFormInputChange = (field, value) => {
        setChangePasswordFormValues({
            ...changePasswordFormValues,
            [field]: value
        })
    }

    //update state on form Input change
    const paymentMethodFormInputChange = (field, value) => {
        setPaymentMethodFormValues({
            ...paymentMethodFormValues,
            [field]: value
        })
    }

    const checkPasswords = async () => {
        setPasswordsMatch(false)
        if (changePasswordFormValues.newPassword != undefined && changePasswordFormValues.newPassword === changePasswordFormValues.confirmPassword) {
            setPasswordsMatch(true)
            try {
                const user = await axios.post('/users/changepassword', {
                    currentPassword: changePasswordFormValues.currentPassword,
                    newPassword: changePasswordFormValues.newPassword
                })

                if (user) {
                    setchangePasswordScreen(false)
                    setDefaultScreen(true)
                    setCorrectPassword(true)
                }
            } catch (err) {
                setCorrectPassword(false)
                console.log(err)
            }
        }


    }

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
        defaultScreen ?
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
                        <TouchableOpacity style={styles.options} onPress={() => {
                            setDefaultScreen(false)
                            setEditProfileScreen(true)
                        }}>
                            <Text style={styles.optionsText}>Edit Profile</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.options} onPress={pickImage}>
                            <Text style={styles.optionsText}>Change Profile Picture</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.options} onPress={() => {
                            setDefaultScreen(false)
                            setPaymentMethodScreen(true)
                        }}>
                            <Text style={styles.optionsText}>Change Payment Method</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.options} onPress={() => {
                            setDefaultScreen(false)
                            setchangePasswordScreen(true)
                        }}>
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
            : editProfileScreen ?
                <Modal
                    transparent={true}
                    animationType="slide"
                >
                    <View
                        style={styles.editModal}
                    >
                        <TouchableOpacity style={styles.crossButton} onPress={() => {
                            setEditProfileScreen(false)
                            setDefaultScreen(true)
                            setEditProfileFormValues({})
                        }}>
                            <View>
                                <Text style={{ fontSize: 15, color: 'white' }}>✖</Text>
                            </View>
                        </TouchableOpacity>

                        <Text style={{
                            fontWeight: 'bold',
                            fontSize: 24,
                            alignSelf: 'center',
                            color: 'white'
                        }}>EDIT PROFILE</Text>
                        <Text style={{ color: 'white' }}>Name</Text>
                        <TextInput style={styles.textInput} placeholder={'John Doe'} onChangeText={value => { editProfileFormInputChange('name', value) }}></TextInput>
                        <Text style={{ color: 'white' }}>Phone</Text>
                        <TextInput style={styles.textInput} placeholder={'0123456789'} onChangeText={value => { editProfileFormInputChange('phone', value) }}></TextInput>
                        <TouchableOpacity
                            style={{ alignItems: 'center', marginTop: 17 }}
                            onPress={async () => {
                                const user = await axios.patch('/users/self', editProfileFormValues)
                                Promise.all(user).then(() => {
                                    setUserProfile(user.data)
                                })
                                setEditProfileScreen(false)
                                setDefaultScreen(true)
                            }}
                        >
                            <Text style={{ fontSize: 20, borderRadius: 25, backgroundColor: '#00BFA5', width: '50%', textAlign: 'center', padding: 5 }}>
                                SAVE
                        </Text>
                        </TouchableOpacity>
                    </View>
                </Modal>
                : paymentMethodScreen ?
                    <Modal
                        transparent={true}
                        animationType="slide"
                    >
                        <View
                            style={styles.editModal}
                        >
                            <TouchableOpacity style={styles.crossButton} onPress={() => {
                                setPaymentMethodScreen(false)
                                setDefaultScreen(true)
                                setPaymentMethodFormValues({})
                            }}>
                                <View>
                                    <Text style={{ fontSize: 15, color: 'white' }}>✖</Text>
                                </View>
                            </TouchableOpacity>

                            <Text style={{
                                fontWeight: 'bold',
                                fontSize: 24,
                                alignSelf: 'center',
                                color: 'white'
                            }}>PAYMENT METHOD</Text>
                            <Text style={{ color: 'white' }}>Card Number</Text>
                            <TextInput style={styles.textInput} placeholder={'1111 2222 3333 4444'} onChangeText={value => { paymentMethodFormInputChange('number', value) }}></TextInput>
                            <Text style={{ color: 'white' }}>Expiry Date (MM/YY)</Text>
                            <TextInput style={styles.textInput} placeholder={'11/22'} onChangeText={value => { paymentMethodFormInputChange('date', value) }}></TextInput>
                            <Text style={{ color: 'white' }}>CVV</Text>
                            <TextInput style={styles.textInput} placeholder={'123'} onChangeText={value => { paymentMethodFormInputChange('cvv', value) }}></TextInput>
                            <TouchableOpacity
                                style={{ alignItems: 'center', marginTop: 17 }}
                                onPress={() => {
                                    setDefaultScreen(true)
                                    setPaymentMethodScreen(false)
                                }}
                            >
                                <Text style={{ fontSize: 20, borderRadius: 25, backgroundColor: '#00BFA5', width: '50%', textAlign: 'center', padding: 5 }}>
                                    SAVE
                        </Text>
                            </TouchableOpacity>
                        </View>
                    </Modal>
                    : changePasswordScreen ?
                        <Modal
                            transparent={true}
                            animationType="slide"
                        >
                            <View
                                style={styles.editModal}
                            >
                                <TouchableOpacity style={styles.crossButton} onPress={() => {
                                    setchangePasswordScreen(false)
                                    setDefaultScreen(true)
                                    setChangePasswordFormValues({})
                                }}>
                                    <View>
                                        <Text style={{ fontSize: 15, color: 'white' }}>✖</Text>
                                    </View>
                                </TouchableOpacity>

                                <Text style={{
                                    fontWeight: 'bold',
                                    fontSize: 24,
                                    alignSelf: 'center',
                                    color: 'white'
                                }}>CHANGE PASSWORD</Text>
                                <Text style={{ color: 'white' }}>Current Password</Text>
                                <TextInput secureTextEntry={true} autoCapitalize={'none'} style={styles.textInput} onChangeText={value => { changepasswordFormInputChange('currentPassword', value) }}></TextInput>
                                <Text style={{ color: 'white' }}>New Password</Text>
                                <TextInput secureTextEntry={true} autoCapitalize={'none'} style={styles.textInput} onChangeText={value => { changepasswordFormInputChange('newPassword', value) }}></TextInput>
                                <Text style={{ color: 'white' }}>Confirm Password</Text>
                                <TextInput secureTextEntry={true} autoCapitalize={'none'} style={styles.textInput} onChangeText={value => { changepasswordFormInputChange('confirmPassword', value) }}></TextInput>
                                {
                                    !passwordsMatch ?
                                        <Text style={{ color: 'red' }}>Passwords don't match</Text>
                                        : null
                                }
                                {
                                    !correctPassword ?
                                        <Text style={{ color: 'red' }}>Incorrect Password</Text>
                                        : null
                                }
                                <TouchableOpacity
                                    style={{ alignItems: 'center', marginTop: 17 }}
                                    onPress={() => {
                                        checkPasswords()
                                    }}
                                >
                                    <Text style={{ fontSize: 20, borderRadius: 25, backgroundColor: '#00BFA5', width: '50%', textAlign: 'center', padding: 5 }}>
                                        SAVE
                        </Text>
                                </TouchableOpacity>
                            </View>
                        </Modal>
                        : null

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
    },
    editModal: {
        backgroundColor: '#0c44ac',
        paddingHorizontal: 20,
        paddingVertical: 8,
        margin: 18,
        borderRadius: 35
    },
    crossButton: {
        backgroundColor: '#f20089',
        height: 30,
        width: 30,
        marginBottom: 10,
        paddingBottom: 3,
        alignSelf: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 50
    },
    text: {
        fontSize: 15,
        fontWeight: 'bold',
        color: 'beige',
        paddingLeft: 8
    },
    textInput: {
        borderRadius: 5,
        backgroundColor: 'white',
        height: 30,
        marginVertical: 5,
        paddingHorizontal: 5
    },
})