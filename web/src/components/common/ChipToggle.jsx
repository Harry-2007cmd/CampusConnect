import { colors, spacing, radius, typography } from "../../theme/tokens";

// Pill-shaped toggle chips per docs/DESIGN.md. Options always stay visibly tappable.
export default function ChipToggle({ options, value, onChange, label }) {
  return (
    <div style={styles.container}>
      {label ? <div style={styles.label}>{label}</div> : null}
      <div style={styles.row}>
        {options.map((option) => {
          const isActive = option.value === value;
          return (
            <button
              key={option.value}
              type="button"
              className="cc-pressable"
              onClick={() => onChange(option.value)}
              style={{ ...styles.chip, ...(isActive ? styles.chipActive : null) }}
            >
              <span
                style={{
                  ...styles.chipLabel,
                  ...(isActive ? styles.chipLabelActive : null),
                }}
              >
                {option.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    marginBottom: spacing.md,
  },
  label: {
    fontSize: typography.bodySmall,
    fontWeight: typography.weight.semibold,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  row: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
  chip: {
    paddingTop: spacing.sm,
    paddingBottom: spacing.sm,
    paddingLeft: spacing.md,
    paddingRight: spacing.md,
    borderRadius: radius.input,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: colors.border,
    backgroundColor: "transparent",
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
};
