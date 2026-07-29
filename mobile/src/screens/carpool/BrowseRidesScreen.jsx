import React, { useState } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
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

export default function BrowseRidesScreen({ navigation }) {
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const { rides, status, reload } = useRides(filters);

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.headerTitle}>Browse Rides</Text>
        <View style={styles.headerActions}>
          <Button title="Feed" variant="ghost" onPress={() => navigation.navigate("Feed")} />
          <Button title="My Rides" variant="ghost" onPress={() => navigation.navigate("MyRides")} />
          <Button title="Offer a ride" variant="secondary" onPress={() => navigation.navigate("OfferRide")} />
        </View>
      </View>

      <View style={styles.filterWrap}>
        <FilterBar filters={filters} onChange={setFilters} />
      </View>

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
        <FlatList
          data={rides}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <RideCard
              ride={item}
              onPress={() => navigation.navigate("RideDetail", { rideId: item.id })}
            />
          )}
          ItemSeparatorComponent={() => <View style={{ height: spacing.md }} />}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
  },
  headerRow: {
    marginBottom: spacing.md,
    gap: spacing.sm,
  },
  headerTitle: {
    fontSize: typography.size.title,
    fontWeight: typography.weight.bold,
    color: colors.textPrimary,
  },
  headerActions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
  filterWrap: {
    marginBottom: spacing.sm,
  },
  listContent: {
    paddingBottom: spacing.xl,
  },
});
