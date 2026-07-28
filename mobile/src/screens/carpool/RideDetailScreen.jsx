import React, { useCallback, useEffect, useState } from "react";
import { View, Text, ScrollView, StyleSheet, Alert } from "react-native";
import { colors, spacing, radius, typography } from "../../theme/tokens";
import Button from "../../components/common/Button";
import Loader from "../../components/common/Loader";
import EmptyState from "../../components/common/EmptyState";
import { getRideById, requestSeat } from "../../services/rideService";

function formatDepartureTime(iso) {
  const date = new Date(iso);
  return date.toLocaleString(undefined, {
    weekday: "long",
    hour: "numeric",
    minute: "2-digit",
    month: "short",
    day: "numeric",
  });
}

export default function RideDetailScreen({ route }) {
  const { rideId } = route.params;
  const [ride, setRide] = useState(null);
  const [status, setStatus] = useState("loading"); // loading | success | error
  const [requestState, setRequestState] = useState("idle"); // idle | pending | sent

  const load = useCallback(async () => {
    setStatus("loading");
    try {
      const data = await getRideById(rideId);
      setRide(data);
      setStatus(data ? "success" : "error");
    } catch (err) {
      setStatus("error");
    }
  }, [rideId]);

  useEffect(() => {
    load();
  }, [load]);

  const handleRequestSeat = async () => {
    setRequestState("pending");
    try {
      await requestSeat(rideId);
      setRequestState("sent");
    } catch (err) {
      setRequestState("idle");
      Alert.alert("Couldn't send request", "Please try again in a moment.");
    }
  };

  if (status === "loading") {
    return <Loader label="Loading ride..." />;
  }

  if (status === "error" || !ride) {
    return (
      <EmptyState
        tone="error"
        title="Couldn't load this ride"
        message="It may have been cancelled, or something went wrong loading it."
        actionLabel="Retry"
        onAction={load}
      />
    );
  }

  const seatsFull = ride.seats_available <= 0;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.route}>
        {ride.origin} → {ride.destination}
      </Text>
      <Text style={styles.time}>{formatDepartureTime(ride.departure_time)}</Text>

      <View style={styles.card}>
        <Row label="Driver" value={ride.driver_name} />
        <Row label="Price per seat" value={`₹${ride.price_per_seat}`} />
        <Row
          label="Seats"
          value={
            seatsFull
              ? "Full"
              : `${ride.seats_available} of ${ride.seats_total} available`
          }
          valueColor={seatsFull ? colors.error : colors.success}
        />
        <Row
          label="Gender preference"
          value={ride.gender_preference === "any" ? "No preference" : ride.gender_preference}
        />
      </View>

      {ride.notes ? (
        <View style={styles.card}>
          <Text style={styles.notesLabel}>Notes from driver</Text>
          <Text style={styles.notes}>{ride.notes}</Text>
        </View>
      ) : null}

      <View style={styles.actionWrap}>
        {requestState === "sent" ? (
          <EmptyState
            title="Request sent"
            message="The driver will accept or decline from their My Rides screen."
          />
        ) : (
          <Button
            label={seatsFull ? "No seats available" : "Request Seat"}
            onPress={handleRequestSeat}
            disabled={seatsFull}
            loading={requestState === "pending"}
          />
        )}
      </View>
    </ScrollView>
  );
}

function Row({ label, value, valueColor }) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={[styles.rowValue, valueColor ? { color: valueColor } : null]}>
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: spacing.lg,
    gap: spacing.lg,
  },
  route: {
    fontSize: typography.size.title,
    fontWeight: typography.weight.bold,
    color: colors.textPrimary,
  },
  time: {
    fontSize: typography.size.body,
    color: colors.textSecondary,
    marginTop: -spacing.sm,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    gap: spacing.sm,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  rowLabel: {
    fontSize: typography.size.bodySmall,
    color: colors.textSecondary,
  },
  rowValue: {
    fontSize: typography.size.body,
    fontWeight: typography.weight.semibold,
    color: colors.textPrimary,
  },
  notesLabel: {
    fontSize: typography.size.bodySmall,
    fontWeight: typography.weight.semibold,
    color: colors.textPrimary,
  },
  notes: {
    fontSize: typography.size.body,
    color: colors.textPrimary,
  },
  actionWrap: {
    marginTop: spacing.sm,
  },
});
