import { View, Text, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Button from "../../components/common/Button";
import { colors, spacing, typography } from "../../theme/tokens";

export default function WelcomeScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Welcome to CampusConnect</Text>
        <Text style={styles.subtitle}>
          Find rides, share updates, and connect with students at your university.
        </Text>
      </View>
      <View style={styles.footer}>
        <Button title="Get Started" onPress={() => navigation.navigate("EmailEntry")} />
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
    justifyContent: "center",
    paddingHorizontal: spacing.xl,
  },
  title: {
    fontSize: typography.title,
    fontWeight: typography.weight.bold,
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  subtitle: {
    fontSize: typography.body,
    color: colors.textSecondary,
  },
  footer: {
    padding: spacing.xl,
  },
});
