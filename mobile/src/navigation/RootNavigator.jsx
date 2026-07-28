// ⚠️ Shared file (see CLAUDE.md / D-013) — flag non-trivial changes before merging
// to `main` so Track B (mobile-carpool) can coordinate. Track B's Carpool stack/tabs
// will be added here once merged; this file currently only wires up Auth/Profile
// (Track C scope) plus a temporary post-auth placeholder.

import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import WelcomeScreen from "../screens/auth/WelcomeScreen";
import EmailEntryScreen from "../screens/auth/EmailEntryScreen";
import OtpEntryScreen from "../screens/auth/OtpEntryScreen";
import ProfileSetupScreen from "../screens/profile/ProfileSetupScreen";
import MainPlaceholderScreen from "../screens/MainPlaceholderScreen";
import Loader from "../components/common/Loader";
import { useAuth } from "../hooks/useAuth";

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
  const { isLoading, isAuthenticated, isProfileComplete } = useAuth();

  if (isLoading) {
    return <Loader />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!isAuthenticated ? (
          <Stack.Group>
            <Stack.Screen name="Welcome" component={WelcomeScreen} />
            <Stack.Screen name="EmailEntry" component={EmailEntryScreen} />
            <Stack.Screen name="OtpEntry" component={OtpEntryScreen} />
          </Stack.Group>
        ) : !isProfileComplete ? (
          <Stack.Screen name="ProfileSetup" component={ProfileSetupScreen} />
        ) : (
          <Stack.Screen name="Main" component={MainPlaceholderScreen} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
