import { View, Text, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Button from "../components/common/Button";
import { useAuth } from "../hooks/useAuth";
import { colors, spacing, typography } from "../theme/tokens";

// Temporary stand-in until Track B's Carpool tabs / Track C's Feed screen land here
// (TASKS.md task 33: authenticated users with a complete profile land on Carpool browse).
export default function MainPlaceholderScreen() {
  const { user, logOut } = useAuth();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>You're in, {user?.name?.split(" ")[0] || "there"}!</Text>
        <Text style={styles.subtitle}>Carpool and Feed screens land here once merged.</Text>
      </View>
      <View style={styles.footer}>
        <Button title="Log out" variant="ghost" onPress={logOut} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: "space-between",
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.xl,
  },
  title: {
    fontSize: typography.title,
    fontWeight: typography.weight.bold,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
    textAlign: "center",
  },
  subtitle: {
    fontSize: typography.body,
    color: colors.textSecondary,
    textAlign: "center",
  },
  footer: {
    padding: spacing.xl,
  },
});
