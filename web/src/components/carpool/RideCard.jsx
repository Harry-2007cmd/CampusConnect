import { colors, spacing, radius, typography } from "../../theme/tokens";

function formatDepartureTime(iso) {
  const date = new Date(iso);
  return date.toLocaleString(undefined, {
    weekday: "short",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function RideCard({ ride, onPress }) {
  const seatsLabel =
    ride.seats_available > 0
      ? `${ride.seats_available} seat${ride.seats_available === 1 ? "" : "s"} left`
      : "Full";

  return (
    <div
      className="cc-pressable"
      onClick={onPress}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") onPress?.();
      }}
      style={styles.card}
    >
      <div style={styles.routeRow}>
        <span style={styles.routeText}>
          {ride.origin} → {ride.destination}
        </span>
        <span style={styles.price}>₹{ride.price_per_seat}</span>
      </div>

      <div style={styles.meta}>
        {formatDepartureTime(ride.departure_time)} · {ride.driver_name}
      </div>

      <div style={styles.footerRow}>
        <div
          style={{
            ...styles.badge,
            backgroundColor: ride.seats_available > 0 ? colors.background : colors.border,
          }}
        >
          <span
            style={{
              ...styles.badgeText,
              color: ride.seats_available > 0 ? colors.success : colors.textSecondary,
            }}
          >
            {seatsLabel}
          </span>
        </div>
        {ride.gender_preference !== "any" ? (
          <div style={{ ...styles.badge, backgroundColor: colors.background }}>
            <span style={{ ...styles.badgeText, color: colors.secondary }}>
              {ride.gender_preference} preferred
            </span>
          </div>
        ) : null}
      </div>
    </div>
  );
}

const styles = {
  card: {
    display: "flex",
    flexDirection: "column",
    backgroundColor: colors.surface,
    borderRadius: radius.card,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: colors.border,
    padding: spacing.md,
    gap: spacing.xs,
  },
  routeRow: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: spacing.sm,
  },
  routeText: {
    flex: 1,
    fontSize: typography.size.body,
    fontWeight: typography.weight.semibold,
    color: colors.textPrimary,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  price: {
    fontSize: typography.size.body,
    fontWeight: typography.weight.bold,
    color: colors.primary,
  },
  meta: {
    fontSize: typography.size.bodySmall,
    color: colors.textSecondary,
  },
  footerRow: {
    display: "flex",
    flexDirection: "row",
    gap: spacing.sm,
    marginTop: spacing.xs,
  },
  badge: {
    borderRadius: radius.input,
    paddingLeft: spacing.sm,
    paddingRight: spacing.sm,
    paddingTop: spacing.xs,
    paddingBottom: spacing.xs,
  },
  badgeText: {
    fontSize: typography.size.caption,
    fontWeight: typography.weight.semibold,
  },
};
