import { useFonts } from "expo-font";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomePage from "./src/home";

const Stack = createNativeStackNavigator();

export default function App() {
  const [fontsLoaded] = useFonts({
    Roboto: require("./assets/fonts/Roboto-Regular.ttf"),
    RobotoBold: require("./assets/fonts/Roboto-Bold.ttf"),
    RobotoItalic: require("./assets/fonts/Roboto-Italic.ttf"),
    RobotoBoldItalic: require("./assets/fonts/Roboto-BoldItalic.ttf"),
    DMSans: require("./assets/fonts/DMSans-Regular.ttf"),
    DMSansBold: require("./assets/fonts/DMSans-Bold.ttf"),
    Caveat: require("./assets/fonts/Caveat-VariableFont_wght.ttf"),
  });

  if (!fontsLoaded) return null;

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen
          name="Home"
          component={HomePage}
          options={{
            headerShown: false,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
