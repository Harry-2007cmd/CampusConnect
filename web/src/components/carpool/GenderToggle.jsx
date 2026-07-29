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
    <div style={styles.row}>
      {OPTIONS.map((option) => {
        const active = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            className="cc-pressable"
            onClick={() => onChange(option.value)}
            style={{
              ...styles.chip,
              borderColor: active ? colors.secondary : colors.border,
              backgroundColor: active ? colors.secondary : "transparent",
            }}
          >
            <span
              style={{
                ...styles.chipText,
                color: active ? colors.surface : colors.textPrimary,
              }}
            >
              {option.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}

const styles = {
  row: {
    display: "flex",
    flexDirection: "row",
    gap: spacing.sm,
  },
  chip: {
    borderRadius: radius.input,
    borderWidth: 1,
    borderStyle: "solid",
    paddingLeft: spacing.md,
    paddingRight: spacing.md,
    paddingTop: spacing.xs,
    paddingBottom: spacing.xs,
  },
  chipText: {
    fontSize: typography.size.bodySmall,
    fontWeight: typography.weight.semibold,
  },
};
