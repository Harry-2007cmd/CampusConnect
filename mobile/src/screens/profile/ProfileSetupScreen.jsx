import { useState } from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Button from "../../components/common/Button";
import TextField from "../../components/common/TextField";
import ChipToggle from "../../components/common/ChipToggle";
import { useAuth } from "../../hooks/useAuth";
import { colors, spacing, typography } from "../../theme/tokens";

// Trimmed profile fields per D-011: name, year, department, gender only.
const YEAR_OPTIONS = [
  { label: "1st", value: "1" },
  { label: "2nd", value: "2" },
  { label: "3rd", value: "3" },
  { label: "4th", value: "4" },
  { label: "5th+", value: "5+" },
];

// Self-reported at the same trust level as the rest of the app's identity model (D-001).
// Backs Carpool's gender-preference filter (D-012) — do not remove.
const GENDER_OPTIONS = [
  { label: "Woman", value: "female" },
  { label: "Man", value: "male" },
  { label: "Other", value: "other" },
];

export default function ProfileSetupScreen() {
  const { saveProfile } = useAuth();
  const [name, setName] = useState("");
  const [year, setYear] = useState(null);
  const [department, setDepartment] = useState("");
  const [gender, setGender] = useState(null);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isComplete = name.trim() && year && department.trim() && gender;

  async function handleSave() {
    setError(null);
    setIsSubmitting(true);
    try {
      await saveProfile({ name: name.trim(), year, department: department.trim(), gender });
      // RootNavigator watches AuthContext.isProfileComplete and routes onward automatically.
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Set up your profile</Text>
        <Text style={styles.subtitle}>Just a few details so other students know who you are.</Text>

        <TextField label="Full name" placeholder="Jane Doe" value={name} onChangeText={setName} />

        <ChipToggle label="Year" options={YEAR_OPTIONS} value={year} onChange={setYear} />

        <TextField
          label="Department"
          placeholder="Computer Science"
          value={department}
          onChangeText={setDepartment}
        />

        <ChipToggle label="Gender" options={GENDER_OPTIONS} value={gender} onChange={setGender} />

        {error ? <Text style={styles.error}>{error}</Text> : null}
      </ScrollView>
      <View style={styles.footer}>
        <Button title="Continue" onPress={handleSave} loading={isSubmitting} disabled={!isComplete} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xl,
    paddingBottom: spacing.lg,
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
  error: {
    fontSize: typography.bodySmall,
    color: colors.error,
    marginTop: spacing.xs,
  },
  footer: {
    padding: spacing.xl,
  },
});
