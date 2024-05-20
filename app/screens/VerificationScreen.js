import { View, Text, ImageBackground, StyleSheet, Image, TouchableOpacity, Alert } from 'react-native'
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context'
import * as ImagePicker from 'expo-image-picker'
import { MaterialIcons } from '@expo/vector-icons';
import React, { useState } from 'react'

//import firebase
import { auth } from '../database/config'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { storage } from '../database/config'
import { ref, uploadBytes } from 'firebase/storage'
import { db } from '../database/config'
import { doc, setDoc, addDoc, collection } from 'firebase/firestore'

//import context
import { useControl} from '../contexts/ControlProvider'
import { useTheme } from '../contexts/ThemeProvider'

//import async storage
import AsyncStorage from '@react-native-async-storage/async-storage' 
import { isLoaded } from 'expo-font';

export default function VerificationScreen({ navigation }) {
    //inserting theme to stylesheet
    const {colors, fonts} = useTheme()
    const styles = styleCreate(colors, fonts)

    //importing userAsyncData
    const {userAsyncData, setUserAsyncData} = useControl()

    //variables
    const [profileImage, setProfileImage] = useState(null)
    const [idImage, setIdImage] = useState(null)

    const profileImagePicker = async() => {
      let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [1, 1],
          quality: 1
      })

      if (!result.canceled) {
          console.log("profile was uploaded")
          setProfileImage(result.assets[0].uri)
      }
    }

    const idImagePicker = async() => {
      let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [3, 2],
          quality: 1
      })

      if (!result.canceled) {
          console.log("id was uploaded")
          setIdImage(result.assets[0].uri)
      }
    }

    const uploadProfileImage = async (urlName) => {
      const imageName = `${urlName}-profile.jpg`;
      const response = await fetch(profileImage);
      const blob = await response.blob();
      const storageRef = ref(storage, `pictures/${imageName}`);

      try {
          const snapshot = await uploadBytes(storageRef, blob);
          console.log("profile: ",snapshot.metadata.name);
      } catch (error) {
          console.log(error);
      }
    }

    const uploadIDImage = async (urlName) => {
      const imageName = `${urlName}-id.jpg`;
      const response = await fetch(idImage);
      const blob = await response.blob();
      const storageRef = ref(storage, `pictures/${imageName}`);

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
            const docRef = await setDoc(doc(collection(db, "users"), urlName), {
                firstName: userAsyncData.userInformation.firstName,
                lastName: userAsyncData.userInformation.lastName,
                username: userAsyncData.userInformation.username,
                contactNumber: userAsyncData.userInformation.contactNumber,
                email: userAsyncData.userInformation.email,
                password: userAsyncData.userInformation.password,
                isRider: userAsyncData.userInformation.isRider,
                isVerified: false,
                uid: urlName,
                profileImage: urlName + "-profile.jpg",
                idImage: urlName + "-id.jpg",
            });
            console.log("Document written with ID: ", urlName);
        } catch (e) {
            console.error("Error adding document: ", e);
        }
    }

    const createFirebaseUser = async() => {
      try {
        const userAuth = await createUserWithEmailAndPassword(auth, userAsyncData.userInformation.email, userAsyncData.userInformation.password);
        if (!userAuth?.user?.uid) {
            throw new Error('Failed to get user UID.');
        }
          console.log("User Authenticated, UID:", userAuth.user.uid);
          await uploadProfileImage(userAuth.user.uid);
          await uploadIDImage(userAuth.user.uid);
          await createUser(userAuth.user.uid);
          console.log("User created successfully.");
          setUserAsyncData  ({
            ...userAsyncData, isLoggedIn: true, activateVerification: false,
          })
          await AsyncStorage.setItem('userData', JSON.stringify({
            ...JSON.parse(await AsyncStorage.getItem('userData')), isLoggedIn: true, activateVerification: false,
            userInformation : { 
              firstName: userAsyncData.userInformation.firstName,
              lastName: userAsyncData.userInformation.lastName,
              username: userAsyncData.userInformation.username,
              contactNumber: userAsyncData.userInformation.contactNumber,
              email: userAsyncData.userInformation.email,
              password: userAsyncData.userInformation.password,
              isRider: userAsyncData.userInformation.isRider,
              isVerified: false,
              uid: userAuth.user.uid,
              profileImage: userAuth.user.uid + "-profile.jpg",
              idImage: userAuth.user.uid + "-id.jpg",
            } }));
      } catch (err) {
          console.error("Error creating user:", err);
      }
    }

    const submit = async() => {
      if (profileImage && idImage) {
        if(!userAsyncData.userInformation.isRider){
          createFirebaseUser();
        }
        else{
          navigation.navigate('MotorcycleRegistration', { profileImage: profileImage, idImage: idImage, userAsyncData: userAsyncData });
        }
      }
      else {
          Alert.alert("Empty parameters",'Please upload both ID and Profile Picture')
      }
    }

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
          <ImageBackground style={styles.bgContainer}source={require('../assets/images/BG-GW.png')}>
              <Text>{userAsyncData.credentials}</Text>
              <View style={styles.container}>
                  <View style={styles.headerContainer}>
                      <Text style={styles.headerText1}>Upload a Profile Picture</Text>
                      <Text style={styles.headerText2}>Please make sure that it clearly shows your face.</Text>
                  </View>
                  <View style={styles.inputCotainer}>
                      <TouchableOpacity style={styles.profileImageButton} onPress={profileImagePicker}>
                          {profileImage ? <Image style={styles.image} source={{ uri: profileImage }} /> : <MaterialIcons name="account-circle" size={190} color={colors.secondary} />}
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.idImageButton} onPress={idImagePicker}>
                          <Text style={styles.buttonText}>{idImage ? `${userAsyncData.userInformation.firstName.toUpperCase()} ${userAsyncData.userInformation.lastName.toUpperCase()} ID...` : 'Upload ID'}</Text>
                          <MaterialIcons name="upload-file" size={22.5} color="#6637CE"/>
                      </TouchableOpacity>
                  </View>
                  <View style={styles.buttonContainer}>
                      <TouchableOpacity style={styles.button} onPress={submit}>
                          <Text style={styles.submitButton}>CONTINUE</Text>
                      </TouchableOpacity>
                  </View>
              </View>
          </ImageBackground>
      </SafeAreaView>
  </SafeAreaProvider>
  )
}

const styleCreate = (colors, fonts) => StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  bgContainer: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerContainer: {
    flex: 0.5,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  headerText1: {
    fontSize: 30,
    fontFamily: fonts.RubikSemiBold,
    fontWeight: '700',
    color: colors.primary,
    letterSpacing: -0.5,
  },
  headerText2: {
    fontSize: 16,
    fontFamily: fonts.Rubik,
    fontWeight: '400',
    color: colors.primary,
    letterSpacing: -0.5,
  },
  inputCotainer: {
    textAlign: 'center',
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileImageButton: {
    borderRadius: 150,
    borderWidth: 2,
    borderColor: colors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: '10%',
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 150,
  },
  idImageButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 150,
    borderWidth: 2,
    borderColor: colors.secondary,
    height: 50,
    width: "90%"
  },
  buttonText: {
    fontSize: 15,
    fontFamily: fonts.Rubik,
    fontWeight: '700',
    color: colors.secondary,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginBottom: 20,
  },
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.secondary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 100,
    height: 60,
    minWidth: "80%"
  },
  submitButton: {
    fontSize: 15,
    fontFamily: 'Rubik-Regular',
    fontWeight: '700',
    color: '#FFFFFF',
  }

})