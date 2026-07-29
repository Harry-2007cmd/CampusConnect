import { View, Text, StyleSheet } from "react-native";
import Button from "./Button";
import { colors, spacing, typography } from "../../theme/tokens";

// Friendly, specific empty/error copy — see docs/DESIGN.md "Required States".
export default function EmptyState({ title, message, actionLabel, onAction, tone = "neutral" }) {
  return (
    <View style={styles.container}>
      <Text style={[styles.title, tone === "error" && styles.titleError]}>{title}</Text>
      {message ? <Text style={styles.message}>{message}</Text> : null}
      {actionLabel && onAction ? (
        <View style={styles.action}>
          <Button title={actionLabel} onPress={onAction} variant="secondary" />
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: spacing.xl,
    backgroundColor: colors.background,
  },
  title: {
    fontSize: typography.subheading,
    fontWeight: typography.weight.semibold,
    color: colors.textPrimary,
    textAlign: "center",
    marginBottom: spacing.sm,
  },
  titleError: {
    color: colors.error,
  },
  message: {
    fontSize: typography.body,
    color: colors.textSecondary,
    textAlign: "center",
  },
  action: {
    marginTop: spacing.lg,
  },
});
