import { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Button from "../../components/common/Button";
import TextField from "../../components/common/TextField";
import { useAuth } from "../../hooks/useAuth";
import { colors, spacing, typography } from "../../theme/tokens";

// Hackathon scope (D-011): no resend cooldown or attempt lockout.
export default function OtpEntryScreen({ route }) {
  const { email } = route.params;
  const { confirmOtp } = useAuth();
  const [code, setCode] = useState("");
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleVerify() {
    setError(null);
    setIsSubmitting(true);
    try {
      await confirmOtp(email, code.trim());
      // RootNavigator watches auth state and routes to ProfileSetup/Main automatically.
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Enter the code</Text>
        <Text style={styles.subtitle}>We sent a 6-digit code to {email}.</Text>

        <View style={styles.form}>
          <TextField
            label="Verification code"
            placeholder="123456"
            value={code}
            onChangeText={setCode}
            keyboardType="number-pad"
            maxLength={6}
            error={error}
          />
        </View>
      </View>
      <View style={styles.footer}>
        <Button title="Verify" onPress={handleVerify} loading={isSubmitting} disabled={code.trim().length !== 6} />
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
