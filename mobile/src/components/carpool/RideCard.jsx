import React from "react";
import { Pressable, View, Text, StyleSheet } from "react-native";
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
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
    >
      <View style={styles.routeRow}>
        <Text style={styles.routeText} numberOfLines={1}>
          {ride.origin} → {ride.destination}
        </Text>
        <Text style={styles.price}>₹{ride.price_per_seat}</Text>
      </View>

      <Text style={styles.meta}>
        {formatDepartureTime(ride.departure_time)} · {ride.driver_name}
      </Text>

      <View style={styles.footerRow}>
        <View
          style={[
            styles.badge,
            {
              backgroundColor:
                ride.seats_available > 0 ? colors.background : colors.border,
            },
          ]}
        >
          <Text
            style={[
              styles.badgeText,
              { color: ride.seats_available > 0 ? colors.success : colors.textSecondary },
            ]}
          >
            {seatsLabel}
          </Text>
        </View>
        {ride.gender_preference !== "any" ? (
          <View style={[styles.badge, { backgroundColor: colors.background }]}>
            <Text style={[styles.badgeText, { color: colors.secondary }]}>
              {ride.gender_preference} preferred
            </Text>
          </View>
        ) : null}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    gap: spacing.xs,
  },
  cardPressed: {
    backgroundColor: colors.background,
  },
  routeRow: {
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
    flexDirection: "row",
    gap: spacing.sm,
    marginTop: spacing.xs,
  },
  badge: {
    borderRadius: radius.input,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  badgeText: {
    fontSize: typography.size.caption,
    fontWeight: typography.weight.semibold,
  },
});
