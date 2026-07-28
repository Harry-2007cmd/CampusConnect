import { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Button from "../../components/common/Button";
import TextField from "../../components/common/TextField";
import { useAuth } from "../../hooks/useAuth";
import { colors, spacing, typography } from "../../theme/tokens";

export default function EmailEntryScreen({ navigation }) {
  const { sendOtp } = useAuth();
  const [email, setEmail] = useState("");
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleContinue() {
    setError(null);
    if (!email.trim().endsWith(".edu")) {
      setError("Please enter your university (.edu) email.");
      return;
    }

    setIsSubmitting(true);
    try {
      await sendOtp(email.trim());
      navigation.navigate("OtpEntry", { email: email.trim() });
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>What's your university email?</Text>
        <Text style={styles.subtitle}>We'll send you a one-time code to verify it's you.</Text>

        <View style={styles.form}>
          <TextField
            label="Email"
            placeholder="you@university.edu"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            autoCorrect={false}
            error={error}
          />
        </View>
      </View>
      <View style={styles.footer}>
        <Button title="Send Code" onPress={handleContinue} loading={isSubmitting} disabled={!email.trim()} />
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
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xl,
  },
  title: {
    fontSize: typography.title,
    fontWeight: typography.weight.bold,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  subtitle: {
    fontSize: typography.body,
    color: colors.textSecondary,
    marginBottom: spacing.lg,
  },
  form: {
    marginTop: spacing.md,
  },
  footer: {
    padding: spacing.xl,
  },
});
