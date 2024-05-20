import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useControl } from "../contexts/ControlProvider";
//screens
import LoginRegisterScreen from "../screens/LoginRegisterScreen";
import WelcomeScreen from "../screens/WelcomeScreen";
import RegistrationScreen from "../screens/RegistrationScreen";

const Stack = createNativeStackNavigator();

export default function UserAuthStack() {
    const { userAsyncData } = useControl();
    return (
        <Stack.Navigator initialRouteName={ userAsyncData.isNewUser ? "WelcomeScreen" : "LoginRegisterScreen"} screenOptions={{ headerShown: false }}>
            <Stack.Screen name="WelcomeScreen" component={WelcomeScreen} />
            <Stack.Screen name="LoginRegisterScreen" component={LoginRegisterScreen} />
            <Stack.Screen name="RegistrationScreen" component={RegistrationScreen} />
        </Stack.Navigator>
    )
}