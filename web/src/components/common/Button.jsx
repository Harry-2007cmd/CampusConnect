import { useState } from "react";
import { colors, spacing, radius, typography } from "../../theme/tokens";

// variant: "primary" | "secondary" | "ghost"
export default function Button({
  title,
  label,
  onPress,
  variant = "primary",
  disabled = false,
  loading = false,
}) {
  const text = title ?? label;
  const isDisabled = disabled || loading;
  const [pressed, setPressed] = useState(false);

  const style = {
    ...styles.base,
    ...variantStyles[variant],
    ...(pressed && !isDisabled && variant === "primary"
      ? { backgroundColor: colors.primaryPressed }
      : null),
    ...(isDisabled ? styles.disabled : null),
    ...textVariantStyles[variant],
  };

  return (
    <button
      type="button"
      className="cc-pressable"
      onClick={onPress}
      disabled={isDisabled}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      onMouseLeave={() => setPressed(false)}
      style={style}
    >
      {loading ? (
        <span
          className={`cc-spinner cc-spinner--sm${
            variant === "primary" ? " cc-spinner--on-primary" : ""
          }`}
        />
      ) : (
        text
      )}
    </button>
  );
}

const styles = {
  base: {
    display: "inline-flex",
    minHeight: 44,
    borderRadius: radius.button,
    alignItems: "center",
    justifyContent: "center",
    paddingLeft: spacing.lg,
    paddingRight: spacing.lg,
    fontSize: typography.body,
    fontWeight: typography.weight.semibold,
  },
  disabled: {
    opacity: 0.5,
  },
};

const variantStyles = {
  primary: { backgroundColor: colors.primary, border: "none" },
  secondary: {
    backgroundColor: "transparent",
    border: `1px solid ${colors.secondary}`,
  },
  ghost: { backgroundColor: "transparent", border: "none" },
};

const textVariantStyles = {
  primary: { color: colors.surface },
  secondary: { color: colors.secondary },
  ghost: { color: colors.textSecondary },
};
