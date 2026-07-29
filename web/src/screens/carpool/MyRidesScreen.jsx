import { useCallback, useEffect, useState } from "react";
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
      window.alert("Couldn't update request. Please try again in a moment.");
    } finally {
      setPendingRequestId(null);
    }
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>My Rides</h1>

      <div style={styles.tabRow}>
        {TABS.map((tab) => {
          const active = tab.key === activeTab;
          return (
            <button
              key={tab.key}
              type="button"
              className="cc-pressable"
              onClick={() => setActiveTab(tab.key)}
              style={{ ...styles.tab, ...(active ? styles.tabActive : null) }}
            >
              <span style={{ ...styles.tabLabel, ...(active ? styles.tabLabelActive : null) }}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>

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
    </div>
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
    <div style={styles.list}>
      {rides.map((ride) => (
        <div key={ride.id} style={styles.card}>
          <div style={styles.route}>
            {ride.origin} → {ride.destination}
          </div>
          <div style={styles.meta}>
            {formatDepartureTime(ride.departure_time)} · {ride.seats_available} of{" "}
            {ride.seats_total} seats left
          </div>

          {ride.requests.length === 0 ? (
            <div style={styles.emptyRequests}>No requests yet.</div>
          ) : (
            ride.requests.map((req) => (
              <div key={req.id} style={styles.requestRow}>
                <div style={styles.requestInfo}>
                  <div style={styles.requestName}>{req.rider_name}</div>
                  <div style={styles.requestStatus}>{req.status}</div>
                </div>
                {req.status === "pending" ? (
                  <div style={styles.requestActions}>
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
                  </div>
                ) : null}
              </div>
            ))
          )}
        </div>
      ))}
    </div>
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
    <div style={styles.list}>
      {entries.map((entry) => (
        <div key={entry.id} style={styles.card}>
          <div style={styles.route}>
            {entry.ride.origin} → {entry.ride.destination}
          </div>
          <div style={styles.meta}>
            {formatDepartureTime(entry.ride.departure_time)} · {entry.ride.driver_name}
          </div>
          <div style={{ ...styles.statusBadge, ...statusColor(entry.status) }}>
            {entry.status}
          </div>
        </div>
      ))}
    </div>
  );
}

function statusColor(status) {
  if (status === "accepted") return { color: colors.success };
  if (status === "declined") return { color: colors.error };
  return { color: colors.textSecondary };
}

const styles = {
  container: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    backgroundColor: colors.background,
    paddingLeft: spacing.lg,
    paddingRight: spacing.lg,
    paddingTop: spacing.lg,
    overflowY: "auto",
  },
  title: {
    fontSize: typography.size.title,
    fontWeight: typography.weight.bold,
    color: colors.textPrimary,
    margin: 0,
    marginBottom: spacing.md,
  },
  tabRow: {
    display: "flex",
    flexDirection: "row",
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  tab: {
    flex: 1,
    borderRadius: radius.input,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: colors.border,
    backgroundColor: "transparent",
    paddingTop: spacing.sm,
    paddingBottom: spacing.sm,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
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
  list: {
    display: "flex",
    flexDirection: "column",
    gap: spacing.md,
    paddingBottom: spacing.xl,
  },
  card: {
    display: "flex",
    flexDirection: "column",
    backgroundColor: colors.surface,
    borderRadius: radius.card,
    borderWidth: 1,
    borderStyle: "solid",
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
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopStyle: "solid",
    borderTopColor: colors.border,
    paddingTop: spacing.sm,
    marginTop: spacing.xs,
  },
  requestInfo: {
    display: "flex",
    flexDirection: "column",
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
    display: "flex",
    flexDirection: "row",
    gap: spacing.sm,
  },
  statusBadge: {
    fontSize: typography.size.bodySmall,
    fontWeight: typography.weight.semibold,
  },
};
