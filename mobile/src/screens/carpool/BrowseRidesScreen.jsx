import React, { useState } from "react";
import { View, FlatList, StyleSheet } from "react-native";
import { colors, spacing } from "../../theme/tokens";
import FilterBar from "../../components/carpool/FilterBar";
import RideCard from "../../components/carpool/RideCard";
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
  filterWrap: {
    marginBottom: spacing.sm,
  },
  listContent: {
    paddingBottom: spacing.xl,
  },
});
