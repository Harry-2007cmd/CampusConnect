import Button from "./Button";
import { colors, spacing, typography } from "../../theme/tokens";

// Friendly, specific empty/error copy — see docs/DESIGN.md "Required States".
export default function EmptyState({ title, message, actionLabel, onAction, tone = "neutral" }) {
  return (
    <div style={styles.container}>
      <div style={{ ...styles.title, ...(tone === "error" ? styles.titleError : null) }}>
        {title}
      </div>
      {message ? <div style={styles.message}>{message}</div> : null}
      {actionLabel && onAction ? (
        <div style={styles.action}>
          <Button title={actionLabel} onPress={onAction} variant="secondary" />
        </div>
      ) : null}
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: spacing.xl,
    minHeight: 240,
    backgroundColor: colors.background,
  },
  title: {
    fontSize: typography.subheading,
    fontWeight: typography.weight.semibold,
    color: colors.textPrimary,
    textAlign: "center",
    marginBottom: spacing.sm,
  },
  titleError: {
    color: colors.error,
  },
  message: {
    fontSize: typography.body,
    color: colors.textSecondary,
    textAlign: "center",
  },
  action: {
    marginTop: spacing.lg,
  },
};
