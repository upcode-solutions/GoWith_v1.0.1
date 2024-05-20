import { StyleSheet, View, Text, ImageBackground, TextInput, TouchableOpacity } from 'react-native'
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context'
import React, { useState } from 'react'
//import themeProvider
import { useTheme } from '../contexts/ThemeProvider'
//import firebase database
import { signInWithEmailAndPassword } from 'firebase/auth'
import { getDocs, collection, where, query, setDoc, doc, getDoc } from 'firebase/firestore'
import { db, auth } from "../database/config"
//import context
import { useControl } from '../contexts/ControlProvider'
import AsyncStorage from '@react-native-async-storage/async-storage'
export default function LoginRegisterScreen({navigation}) {
    
    const { fonts, colors } = useTheme()
    const styles = createStyles(fonts, colors)

    const { userAsyncData, setUserAsyncData } = useControl()

    const [email, setEmail] = useState("ReztX@example.com");
    const [password, setPassword] = useState("1234567890");
    const [identifier, setIdentifier] = useState("Login");
    const [errorMessage, setErrorMessage] = useState("");

    const userAction = () => {
        if (identifier == "Login") {
            loginHandler();
        } else {
            registerHandler();
        }
    }

    const identifierHandler = () => {
      setIdentifier(identifier == "Login" ? "Signup" : "Login");
      console.log(identifier == "Login" ? "Changed to Register" : "Changed to Login");
    }

    const loginHandler = async() => {
      try {
        const user = await signInWithEmailAndPassword(auth, email, password);
        console.log(user._tokenResponse.localId);
        if (user._tokenResponse.email) {
          const docRef = doc(db, "users", user._tokenResponse.localId);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            await setUserAsyncData({...userAsyncData, isLoggedIn: true, userInformation:{ ...docSnap.data() }});
            await AsyncStorage.setItem("userData", JSON.stringify({...userAsyncData, isLoggedIn: true, userInformation:{ ...docSnap.data() }}));
          } else {
            console.log("No such document!");
          }
          
        }
      } catch (error) {
        console.log(error);
      }
    }
  
    const registerHandler = async () => {
        if( !email || !password) {
          setErrorMessage("All fields are required");
        }else{
          try {
            const loweredEmail = email.toLowerCase();
            const firebaseQuery = query(collection(db, "users"), where("email", "==", loweredEmail)); 
            const querySnapshot = await getDocs(firebaseQuery);
            if (querySnapshot.size > 0) {
              setErrorMessage("Email already exists");
            }
            else {
              const docRef = await setDoc(doc(collection(db, "temporaryAccounts"), loweredEmail), {
                credentials: { email: loweredEmail, password: password }
              });      
              console.log("Document written with ID: ", docRef);
              await navigation.navigate("RegistrationScreen", {email: loweredEmail, password: password});
              console.log("Email: " + loweredEmail + " Password: " + password);
            }
          } catch (error) {
            console.error("Error searching for email: ", error);
          }
        }
    }

    console.log("Email: " + email + " Password: " + password);

  return (
    <SafeAreaProvider>
      <SafeAreaView>
        <ImageBackground style={styles.bgContainer} source={require("../assets/images/BG-GW.png")}>
          <View style={styles.formContainer}>
            <View style={styles.brandTextContainer}>
              <Text style={styles.brand}>GO</Text>
              <Text style={styles.brand2}>WITH</Text>
            </View>
            <View style = {styles.inputContainer}> 
              <TextInput style={styles.textInputContainer} onChangeText={(Text) => setEmail(Text)} placeholder="Email"/>
              <TextInput style={styles.textInputContainer} onChangeText={(Text) => setPassword(Text)} placeholder="Password" secureTextEntry={true}/>
            </View>
            <View style = {styles.buttonContainer}>
              <Text style = {styles.errorMessage}>{errorMessage}</Text>
              <TouchableOpacity style = {styles.actionButton} onPress={() => userAction()}>
                <Text style={styles.textButton}>{identifier == "Login" ? "Login" : "Register"}</Text>
              </TouchableOpacity>
              <TouchableOpacity style = {styles.changeActionButton} onPress={() => identifierHandler()}>
                <Text style={styles.changeActionText}>{identifier == "Login" ? "Dont have an account? Signup" : "Already have an account? Login"}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ImageBackground>
      </SafeAreaView>
    </SafeAreaProvider>
  )
}

const createStyles = (fonts, colors) => StyleSheet.create({
   bgContainer: {
     width: "100%",
     height: "100%",
     alignItems: "center",
     justifyContent: "center",
     resizeMode: "cover",
   },
   brandTextContainer: {
     alignItems: "center",
     justifyContent: "center",
     flexDirection: "row",
   },
   brand: {
     fontSize: 60,
     fontFamily: fonts.RR,
     color: colors.secondary,
   },
   brand2: {
     fontSize: 60,  
     fontFamily: fonts.RR,
     color: colors.primary,
   },
   formContainer: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column"
  },
  inputContainer: {
    width: "80%",
    justifyContent: "center",
  },
  textInputContainer: {
    height: 50,
    borderWidth: 2,
    borderColor: colors.primary,
    borderRadius: 50,
    paddingLeft: 20,
    paddingRight: 20,
    marginBottom: 10
  },
  buttonContainer: {
    width: "100%",
    height: 'fit-content',
    justifyContent: "center",
    alignItems: "center",   
  },
  errorMessage: {
    color: "orange",
    fontSize: 15,
    fontFamily: fonts.RR
  },
  actionButton: {
    width: "80%",
    height: 50,
    backgroundColor: colors.primary,
    borderRadius: 50,
    marginBottom: 10,
    marginTop: 10,
    justifyContent: "center",
    alignItems: "center"
  },
  textButton: {
    color: "white",
    fontSize: 15,
    fontFamily: fonts.RR
  },
  changeActionButton: {
    width: "80%",
    justifyContent: "center",
    alignItems: "center"
  },
  changeActionText: {
    color: "#371287",
    fontSize: 15,
    fontFamily: fonts.RR,
  },
})