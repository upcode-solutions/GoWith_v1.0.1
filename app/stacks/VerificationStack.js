//import screens
import VerificationScreen from '../screens/VerificationScreen';
import MotorcycleRegistration from '../screens/MotorcycleRegistration';

//stack navigator
import { createNativeStackNavigator } from '@react-navigation/native-stack';
const Stack = createNativeStackNavigator();

export default function VerificationStack() {
    return (
        <Stack.Navigator initialRouteName='VerificationScreen' screenOptions={{ headerShown: false }}>
            <Stack.Screen name="VerificationScreen" component={VerificationScreen}/>
            <Stack.Screen name="MotorcycleRegistration" component={MotorcycleRegistration}/>
        </Stack.Navigator>
    );
}