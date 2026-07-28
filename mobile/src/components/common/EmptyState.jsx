import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { colors, spacing, typography } from "../../theme/tokens";
import Button from "./Button";

// Reused for both the "no results" empty state and the "request failed" error state
// (DESIGN.md requires both on every async screen) — `tone` swaps the copy color only.
export default function EmptyState({
  title,
  message,
  tone = "neutral",
  actionLabel,
  onAction,
}) {
  const titleColor = tone === "error" ? colors.error : colors.textPrimary;

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: titleColor }]}>{title}</Text>
      {message ? <Text style={styles.message}>{message}</Text> : null}
      {actionLabel && onAction ? (
        <View style={styles.action}>
          <Button label={actionLabel} onPress={onAction} variant="secondary" />
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
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.xl,
    gap: spacing.sm,
  },
  title: {
    fontSize: typography.size.subheading,
    fontWeight: typography.weight.semibold,
    textAlign: "center",
  },
  message: {
    fontSize: typography.size.bodySmall,
    color: colors.textSecondary,
    textAlign: "center",
  },
  action: {
    marginTop: spacing.md,
  },
});
