import { colors, spacing, radius, typography } from "../../theme/tokens";
import GenderToggle from "./GenderToggle";

export default function FilterBar({ filters, onChange }) {
  const update = (patch) => onChange({ ...filters, ...patch });

  return (
    <div style={styles.container}>
      <div style={styles.textRow}>
        <input
          style={styles.input}
          placeholder="From"
          value={filters.origin}
          onChange={(e) => update({ origin: e.target.value })}
        />
        <input
          style={styles.input}
          placeholder="To"
          value={filters.destination}
          onChange={(e) => update({ destination: e.target.value })}
        />
      </div>

      <div style={styles.priceRow}>
        <span style={styles.label}>Max price</span>
        <input
          style={styles.priceInput}
          placeholder="Any"
          inputMode="numeric"
          value={filters.maxPrice != null ? String(filters.maxPrice) : ""}
          onChange={(e) => {
            const parsed = e.target.value.replace(/[^0-9]/g, "");
            update({ maxPrice: parsed ? Number(parsed) : null });
          }}
        />
      </div>

      <div style={styles.genderRow}>
        <span style={styles.label}>Gender preference</span>
        <GenderToggle
          value={filters.genderPref}
          onChange={(value) => update({ genderPref: value })}
        />
      </div>
    </div>
  );
}

const inputBase = {
  borderRadius: radius.input,
  borderWidth: 1,
  borderStyle: "solid",
  borderColor: colors.border,
  backgroundColor: colors.background,
  paddingLeft: spacing.md,
  paddingRight: spacing.md,
  paddingTop: spacing.sm,
  paddingBottom: spacing.sm,
  fontSize: typography.size.body,
  color: colors.textPrimary,
  outline: "none",
};

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    gap: spacing.md,
    paddingBottom: spacing.md,
  },
  textRow: {
    display: "flex",
    flexDirection: "row",
    gap: spacing.sm,
  },
  input: {
    ...inputBase,
    flex: 1,
    minWidth: 0,
  },
  priceRow: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  priceInput: {
    ...inputBase,
    width: 96,
  },
  label: {
    fontSize: typography.size.bodySmall,
    fontWeight: typography.weight.semibold,
    color: colors.textPrimary,
  },
  genderRow: {
    display: "flex",
    flexDirection: "column",
    gap: spacing.sm,
  },
};
