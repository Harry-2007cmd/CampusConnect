import { Pressable, Text, StyleSheet } from "react-native";
import { colors, spacing, radius, typography } from "../../theme/tokens";

export default function UpvoteButton({ count, onPress, disabled }) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [styles.chip, pressed && !disabled && styles.chipPressed]}
    >
      <Text style={styles.arrow}>▲</Text>
      <Text style={styles.count}>{count}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    borderRadius: radius.input,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  chipPressed: {
    backgroundColor: colors.background,
    borderColor: colors.secondary,
  },
  arrow: {
    fontSize: typography.size.caption,
    color: colors.secondary,
  },
  count: {
    fontSize: typography.size.bodySmall,
    fontWeight: typography.weight.semibold,
    color: colors.textPrimary,
  },
});
