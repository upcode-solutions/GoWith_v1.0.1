import { TouchableOpacity, ImageBackground, StyleSheet, Text, View } from 'react-native'
import { SafeAreaProvider, SafeAreaView} from 'react-native-safe-area-context'
import React from 'react'

//import contects
import { useTheme } from '../contexts/ThemeProvider'
import { useControl } from '../contexts/ControlProvider'

//import async storage
import AsyncStorage from '@react-native-async-storage/async-storage'

export default function WelcomeScreen({navigation}) {
  const {colors, fonts} = useTheme()
  const styles = createStyles(colors, fonts)
  const {userAsyncData, setUserAsyncData} = useControl()

  userChangeHandler = async () => {
    await setUserAsyncData({...userAsyncData, isNewUser: false})
    await AsyncStorage.setItem('userData', JSON.stringify({...JSON.parse(await AsyncStorage.getItem('userData')), isNewUser: false}))
    console.log("isNewUser changed to false");
    navigation.navigate('LoginRegisterScreen')

  }

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <ImageBackground source={require('../assets/images/BG-GW.png')} style={styles.bgimage}>
          <View>
            <View style={styles.brandTextContainer}>
                <Text style={styles.brand}>GO</Text>
                <Text style={styles.brand2}>WITH</Text>
            </View>
            <View style={styles.wholeButtonContainer}>
                <TouchableOpacity style={styles.startButtonCon} onPress={() => userChangeHandler()}>
                    <Text style={styles.startButton}>GET STARTED</Text>
                </TouchableOpacity> 
            </View>
          </View>
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
  bgimage: {
    flex: 1,
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    justifyContent: "center",
    alignItems: "center",
  },
  brandTextContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  brand: {
    fontFamily: fonts.RR,
    fontSize: 55,
    color: colors.primary,
  },
  brand2: {
    fontFamily: fonts.RR,
    fontSize: 55,
    color: colors.secondary,
  },
  wholeButtonContainer: {
    justifyContent: "center",
    alignItems: "center",
    minWidth: '100%',
    marginTop: 10,
  },
  startButtonCon: {
    backgroundColor: colors.primary,
    width: '80%',
    height: 50,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  startButton: {
    fontFamily: fonts.RubikSemiBold,
    fontSize: 15,
    color: colors.background,
  },
})