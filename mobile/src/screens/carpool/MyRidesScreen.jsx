import { useCallback, useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, Pressable, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors, spacing, radius, typography } from "../../theme/tokens";
import Button from "../../components/common/Button";
import Loader from "../../components/common/Loader";
import EmptyState from "../../components/common/EmptyState";
import { getMyRides, acceptRequest, declineRequest } from "../../services/rideService";

const TABS = [
  { key: "driving", label: "Driving" },
  { key: "riding", label: "Riding" },
];

function formatDepartureTime(iso) {
  const date = new Date(iso);
  return date.toLocaleString(undefined, {
    weekday: "short",
    hour: "numeric",
    minute: "2-digit",
    month: "short",
    day: "numeric",
  });
}

export default function MyRidesScreen() {
  const [activeTab, setActiveTab] = useState("driving");
  const [mine, setMine] = useState({ driving: [], riding: [] });
  const [status, setStatus] = useState("loading"); // loading | success | error
  const [pendingRequestId, setPendingRequestId] = useState(null);

  const load = useCallback(async () => {
    setStatus("loading");
    try {
      const data = await getMyRides();
      setMine(data);
      setStatus("success");
    } catch (err) {
      setStatus("error");
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function handleDecision(rideId, requestId, decision) {
    setPendingRequestId(requestId);
    try {
      if (decision === "accept") {
        await acceptRequest(rideId, requestId);
      } else {
        await declineRequest(rideId, requestId);
      }
      await load();
    } catch (err) {
      Alert.alert("Couldn't update request", "Please try again in a moment.");
    } finally {
      setPendingRequestId(null);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>My Rides</Text>

      <View style={styles.tabRow}>
        {TABS.map((tab) => {
          const active = tab.key === activeTab;
          return (
            <Pressable
              key={tab.key}
              onPress={() => setActiveTab(tab.key)}
              style={[styles.tab, active && styles.tabActive]}
            >
              <Text style={[styles.tabLabel, active && styles.tabLabelActive]}>{tab.label}</Text>
            </Pressable>
          );
        })}
      </View>

      {status === "loading" ? (
        <Loader label="Loading your rides..." />
      ) : status === "error" ? (
        <EmptyState
          tone="error"
          title="Couldn't load your rides"
          message="Something went wrong on our end. Please try again."
          actionLabel="Retry"
          onAction={load}
        />
      ) : activeTab === "driving" ? (
        <DrivingList
          rides={mine.driving}
          pendingRequestId={pendingRequestId}
          onDecision={handleDecision}
        />
      ) : (
        <RidingList entries={mine.riding} />
      )}
    </SafeAreaView>
  );
}

function DrivingList({ rides, pendingRequestId, onDecision }) {
  if (rides.length === 0) {
    return (
      <EmptyState
        title="You haven't offered any rides yet"
        message="Post a ride from Browse Rides to see it show up here."
      />
    );
  }

  return (
    <FlatList
      data={rides}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.listContent}
      ItemSeparatorComponent={() => <View style={{ height: spacing.md }} />}
      renderItem={({ item: ride }) => (
        <View style={styles.card}>
          <Text style={styles.route}>
            {ride.origin} → {ride.destination}
          </Text>
          <Text style={styles.meta}>
            {formatDepartureTime(ride.departure_time)} · {ride.seats_available} of {ride.seats_total} seats left
          </Text>

          {ride.requests.length === 0 ? (
            <Text style={styles.emptyRequests}>No requests yet.</Text>
          ) : (
            ride.requests.map((req) => (
              <View key={req.id} style={styles.requestRow}>
                <View style={styles.requestInfo}>
                  <Text style={styles.requestName}>{req.rider_name}</Text>
                  <Text style={styles.requestStatus}>{req.status}</Text>
                </View>
                {req.status === "pending" ? (
                  <View style={styles.requestActions}>
                    <Button
                      title="Decline"
                      variant="secondary"
                      onPress={() => onDecision(ride.id, req.id, "decline")}
                      loading={pendingRequestId === req.id}
                      disabled={pendingRequestId != null}
                    />
                    <Button
                      title="Accept"
                      onPress={() => onDecision(ride.id, req.id, "accept")}
                      loading={pendingRequestId === req.id}
                      disabled={pendingRequestId != null}
                    />
                  </View>
                ) : null}
              </View>
            ))
          )}
        </View>
      )}
    />
  );
}

function RidingList({ entries }) {
  if (entries.length === 0) {
    return (
      <EmptyState
        title="You haven't requested any rides yet"
        message="Browse rides and request a seat to see your requests here."
      />
    );
  }

  return (
    <FlatList
      data={entries}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.listContent}
      ItemSeparatorComponent={() => <View style={{ height: spacing.md }} />}
      renderItem={({ item: entry }) => (
        <View style={styles.card}>
          <Text style={styles.route}>
            {entry.ride.origin} → {entry.ride.destination}
          </Text>
          <Text style={styles.meta}>
            {formatDepartureTime(entry.ride.departure_time)} · {entry.ride.driver_name}
          </Text>
          <Text style={[styles.statusBadge, statusColor(entry.status)]}>{entry.status}</Text>
        </View>
      )}
    />
  );
}

function statusColor(status) {
  if (status === "accepted") return { color: colors.success };
  if (status === "declined") return { color: colors.error };
  return { color: colors.textSecondary };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
  },
  title: {
    fontSize: typography.size.title,
    fontWeight: typography.weight.bold,
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  tabRow: {
    flexDirection: "row",
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  tab: {
    flex: 1,
    borderRadius: radius.input,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: spacing.sm,
    alignItems: "center",
  },
  tabActive: {
    borderColor: colors.secondary,
    backgroundColor: colors.secondary,
  },
  tabLabel: {
    fontSize: typography.size.bodySmall,
    fontWeight: typography.weight.semibold,
    color: colors.textSecondary,
  },
  tabLabelActive: {
    color: colors.surface,
  },
  listContent: {
    paddingBottom: spacing.xl,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    gap: spacing.sm,
  },
  route: {
    fontSize: typography.size.body,
    fontWeight: typography.weight.semibold,
    color: colors.textPrimary,
  },
  meta: {
    fontSize: typography.size.bodySmall,
    color: colors.textSecondary,
  },
  emptyRequests: {
    fontSize: typography.size.bodySmall,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  requestRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: spacing.sm,
    marginTop: spacing.xs,
  },
  requestInfo: {
    gap: 2,
  },
  requestName: {
    fontSize: typography.size.bodySmall,
    fontWeight: typography.weight.semibold,
    color: colors.textPrimary,
  },
  requestStatus: {
    fontSize: typography.size.caption,
    color: colors.textSecondary,
  },
  requestActions: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  statusBadge: {
    fontSize: typography.size.bodySmall,
    fontWeight: typography.weight.semibold,
  },
});
