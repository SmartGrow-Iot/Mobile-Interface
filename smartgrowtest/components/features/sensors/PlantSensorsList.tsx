// components/features/sensors/PlantSensorsList.tsx
import React from "react";
import { View, Text, StyleSheet, FlatList, RefreshControl } from "react-native";
import { PlantSensorCard } from "./PlantSensorCard";
import { EmptyState } from "../../ui/EmptyState";

// Interface for processed sensor groups (from sensor detail page)
interface ProcessedSensorGroup {
  id: string;
  plantId: string;
  plantName: string;
  sensorId: string;
  zone: string;
  value: string;
  rawValue: number;
  critical: boolean;
  icon: string;
  lastUpdated: Date;
  esp32Id?: string;
  pinId?: number;
  boardNumber?: number;
}

type PlantSensorsListProps = {
  sensorGroups: ProcessedSensorGroup[];
  onGroupPress?: (group: ProcessedSensorGroup) => void;
  sensorType: string;
  title?: string;
  emptyStateMessage?: string;
  refreshControl?: React.ReactElement<any>;
};

export function PlantSensorsList({
  sensorGroups,
  onGroupPress,
  sensorType,
  title,
  emptyStateMessage,
  refreshControl,
}: PlantSensorsListProps) {
  if (sensorGroups.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <EmptyState
          icon="hardware-chip-outline"
          title="No Sensor Data"
          subtitle={
            emptyStateMessage ||
            `No ${sensorType} sensors found or no recent data available`
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
          {sensorGroups.length} plant{sensorGroups.length !== 1 ? "s" : ""}{" "}
          monitored
        </Text>
        {sensorGroups.some((g) => g.critical) && (
          <Text style={styles.criticalSummary}>
            {sensorGroups.filter((g) => g.critical).length} critical alert
            {sensorGroups.filter((g) => g.critical).length !== 1 ? "s" : ""}
          </Text>
        )}
      </View>

      <FlatList
        data={sensorGroups}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <PlantSensorCard
            sensorGroup={item}
            onPress={onGroupPress}
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
