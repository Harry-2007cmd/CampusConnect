import { Pressable, Text, View, StyleSheet } from "react-native";
import { colors, spacing, radius, typography } from "../../theme/tokens";

// Pill-shaped toggle chips per docs/DESIGN.md. Options always stay visibly tappable.
export default function ChipToggle({ options, value, onChange, label }) {
  return (
    <View style={styles.container}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <View style={styles.row}>
        {options.map((option) => {
          const isActive = option.value === value;
          return (
            <Pressable
              key={option.value}
              onPress={() => onChange(option.value)}
              style={[styles.chip, isActive && styles.chipActive]}
            >
              <Text style={[styles.chipLabel, isActive && styles.chipLabelActive]}>{option.label}</Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
  },
  label: {
    fontSize: typography.bodySmall,
    fontWeight: typography.weight.semibold,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  row: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
  chip: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: radius.input,
    borderWidth: 1,
    borderColor: colors.border,
  },
  chipActive: {
    borderColor: colors.secondary,
    backgroundColor: colors.secondary,
  },
  chipLabel: {
    fontSize: typography.bodySmall,
    color: colors.textSecondary,
  },
  chipLabelActive: {
    color: colors.surface,
    fontWeight: typography.weight.semibold,
  },
});
