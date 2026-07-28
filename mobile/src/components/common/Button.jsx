import React from "react";
import { Pressable, Text, StyleSheet, ActivityIndicator } from "react-native";
import { colors, spacing, radius, typography } from "../../theme/tokens";

const VARIANT_STYLES = {
  primary: {
    background: colors.primary,
    backgroundPressed: colors.primaryPressed,
    border: "transparent",
    text: colors.surface,
  },
  secondary: {
    background: "transparent",
    backgroundPressed: colors.background,
    border: colors.secondary,
    text: colors.secondary,
  },
  ghost: {
    background: "transparent",
    backgroundPressed: colors.background,
    border: "transparent",
    text: colors.textSecondary,
  },
};

export default function Button({
  label,
  onPress,
  variant = "primary",
  disabled = false,
  loading = false,
}) {
  const palette = VARIANT_STYLES[variant] ?? VARIANT_STYLES.primary;

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.base,
        {
          backgroundColor: pressed ? palette.backgroundPressed : palette.background,
          borderColor: palette.border,
          borderWidth: palette.border === "transparent" ? 0 : 1,
          opacity: disabled ? 0.5 : 1,
        },
      ]}
    >
      {loading ? (
        <ActivityIndicator color={palette.text} />
      ) : (
        <Text style={[styles.label, { color: palette.text }]}>{label}</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: 44,
    borderRadius: radius.button,
    paddingHorizontal: spacing.lg,
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    fontSize: typography.size.body,
    fontWeight: typography.weight.semibold,
  },
});
