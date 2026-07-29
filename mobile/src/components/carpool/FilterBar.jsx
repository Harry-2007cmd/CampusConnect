import React from "react";
import { View, TextInput, Text, StyleSheet } from "react-native";
import { colors, spacing, radius, typography } from "../../theme/tokens";
import GenderToggle from "./GenderToggle";

export default function FilterBar({ filters, onChange }) {
  const update = (patch) => onChange({ ...filters, ...patch });

  return (
    <View style={styles.container}>
      <View style={styles.textRow}>
        <TextInput
          style={styles.input}
          placeholder="From"
          placeholderTextColor={colors.textSecondary}
          value={filters.origin}
          onChangeText={(text) => update({ origin: text })}
        />
        <TextInput
          style={styles.input}
          placeholder="To"
          placeholderTextColor={colors.textSecondary}
          value={filters.destination}
          onChangeText={(text) => update({ destination: text })}
        />
      </View>

      <View style={styles.priceRow}>
        <Text style={styles.label}>Max price</Text>
        <TextInput
          style={styles.priceInput}
          placeholder="Any"
          placeholderTextColor={colors.textSecondary}
          keyboardType="number-pad"
          value={filters.maxPrice != null ? String(filters.maxPrice) : ""}
          onChangeText={(text) => {
            const parsed = text.replace(/[^0-9]/g, "");
            update({ maxPrice: parsed ? Number(parsed) : null });
          }}
        />
      </View>

      <View style={styles.genderRow}>
        <Text style={styles.label}>Gender preference</Text>
        <GenderToggle
          value={filters.genderPref}
          onChange={(value) => update({ genderPref: value })}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.md,
    paddingBottom: spacing.md,
  },
  textRow: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  input: {
    flex: 1,
    borderRadius: radius.input,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.background,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    fontSize: typography.size.body,
    color: colors.textPrimary,
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  priceInput: {
    width: 96,
    borderRadius: radius.input,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.background,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    fontSize: typography.size.body,
    color: colors.textPrimary,
  },
  label: {
    fontSize: typography.size.bodySmall,
    fontWeight: typography.weight.semibold,
    color: colors.textPrimary,
  },
  genderRow: {
    gap: spacing.sm,
  },
});
