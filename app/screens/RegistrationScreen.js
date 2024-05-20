import { StyleSheet, Text, View, ImageBackground, TextInput, TouchableOpacity, ScrollView, Switch, Alert } from 'react-native'
import { useRoute } from '@react-navigation/native'
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context'

//import contexts
import { useTheme } from '../contexts/ThemeProvider'
import { useControl } from '../contexts/ControlProvider'
//import firebase
import { deleteDoc, doc } from 'firebase/firestore'
import { db } from '../database/config'

import React, { useState } from 'react'

export default function RegistrationScreen({navigation}) {
    //themse insert to stylesheet
    const {colors, fonts} = useTheme()
    const styles = createStyles(colors, fonts)

    //control data information
    const { userAsyncData, setUserAsyncData } = useControl()

    //passe informations route and null handler
    const route = useRoute();
    const { email, password} = route.params || {};
    if (!email || !password) {
        navigation.navigate('LoginRegisterScreen')
    }

    const [firstName, setFirstName] = useState('Rez Angelo');
    const [lastName, setLastName] = useState('Dominguez');
    const [username, setUsername] = useState('Noxsie123');
    const [contactNumber, setContactNumber] = useState('0956251790');

    const [isRider, setIsRider] = useState(false);
    const toggleSwitch = () => setIsRider(previousState => !previousState);

    //delete temporaryAccount
    const cancel = async() => {
        try {
            await deleteDoc(doc(db, 'temporaryAccounts', email))
            console.log('User deleted');
            await navigation.navigate('LoginRegisterScreen')
        } catch (error) {
            console.log(error)
        }
    }
    //registrationHandler
    const register = async() => {
        if (!firstName || !lastName || !username || !contactNumber) {
            alert('Please fill in all fields')
            return
        }
        else {
            try {
                console.log("before: ", userAsyncData);
                await setUserAsyncData({
                    ...userAsyncData,
                    activateVerification: true,
                    userInformation: {
                        email: email,
                        password: password,
                        firstName: firstName,
                        lastName: lastName,
                        username: username,
                        contactNumber: contactNumber,
                        isRider: isRider
                    }
                })
            } catch (error) {
                console.log(error)
            }
        }
    }

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <ImageBackground style={styles.bgContainer} source={require('../assets/images/BG-GW.png')}>
            <ScrollView contentContainerStyle={{flexGrow: 1, justifyContent: 'center'}}>
                <View style={styles.welcomeTagContainer}>
                    <Text style={styles.text}>WELCOME TO</Text>
                    <View style={styles.brandTextContainer}>
                    <Text style={styles.lettering1}>THE </Text>
                    <Text style={styles.brand}>GO</Text>
                    <Text style={styles.brand2}>WITH</Text>
                    <Text style={styles.lettering1}> FAMILY</Text>
                    </View>
                </View>
                <View style={styles.inputContainer}>
                    <View style={styles.nameContainer}>
                        <TextInput style={styles.nameInputContainer} onChangeText={(text) => setFirstName(text)} placeholder='First Name'/>
                        <TextInput style={styles.nameInputContainer} onChangeText={(text) => setLastName(text)} placeholder='Last Name'></TextInput>
                    </View>
                    <TextInput style={styles.textInputContainer} onChangeText={(text) => setUsername(text)} placeholder='Username' />
                    <TextInput style={styles.textInputContainer} onChangeText={(text) => setContactNumber(text)} placeholder='Contact No.' keyboardType='number-pad' maxLength={11} />
                    <View style={styles.SwitchContainer}> 
                        <Text style={styles.lettering2}>Apply as a rider</Text>
                        <Switch trackColor={{ false: 'grey', true: '#c595fa' }} thumbColor={isRider ? '#341484' : 'lightgrey'} onValueChange={toggleSwitch} value={isRider} />
                    </View>
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity style={styles.button1} onPress={() => cancel()}>
                        <Text style={styles.buttonText}>CANCEL</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.button} onPress={() => register()}>
                        <Text style={styles.buttonText}>CONTINUE</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </ImageBackground>
      </SafeAreaView>
    </SafeAreaProvider>
  )
}

const createStyles = (colors, fonts) => StyleSheet.create({
    container: {
        flex: 1,
    },
    bgContainer: {
        flex: 1,
        height: '100%',
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    welcomeTagContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20
    },
    text: {
        fontFamily: fonts.RR,
        fontSize: 35,
        color: colors.secondary
    },
    brandTextContainer: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    brand: {
        fontFamily: fonts.RR,
        fontSize: 25,
        color: colors.secondary,
    },
    brand2: {
        fontFamily: fonts.RR,
        fontSize: 25,
        color: colors.primary,
    },
    lettering1: {
        fontFamily: fonts.RR,
        fontSize: 25,
        color: colors.tertiary
    },
    inputContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    nameContainer: {
        width: '90%',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    SwitchContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    nameInputContainer: {
        backgroundColor: colors.background,
        width: '49%',
        height: 50,
        borderRadius: 15,
        borderWidth: 1,
        borderColor: colors.secondary,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
        marginBottom: 10
    },
    textInputContainer: {
        backgroundColor: colors.background,
        width: '90%',
        height: 50,
        borderRadius: 15,
        borderWidth: 1,
        borderColor: colors.secondary,
        paddingHorizontal: 20,
        marginBottom: 10
      },
    buttonContainer: {
        width: '90%',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    button: {
        backgroundColor: '#341484',
        width: '49%',
        height: 50,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 15
    },
    button1: {
        backgroundColor: '#c595fa',
        width: '49%',
        height: 50,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 15
    },
    buttonText: {
        color: 'white',
        fontFamily: 'Rubik-SemiBold',
        fontSize: 18
    }
})

