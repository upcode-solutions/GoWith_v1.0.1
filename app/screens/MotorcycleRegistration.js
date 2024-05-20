//import router
import { useRoute } from '@react-navigation/native'

//import imagepicker
import * as ImagePicker from 'expo-image-picker'

//import context 
import { useControl } from '../contexts/ControlProvider'
import { useTheme } from '../contexts/ThemeProvider'

//import SafeAreaView
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context'

//import react react-native
import { ImageBackground, StyleSheet, Text, TouchableOpacity, View, Image, TextInput, ScrollView } from 'react-native'
import React, { useState } from 'react'

import { createUserWithEmailAndPassword } from 'firebase/auth'
import { setDoc, doc } from 'firebase/firestore'
import { ref, uploadBytes } from 'firebase/storage'
import { db, auth, storage } from '../database/config'
import AsyncStorage from '@react-native-async-storage/async-storage'

export default function MotorcycleRegistration() {

    const { setUserAsyncData } = useControl()

    const {colors, fonts} = useTheme()
    const styles = createStyles(colors, fonts)

    const route = useRoute()
    const { profileImage, idImage, userAsyncData } = route.params

    //variables
    const [OR, setOR] = useState(null)
    const [CR, setCR] = useState(null)
    const [DriversLicenseFront, setDriversLicenseFront] = useState(null)
    const [DriversLicenseBack, setDriversLicenseBack] = useState(null)
    const [liscenceNumber, setLiscenceNumber] = useState(null)

    const OfficeReceipt = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1
        })

        if (!result.canceled) {
            console.log("Office Receipt was uploaded")
            setOR(result.assets[0].uri)
        }
    }
    const CertificateOfRegistration = async() => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [3, 4],
            quality: 1
        })

        if (!result.canceled) {
            console.log("Certificate of Registration was uploaded")
            setCR(result.assets[0].uri)
        }
    }
    const DrvrsLicenseFront = async() => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1
        })

        if (!result.canceled) {
            console.log("Driver's License Front was uploaded")
            setDriversLicenseFront(result.assets[0].uri)
        }
    }
    const DrvrsLicenseBack = async() => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1
        })

        if (!result.canceled) {
            console.log("Driver's License Back was uploaded")
            setDriversLicenseBack(result.assets[0].uri)
        }
    }

    const ImageUploader = async (urlName, image, idName) => {
        const imageName = `${urlName}-${idName}.jpg`;
        const response = await fetch(image);
        const blob = await response.blob();
        const storageRef = ref(storage, `ridersCredentials/${imageName}`);

        try {
            const snapshot = await uploadBytes(storageRef, blob);
            console.log("id: ",snapshot.metadata.name);
        }
        catch (error) {
            console.log(error);
        }
    }

    const createUser = async (urlName) => {
        try {
            const docRef = await setDoc(doc(db, "users", urlName), {
                userInformation: userAsyncData.userInformation,
                ridersCredentials: {
                    liscenceNumber: liscenceNumber,
                    OR: OR,
                    CR: CR,
                    DriversLicenseFront: DriversLicenseFront,
                    DriversLicenseBack: DriversLicenseBack
                }
            });
            console.log("Document written with ID: ", urlName);
        }
        catch (error) {
            console.log(error);
        }
    }

    const register = async() => {
        if (OR === null || CR === null || DriversLicenseFront === null || DriversLicenseBack === null || liscenceNumber === null) {
            alert("Please upload all required documents")
        } else {
            console.log(userAsyncData.userInformation);
            try {
                const userAuth = await createUserWithEmailAndPassword(auth, userAsyncData.userInformation.email, userAsyncData.userInformation.password);
                if (!userAuth?.user?.uid) {
                    throw new Error("userAuth failed")
                }
                console.log(userAuth.user.uid);
                await ImageUploader(userAuth.user.uid, DriversLicenseFront, "DriversLicenseFront");
                await ImageUploader(userAuth.user.uid, DriversLicenseBack, "DriversLicenseBack");
                await ImageUploader(userAuth.user.uid, OR, "OR");
                await ImageUploader(userAuth.user.uid, CR, "CR");
                await createUser(userAuth.user.uid)
                await AsyncStorage.setItem("userData", JSON.stringify({...JSON.parse(await AsyncStorage.getItem('userData')), isloggedIn: true, activateVerification: false ,ridersCredentials: {liscenceNumber: liscenceNumber, OR: OR, CR: CR, DriversLicenseFront: DriversLicenseFront, DriversLicenseBack: DriversLicenseBack}}));
                await setUserAsyncData({...userAsyncData, isLoggedIn: true, activateVerification: false ,ridersCredentials: {liscenceNumber: liscenceNumber, OR: OR, CR: CR, DriversLicenseFront: DriversLicenseFront, DriversLicenseBack: DriversLicenseBack}})
                console.log("User was created successfully");
            }
            catch (error) {
                console.log(error)
            }
        }
    }
  return (
    <SafeAreaProvider>
        <SafeAreaView style={styles.container}>
            <ImageBackground style={styles.bgImage} source={require('../assets/images/BG-GW.png')}>
                <ScrollView contentContainerStyle={{flexGrow: 1, justifyContent: 'center'}}>
                    <View style={styles.formContainer}>
                        <View style={styles.headerContainer}>
                            <Text style={styles.headerText1}>Upload your OC/CR and</Text>
                            <Text style={styles.headerText1}>Drivers license</Text>
                            <Text style={styles.headerText2}>Please make sure that it clearly shows the text.</Text>
                        </View>
                        <View style={styles.formContainer}>
                            <TextInput style={styles.inputContainer} placeholder='Liscence Plate Number' onChangeText={setLiscenceNumber} characterRestriction={7} />
                            <View style={styles.driversLiscenseContainer}>
                                <TouchableOpacity style={styles.photoContainer1} onPress={DrvrsLicenseFront}>
                                    {DriversLicenseFront ? <Image source={{uri: DriversLicenseFront}} style={{resizeMode: 'cover', height: 80, width: '115%', borderRadius: 10}}/> : <Text style={styles.photoContainerText}>Driver's License FRONT</Text>}
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.photoContainer1} onPress={DrvrsLicenseBack}>
                                    {DriversLicenseBack ? <Image source={{uri: DriversLicenseBack}} style={{resizeMode: 'cover', height: 80, width: '115%', borderRadius: 10}}/> : <Text style={styles.photoContainerText}>Driver's License BACK</Text>}
                                </TouchableOpacity>
                            </View>
                            <TouchableOpacity style={styles.photoContainer2} onPress={OfficeReceipt}>
                                { OR ? <Image source={{uri: OR}} style={{resizeMode: 'cover', height: 80, width: '107%', borderRadius: 10}}/> : <Text style={styles.photoContainerText}>Office Receipt - OR</Text>}
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.photoContainer2} onPress={CertificateOfRegistration}>
                                { CR ? <Image source={{uri: CR}} style={{resizeMode: 'cover', height: 80, width: '107%', borderRadius: 10, borderColor: colors.primary, borderWidth: 1}}/> : <Text style={styles.photoContainerText}>Certificate of Registration</Text>}
                            </TouchableOpacity>
                        </View>
                        <View style={styles.buttonContainer}>
                            <TouchableOpacity style={styles.button} onPress={() => register()}>
                                <Text style={styles.buttonText}>Submit</Text>
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
        backgroundColor: colors.background,
    },
    bgImage: {
        flex: 1,
        height: '100%',
        width: '100%',
        objectFit: 'cover',
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerContainer: {
        flex: 0.5,
        marginTop: '10%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerText1: {
        fontSize: 20,
        fontFamily: fonts.RubikSemiBold,
        color: colors.secondary,
        marginBottom: -10,
    },
    headerText2: {
        fontSize: 15,
        fontWeight: 'bold',
        color: colors.text,
        marginTop: 15,
    },
    formContainer: {
        flex: 4,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: 'fit-content',
    },
    inputContainer: {
        borderColor: colors.primary,
        borderWidth: 1,
        borderRadius: 10,
        paddingHorizontal: 20,
        width: '93%',
        height: 50,
        marginBottom: 10,
    },
    driversLiscenseContainer: {
        flexDirection: 'row',
        gap: 10,
        minWidth: '90%',
        justifyContent: 'center',
        alignContent: 'center',
    },
    photoContainer1: {
        borderColor: colors.primary,
        borderWidth: 1,
        borderRadius: 10,
        padding: 10,
        width: '45%',
        justifyContent: 'center',
        alignItems: 'center',
        height: 80,
    },
    photoContainer2: {
        borderColor: colors.primary,
        borderWidth: 1,
        borderRadius: 10,
        padding: 10,
        height: 80,
        width: '93%',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
    },
    photoContainerText: {
        fontSize: 15,
        fontFamily: fonts.RR,
        color: colors.primary,
    },
    buttonContainer: {
        flex: 0.5,
        marginBottom: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    button: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.secondary,
        borderColor: colors.primary,
        borderWidth: 1,
        height: 30,
        minWidth: '90%',
        borderRadius: 50,
    },
    buttonText: {
        fontSize: 15,
        fontFamily: fonts.RR,
        color: colors.background,
    },
})