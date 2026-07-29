import { colors, spacing, radius, typography } from "../../theme/tokens";

export default function UpvoteButton({ count, onPress, disabled }) {
  return (
    <button
      type="button"
      className="cc-pressable"
      onClick={onPress}
      disabled={disabled}
      style={styles.chip}
    >
      <span style={styles.arrow}>▲</span>
      <span style={styles.count}>{count}</span>
    </button>
  );
}

const styles = {
  chip: {
    display: "inline-flex",
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    borderRadius: radius.input,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: colors.border,
    backgroundColor: "transparent",
    paddingLeft: spacing.sm,
    paddingRight: spacing.sm,
    paddingTop: spacing.xs,
    paddingBottom: spacing.xs,
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
};
