import { NavigationContainer } from "@react-navigation/native";
//import context
import ControlProvider from "./app/contexts/ControlProvider";
import ThemeProvider from "./app/contexts/ThemeProvider";
//import screens
import MainNavigationStack from "./app/MainNavigationStack";

export default function App() {
  return (
    <ControlProvider>
      <ThemeProvider>
        <NavigationContainer>
          <MainNavigationStack/>
        </NavigationContainer>
      </ThemeProvider>
    </ControlProvider>
  );
}