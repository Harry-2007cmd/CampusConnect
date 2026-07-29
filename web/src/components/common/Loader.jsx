import { colors, spacing, typography } from "../../theme/tokens";

export default function Loader({ label }) {
  return (
    <div style={styles.container}>
      <span className="cc-spinner" />
      {label ? <div style={styles.label}>{label}</div> : null}
    </div>
  );
}

const styles = {
  container: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: 240,
    backgroundColor: colors.background,
  },
  label: {
    marginTop: spacing.sm,
    fontSize: typography.body,
    color: colors.textSecondary,
  },
};
