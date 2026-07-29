import { Pressable, Text, StyleSheet, ActivityIndicator } from "react-native";
import { colors, spacing, radius, typography } from "../../theme/tokens";

// variant: "primary" | "secondary" | "ghost"
export default function Button({ title, onPress, variant = "primary", disabled = false, loading = false }) {
  const isDisabled = disabled || loading;

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      style={({ pressed }) => [
        styles.base,
        variantStyles[variant],
        pressed && !isDisabled && variant === "primary" && { backgroundColor: colors.primaryPressed },
        isDisabled && styles.disabled,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={variant === "primary" ? colors.surface : colors.primary} />
      ) : (
        <Text style={[styles.label, textVariantStyles[variant]]}>{title}</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: 44,
    borderRadius: radius.button,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.lg,
  },
  label: {
    fontSize: typography.body,
    fontWeight: typography.weight.semibold,
  },
  disabled: {
    opacity: 0.5,
  },
});

const variantStyles = StyleSheet.create({
  primary: { backgroundColor: colors.primary },
  secondary: { backgroundColor: "transparent", borderWidth: 1, borderColor: colors.secondary },
  ghost: { backgroundColor: "transparent" },
});

const textVariantStyles = StyleSheet.create({
  primary: { color: colors.surface },
  secondary: { color: colors.secondary },
  ghost: { color: colors.textSecondary },
});
