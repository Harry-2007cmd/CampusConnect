import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { colors, spacing, typography } from "../../theme/tokens";
import FilterBar from "../../components/carpool/FilterBar";
import RideCard from "../../components/carpool/RideCard";
import Button from "../../components/common/Button";
import Loader from "../../components/common/Loader";
import EmptyState from "../../components/common/EmptyState";
import useRides from "../../hooks/useRides";

const DEFAULT_FILTERS = {
  origin: "",
  destination: "",
  maxPrice: null,
  genderPref: "any",
};

export default function BrowseRidesScreen() {
  const navigate = useNavigate();
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const { rides, status, reload } = useRides(filters);

  return (
    <div style={styles.container}>
      <div style={styles.headerRow}>
        <h1 style={styles.headerTitle}>Browse Rides</h1>
        <div style={styles.headerActions}>
          <Button title="Feed" variant="ghost" onPress={() => navigate("/feed")} />
          <Button title="My Rides" variant="ghost" onPress={() => navigate("/my-rides")} />
          <Button
            title="Offer a ride"
            variant="secondary"
            onPress={() => navigate("/offer")}
          />
        </div>
      </div>

      <div style={styles.filterWrap}>
        <FilterBar filters={filters} onChange={setFilters} />
      </div>

      {status === "loading" ? (
        <Loader label="Finding rides..." />
      ) : status === "error" ? (
        <EmptyState
          tone="error"
          title="Couldn't load rides"
          message="Something went wrong on our end. Please try again."
          actionLabel="Retry"
          onAction={reload}
        />
      ) : rides.length === 0 ? (
        <EmptyState
          title="No rides match your filters yet"
          message="Try widening your price range or clearing the destination filter."
          actionLabel="Clear filters"
          onAction={() => setFilters(DEFAULT_FILTERS)}
        />
      ) : (
        <div style={styles.list}>
          {rides.map((item) => (
            <RideCard
              key={item.id}
              ride={item}
              onPress={() => navigate(`/rides/${item.id}`)}
            />
          ))}
        </div>
      )}
    </div>
  );
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
  headerRow: {
    display: "flex",
    flexDirection: "column",
    marginBottom: spacing.md,
    gap: spacing.sm,
  },
  headerTitle: {
    fontSize: typography.size.title,
    fontWeight: typography.weight.bold,
    color: colors.textPrimary,
    margin: 0,
  },
  headerActions: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
  filterWrap: {
    marginBottom: spacing.sm,
  },
  list: {
    display: "flex",
    flexDirection: "column",
    gap: spacing.md,
    paddingBottom: spacing.xl,
  },
};
