import { colors, spacing, radius, typography } from "../../theme/tokens";

// Web equivalent of the mobile TextField. Keeps the same prop surface
// (onChangeText, keyboardType, multiline, maxLength, autoCapitalize, autoCorrect)
// so screens ported from mobile don't need to change how they call it.
export default function TextField({
  label,
  error,
  value,
  onChangeText,
  placeholder,
  multiline = false,
  keyboardType,
  maxLength,
  autoCapitalize,
  autoCorrect,
}) {
  const inputMode =
    keyboardType === "email-address"
      ? "email"
      : keyboardType === "number-pad"
      ? "numeric"
      : undefined;

  const commonProps = {
    value,
    placeholder,
    maxLength,
    onChange: (e) => onChangeText?.(e.target.value),
    style: {
      ...styles.input,
      ...(error ? styles.inputError : null),
      ...(multiline ? styles.multiline : null),
    },
    autoCapitalize,
    autoCorrect: autoCorrect === false ? "off" : undefined,
  };

  return (
    <div style={styles.container}>
      {label ? <div style={styles.label}>{label}</div> : null}
      {multiline ? (
        <textarea rows={3} {...commonProps} />
      ) : (
        <input
          type={keyboardType === "email-address" ? "email" : "text"}
          inputMode={inputMode}
          {...commonProps}
        />
      )}
      {error ? <div style={styles.error}>{error}</div> : null}
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
  input: {
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: colors.border,
    borderRadius: radius.input,
    backgroundColor: colors.background,
    paddingLeft: spacing.md,
    paddingRight: spacing.md,
    paddingTop: spacing.sm,
    paddingBottom: spacing.sm,
    fontSize: typography.body,
    color: colors.textPrimary,
    minHeight: 44,
    outline: "none",
    width: "100%",
  },
  multiline: {
    minHeight: 88,
    resize: "vertical",
  },
  inputError: {
    borderColor: colors.error,
  },
  error: {
    fontSize: typography.caption,
    color: colors.error,
    marginTop: spacing.xs,
  },
};
