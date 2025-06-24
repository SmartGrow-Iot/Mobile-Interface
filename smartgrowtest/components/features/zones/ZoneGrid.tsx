// components/features/zones/ZoneGrid.tsx - Updated for better 4-zone display
import React from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import { Zone } from "../../../types/Zone";
import { ZoneCard } from "./ZoneCard";

type ZoneGridProps = {
  zones: Zone[];
  onZonePress?: (zone: Zone) => void;
  numColumns?: number;
  cardSize?: "small" | "medium" | "large";
  showStats?: boolean;
  title?: string;
};

export function ZoneGrid({
  zones,
  onZonePress,
  numColumns = 2,
  cardSize = "medium",
  showStats = true,
  title = "All Zones",
}: ZoneGridProps) {
  return (
    <View style={styles.container}>
      {/* Section Title */}
      <Text style={styles.sectionTitle}>{title}</Text>

      {/* Zone Statistics Summary */}
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{zones.length}</Text>
          <Text style={styles.statLabel}>Total Zones</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>
            {zones.filter((z) => z.status === "Optimal").length}
          </Text>
          <Text style={styles.statLabel}>Optimal</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>
            {zones.filter((z) => z.status === "Warning").length}
          </Text>
          <Text style={styles.statLabel}>Warning</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>
            {zones.filter((z) => z.status === "Critical").length}
          </Text>
          <Text style={styles.statLabel}>Critical</Text>
        </View>
      </View>

      {/* Zones Grid */}
      <View style={styles.zonesContainer}>
        {zones.map((zone, index) => (
          <View
            key={zone.id}
            style={[
              styles.zoneWrapper,
              numColumns === 2 && { width: "48%" },
              numColumns === 1 && { width: "100%" },
            ]}
          >
            <ZoneCard
              zone={zone}
              onPress={onZonePress}
              size={cardSize}
              showStats={showStats}
            />
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#174d3c",
    marginBottom: 16,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  statItem: {
    alignItems: "center",
  },
  statValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#174d3c",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: "#666",
    fontWeight: "500",
  },
  gridContainer: {
    paddingBottom: 16,
  },
  zonesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  zoneWrapper: {
    marginBottom: 16,
  },
  row: {
    justifyContent: "space-between",
  },
});
