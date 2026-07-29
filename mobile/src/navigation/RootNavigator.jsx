// ⚠️ Shared file (see CLAUDE.md / D-013) — flag non-trivial changes before merging
// to `main`. Combines Track C's Auth/Profile stack with Track B's Carpool stack per
// D-015 #5/#7: authenticated + incomplete profile -> ProfileSetup; authenticated +
// complete profile -> Carpool BrowseRides (MainPlaceholderScreen retired, task 33).

import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import WelcomeScreen from "../screens/auth/WelcomeScreen";
import EmailEntryScreen from "../screens/auth/EmailEntryScreen";
import OtpEntryScreen from "../screens/auth/OtpEntryScreen";
import ProfileSetupScreen from "../screens/profile/ProfileSetupScreen";
import BrowseRidesScreen from "../screens/carpool/BrowseRidesScreen";
import RideDetailScreen from "../screens/carpool/RideDetailScreen";
import OfferRideScreen from "../screens/carpool/OfferRideScreen";
import MyRidesScreen from "../screens/carpool/MyRidesScreen";
import FeedScreen from "../screens/feed/FeedScreen";
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
          <Stack.Group>
            <Stack.Screen name="BrowseRides" component={BrowseRidesScreen} />
            <Stack.Screen name="RideDetail" component={RideDetailScreen} />
            <Stack.Screen name="OfferRide" component={OfferRideScreen} />
            <Stack.Screen name="MyRides" component={MyRidesScreen} />
            <Stack.Screen name="Feed" component={FeedScreen} />
          </Stack.Group>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
