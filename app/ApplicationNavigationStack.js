import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useControl } from "./contexts/ControlProvider";

//import stacks
import ApplicationStack from "./stacks/ApplicationStack";
import UserAuthStack from "./stacks/UserAuthStack";

const Stack = createNativeStackNavigator();

export default function ApplicationNavigationStack() {
    const { userAsyncData } = useControl();

    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            {
            userAsyncData.isLoggedIn ? 
            <Stack.Screen name="ApplicationStack" component={ApplicationStack} /> 
            : 
            <Stack.Screen name="UserAuthStack" component={UserAuthStack} />
            }
        </Stack.Navigator>
    );
}