//stack navigator
import { createNativeStackNavigator } from '@react-navigation/native-stack';

//import screens
import HomeScreen from '../screens/HomeScreen';

const Stack = createNativeStackNavigator();

export default function ApplicationStack() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Home" component={HomeScreen} />
        </Stack.Navigator>
    );
}