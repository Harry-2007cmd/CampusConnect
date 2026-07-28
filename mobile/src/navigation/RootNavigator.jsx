import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { colors, typography } from "../theme/tokens";
import BrowseRidesScreen from "../screens/carpool/BrowseRidesScreen";
import RideDetailScreen from "../screens/carpool/RideDetailScreen";

// ⚠️ Shared with Track C (mobile-core) — see CLAUDE.md coordination note.
// Only the Carpool stack exists so far (Track B, tasks 18-19). Track C:
// add Auth/Profile/Feed stacks and the post-auth routing switch (task 33)
// here — flag before merging per the shared-file rule.
const Stack = createNativeStackNavigator();

export default function RootNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="BrowseRides"
        screenOptions={{
          headerStyle: { backgroundColor: colors.surface },
          headerTintColor: colors.textPrimary,
          headerTitleStyle: { fontWeight: typography.weight.semibold },
          headerShadowVisible: false,
        }}
      >
        <Stack.Screen
          name="BrowseRides"
          component={BrowseRidesScreen}
          options={{ title: "Find a Ride" }}
        />
        <Stack.Screen
          name="RideDetail"
          component={RideDetailScreen}
          options={{ title: "Ride Details" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
