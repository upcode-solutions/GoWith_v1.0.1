import React, { createContext, useContext, useEffect, useState } from 'react';
import {View, Text} from 'react-native';

//import AsyncStorage
import AsyncStorage from '@react-native-async-storage/async-storage';

const ControlContext = createContext();

const ControlProvider = ({ children }) => {
    
    const [userAsyncData, setUserAsyncData] = useState({ 
        isNewUser: true,                    //to identify if user is new or not
        isLoggedIn: false,                  //to identify if user is logged in or not
        activateVerification: false,         //to identify if user needs to activate verification
        userInformation: {}
    });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const  setData = async () => {
            await AsyncStorage.setItem('userData', JSON.stringify(userAsyncData));
            console.log("data was set");
            setIsLoading(false);
        }

        const getData = async () => {
            const userData = await AsyncStorage.getItem('userData');
            if (userData == null) {
                setData();
            }
            setUserAsyncData(JSON.parse(userData));
            console.log("data was fetched");
            console.log("userAsyncData : ", userData);
            setIsLoading(false);
        }

        getData();
    }, []);

    if(isLoading || !userAsyncData) {
        return (
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                <Text>Loading...</Text>
            </View>
        );
    }

    return (
        <ControlContext.Provider value={{userAsyncData, setUserAsyncData}}>
            {children}
        </ControlContext.Provider>
    );
};

export const useControl = () => useContext(ControlContext);
export default ControlProvider