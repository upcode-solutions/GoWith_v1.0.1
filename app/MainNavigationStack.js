import { createStackNavigator } from "@react-navigation/stack";
import { useControl } from "./contexts/ControlProvider";

//import screens
import ApplicationNavigationStack from "./ApplicationNavigationStack";
import VerificationStack from "./stacks/VerificationStack";

const Stack = createStackNavigator();

export default function MainNavigationStack() {
    const { userAsyncData } = useControl();
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            {
                userAsyncData.activateVerification ? 
                <Stack.Screen name="Verification" component={VerificationStack} />
                : 
                <Stack.Screen name="Application" component={ApplicationNavigationStack} />
            }
        </Stack.Navigator>
    );
}