import { View, Text, ImageBackground, TouchableOpacity } from 'react-native'
import React from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';

import { useControl } from '../contexts/ControlProvider';

export default function HomeScreen() {
  
  const {userAsyncData, setUserAsyncData } = useControl();
  console.log(userAsyncData);



  const logout = async () => {
    try {
      await AsyncStorage.setItem('userData', JSON.stringify({ isLoggedIn: false, isNewUser: false, activateVerification: false, userInformation: {} }));
      setUserAsyncData({isLoggedIn: false, isNewUser: false, activateVerification: false, userInformation: {}});
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <ImageBackground source={require('../assets/images/BG-GW.png')} style={{ flex: 1 , width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center'}}>
        <TouchableOpacity onPress={() => logout()}>
          <Text>Logout</Text>
        </TouchableOpacity>
      </ImageBackground>
    </View>
  )
}