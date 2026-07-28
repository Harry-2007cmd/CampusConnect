import React from "react";
import { View, Pressable, Text, StyleSheet } from "react-native";
import { colors, spacing, radius, typography } from "../../theme/tokens";

const OPTIONS = [
  { value: "any", label: "Any" },
  { value: "female", label: "Female" },
  { value: "male", label: "Male" },
];

// Filter-state toggle chips per DESIGN.md: all options always visible and
// tappable — never grayed out or hidden, even when a filter narrows results.
export default function GenderToggle({ value, onChange }) {
  return (
    <View style={styles.row}>
      {OPTIONS.map((option) => {
        const active = option.value === value;
        return (
          <Pressable
            key={option.value}
            onPress={() => onChange(option.value)}
            style={[
              styles.chip,
              { borderColor: active ? colors.secondary : colors.border },
              active && { backgroundColor: colors.secondary },
            ]}
          >
            <Text
              style={[
                styles.chipText,
                { color: active ? colors.surface : colors.textPrimary },
              ]}
            >
              {option.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  chip: {
    borderRadius: radius.input,
    borderWidth: 1,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  chipText: {
    fontSize: typography.size.bodySmall,
    fontWeight: typography.weight.semibold,
  },
});
