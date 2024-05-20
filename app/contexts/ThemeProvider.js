import React, { createContext, useContext, useState } from 'react';
import { useFonts } from 'expo-font';
import {View, Text} from 'react-native';

const themeContext = createContext();

const ThemeProvider = ({ children }) => {

    const [fontsLoaded] = useFonts({ // load fonts
        "Designer": require("../assets/themes/fonts/Designer.otf"),
        "Rubik-Regular": require("../assets/themes/fonts/Rubik-Regular.ttf"),
        "Rubik-SemiBold": require("../assets/themes/fonts/Rubik-SemiBold.ttf"),
        "RR": require("../assets/themes/fonts/Righteous-Regular.ttf")
      });

    if (!fontsLoaded) {
        return 
        <View>
            <Text>Loading...</Text>
        </View>;
    }
    
    const FontsAndColors = {
        colors: {
            primary: '#371287',
            secondary: '#6637CE',
            background: '#FCF9F7',
        },
        fonts: {
            Designer: "Designer",
            Rubik: "Rubik-Regular",
            RubikSemiBold: "Rubik-SemiBold",
            RR: "RR"
        }
    }

    return (
        <themeContext.Provider value={FontsAndColors}>
            {children}
        </themeContext.Provider>
    );
};

export const useTheme = () => useContext(themeContext);
export default ThemeProvider