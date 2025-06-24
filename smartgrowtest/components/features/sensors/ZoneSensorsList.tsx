// components/features/sensors/ZoneSensorsList.tsx
import React from "react";
import { View, Text, StyleSheet, FlatList, RefreshControl } from "react-native";
import { ZoneSensorCard } from "./ZoneSensorCard";
import { EmptyState } from "../../ui/EmptyState";

// Interface for processed zone data
interface ProcessedZoneData {
  id: string;
  zoneId: string;
  zoneName: string;
  sensorType: string;
  value: string;
  rawValue: number;
  critical: boolean;
  icon: string;
  lastUpdated: Date;
  soilMoistureDetails?: Array<{
    pin: number;
    moisture: number;
    critical: boolean;
  }>;
}

type ZoneSensorsListProps = {
  zoneData: ProcessedZoneData[];
  onZonePress?: (zone: ProcessedZoneData) => void;
  sensorType: string;
  title?: string;
  emptyStateMessage?: string;
  refreshControl?: React.ReactElement<any>;
};

export function ZoneSensorsList({
  zoneData,
  onZonePress,
  sensorType,
  title,
  emptyStateMessage,
  refreshControl,
}: ZoneSensorsListProps) {
  if (zoneData.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <EmptyState
          icon="hardware-chip-outline"
          title="No Sensor Data"
          subtitle={
            emptyStateMessage ||
            `No ${sensorType} sensor data found or no recent data available`
          }
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {title && <Text style={styles.title}>{title}</Text>}

      {/* Summary info */}
      <View style={styles.summaryContainer}>
        <Text style={styles.summaryText}>
          {zoneData.length} zone{zoneData.length !== 1 ? "s" : ""} monitored
        </Text>
        {zoneData.some((z) => z.critical) && (
          <Text style={styles.criticalSummary}>
            {zoneData.filter((z) => z.critical).length} critical alert
            {zoneData.filter((z) => z.critical).length !== 1 ? "s" : ""}
          </Text>
        )}
      </View>

      <FlatList
        data={zoneData}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ZoneSensorCard
            zoneData={item}
            onPress={onZonePress}
            sensorType={sensorType}
          />
        )}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        refreshControl={refreshControl}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#174d3c",
    marginBottom: 16,
    textAlign: "center",
  },
  summaryContainer: {
    backgroundColor: "#f8f9fa",
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  summaryText: {
    fontSize: 14,
    color: "#666",
    fontWeight: "500",
  },
  criticalSummary: {
    fontSize: 14,
    color: "#ff4444",
    fontWeight: "600",
  },
  listContent: {
    paddingBottom: 20,
  },
});
