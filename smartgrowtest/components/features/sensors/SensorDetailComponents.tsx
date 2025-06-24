// components/features/sensors/SensorDetailComponents.tsx
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Card } from "../../ui/Card";
import { Badge } from "../../ui/Badge";
import {
  EnvironmentalDataResponse,
  SoilMoistureData,
  SensorType,
  sensorConfigs,
} from "../../../types/Sensor";
import { sensorService } from "../../../services/sensorService";

// Environmental Data Card Component
export const EnvironmentalDataCard = ({
  data,
  sensorType,
}: {
  data: EnvironmentalDataResponse;
  sensorType: SensorType;
}) => {
  const config = sensorConfigs[sensorType];
  const value = data.zoneSensors[sensorType as keyof typeof data.zoneSensors];
  const critical = sensorService.isCriticalValue(value, sensorType);

  return (
    <Card style={[styles.envCard, critical && styles.criticalBorder]}>
      <View style={styles.envHeader}>
        <View style={styles.envInfo}>
          <Text style={styles.envIcon}>{config.icon}</Text>
          <View style={styles.envDetails}>
            <Text style={styles.envTitle}>Environmental Data</Text>
            <Text style={styles.envSubtitle}>
              Latest reading from{" "}
              {sensorService.getZoneDisplayName(data.zoneId)}
            </Text>
          </View>
        </View>
        <Badge variant={critical ? "error" : "success"} size="small">
          {critical ? "Critical" : "Normal"}
        </Badge>
      </View>

      <View style={styles.envReading}>
        <View style={styles.readingIcon}>
          <Ionicons
            name={sensorService.getSensorIconName(sensorType) as any}
            size={32}
            color={sensorService.getSensorColor(sensorType)}
          />
        </View>
        <View style={styles.readingDetails}>
          <Text style={[styles.envValue, critical && styles.criticalValue]}>
            {value}
            {config.unit}
          </Text>
          <Text style={styles.envTimestamp}>
            Updated {new Date(data.timestamp).toLocaleTimeString()}
          </Text>
        </View>
      </View>

      {critical && (
        <View style={styles.warningContainer}>
          <Ionicons name="warning" size={16} color="#ff4444" />
          <Text style={styles.warningText}>
            Value outside optimal range ({config.thresholds.min}-
            {config.thresholds.max}
            {config.unit})
          </Text>
        </View>
      )}
    </Card>
  );
};

// Soil Moisture Plant Card Component
export const SoilMoisturePlantCard = ({
  plantData,
}: {
  plantData: SoilMoistureData;
}) => {
  const hasData = plantData.moisture > 0;

  return (
    <Card
      style={[styles.plantCard, plantData.critical && styles.criticalBorder]}
    >
      <View style={styles.plantHeader}>
        <View style={styles.plantInfo}>
          <Text style={styles.plantIcon}>{plantData.icon}</Text>
          <View style={styles.plantDetails}>
            <Text style={styles.plantName}>{plantData.plantName}</Text>
            <Text style={styles.plantZone}>
              {sensorService.getZoneDisplayName(plantData.zone)} • Pin{" "}
              {plantData.pin}
            </Text>
          </View>
        </View>
        <Badge
          variant={
            !hasData ? "warning" : plantData.critical ? "error" : "success"
          }
          size="small"
        >
          {!hasData ? "No Data" : plantData.critical ? "Critical" : "Normal"}
        </Badge>
      </View>

      <View style={styles.moistureReading}>
        <View style={styles.readingIcon}>
          <Ionicons name="water-outline" size={24} color="#8b4513" />
        </View>
        <View style={styles.readingDetails}>
          <Text
            style={[
              styles.moistureValue,
              plantData.critical && styles.criticalValue,
              !hasData && styles.noDataValue,
            ]}
          >
            {hasData ? `${plantData.moisture}%` : "No Data"}
          </Text>
          <Text style={styles.moistureThresholds}>
            Optimal: {plantData.thresholds.min}% - {plantData.thresholds.max}%
          </Text>
        </View>
      </View>

      <Text style={styles.plantTimestamp}>
        {hasData
          ? `Updated ${plantData.timestamp.toLocaleTimeString()}`
          : "No recent data"}
      </Text>

      {!hasData && (
        <View style={styles.warningContainer}>
          <Ionicons name="information-circle" size={16} color="#f39c12" />
          <Text style={[styles.warningText, { color: "#f39c12" }]}>
            No sensor data available for this pin
          </Text>
        </View>
      )}

      {hasData && plantData.critical && (
        <View style={styles.warningContainer}>
          <Ionicons name="warning" size={16} color="#ff4444" />
          <Text style={styles.warningText}>
            Moisture level outside optimal range ({plantData.thresholds.min}% -{" "}
            {plantData.thresholds.max}%)
          </Text>
        </View>
      )}
    </Card>
  );
};

// Zone Selection Component
export const ZoneSelector = ({
  selectedZone,
  onZoneSelect,
  zones,
}: {
  selectedZone: string | null;
  onZoneSelect: (zone: string) => void;
  zones: string[];
}) => {
  return (
    <View style={styles.zoneSelectorContainer}>
      <Text style={styles.zoneSelectorTitle}>Select Zone</Text>
      <View style={styles.zoneButtons}>
        {zones.map((zone) => (
          <TouchableOpacity
            key={zone}
            style={[
              styles.zoneButton,
              selectedZone === zone && styles.selectedZoneButton,
            ]}
            onPress={() => onZoneSelect(zone)}
          >
            <Text
              style={[
                styles.zoneButtonText,
                selectedZone === zone && styles.selectedZoneButtonText,
              ]}
            >
              {sensorService.getZoneDisplayName(zone)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

// Sensor Header Component
export const SensorHeader = ({
  sensorConfig,
}: {
  sensorConfig: { name: string; icon: string; description: string };
}) => {
  return (
    <Card style={styles.headerCard}>
      <View style={styles.headerContent}>
        <Text style={styles.sensorIcon}>{sensorConfig.icon}</Text>
        <View style={styles.headerText}>
          <Text style={styles.sensorName}>{sensorConfig.name}</Text>
          <Text style={styles.sensorDescription}>
            {sensorConfig.description}
          </Text>
        </View>
      </View>
    </Card>
  );
};

// Summary Statistics Component
export const SummaryStats = ({
  sensorType,
  environmentalData,
  soilMoistureData,
  availableZones,
  sensorConfig,
}: {
  sensorType: SensorType;
  environmentalData?: EnvironmentalDataResponse | null;
  soilMoistureData?: SoilMoistureData[];
  availableZones?: string[];
  sensorConfig: any;
}) => {
  return (
    <Card style={styles.statsCard}>
      <Text style={styles.statsTitle}>Summary</Text>
      <View style={styles.statsContainer}>
        {sensorType === "soil" && soilMoistureData ? (
          <>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{soilMoistureData.length}</Text>
              <Text style={styles.statLabel}>Total Plants</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>
                {availableZones?.length || 0}
              </Text>
              <Text style={styles.statLabel}>Active Zones</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>
                {soilMoistureData.filter((p) => p.critical).length}
              </Text>
              <Text style={styles.statLabel}>Critical</Text>
            </View>
          </>
        ) : environmentalData ? (
          <>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>
                {sensorService.getZoneDisplayName(environmentalData.zoneId)}
              </Text>
              <Text style={styles.statLabel}>Data Source</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>
                {environmentalData &&
                sensorService.isCriticalValue(
                  environmentalData.zoneSensors[
                    sensorType as keyof typeof environmentalData.zoneSensors
                  ],
                  sensorType
                )
                  ? "YES"
                  : "NO"}
              </Text>
              <Text style={styles.statLabel}>Critical</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>
                {
                  environmentalData?.zoneSensors[
                    sensorType as keyof typeof environmentalData.zoneSensors
                  ]
                }
                {sensorConfig.unit}
              </Text>
              <Text style={styles.statLabel}>Current</Text>
            </View>
          </>
        ) : null}
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  // Header styles
  headerCard: {
    marginBottom: 20,
    padding: 20,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  sensorIcon: {
    fontSize: 48,
    marginRight: 16,
  },
  headerText: {
    flex: 1,
  },
  sensorName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#174d3c",
    marginBottom: 4,
  },
  sensorDescription: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
  },

  // Environmental data styles
  envCard: {
    marginBottom: 12,
  },
  criticalBorder: {
    borderLeftWidth: 4,
    borderLeftColor: "#ff4444",
  },
  envHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  envInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  envIcon: {
    fontSize: 32,
    marginRight: 12,
  },
  envDetails: {
    flex: 1,
  },
  envTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 2,
  },
  envSubtitle: {
    fontSize: 14,
    color: "#666",
  },
  envReading: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  readingIcon: {
    marginRight: 16,
  },
  readingDetails: {
    flex: 1,
  },
  envValue: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  envTimestamp: {
    fontSize: 12,
    color: "#999",
  },
  criticalValue: {
    color: "#ff4444",
  },
  noDataValue: {
    color: "#f39c12",
    fontStyle: "italic",
  },

  // Zone selector styles
  zoneSelectorContainer: {
    marginBottom: 20,
  },
  zoneSelectorTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 12,
  },
  zoneButtons: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  zoneButton: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  selectedZoneButton: {
    backgroundColor: "#174d3c",
    borderColor: "#174d3c",
  },
  zoneButtonText: {
    fontSize: 14,
    color: "#666",
    fontWeight: "500",
  },
  selectedZoneButtonText: {
    color: "#fff",
  },

  // Plant card styles
  plantCard: {
    marginBottom: 12,
  },
  plantHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  plantInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  plantIcon: {
    fontSize: 28,
    marginRight: 12,
  },
  plantDetails: {
    flex: 1,
  },
  plantName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 2,
  },
  plantZone: {
    fontSize: 14,
    color: "#666",
  },
  moistureReading: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f8ff",
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  moistureValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 2,
  },
  moistureThresholds: {
    fontSize: 12,
    color: "#666",
    fontWeight: "500",
  },
  plantTimestamp: {
    fontSize: 12,
    color: "#999",
    textAlign: "center",
  },

  // Warning styles
  warningContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffebee",
    borderRadius: 8,
    padding: 8,
    marginTop: 8,
  },
  warningText: {
    fontSize: 12,
    color: "#ff4444",
    fontWeight: "500",
    marginLeft: 6,
    flex: 1,
  },

  // Stats styles
  statsCard: {
    marginTop: 16,
    marginBottom: 16,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#174d3c",
    marginBottom: 16,
    textAlign: "center",
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  statItem: {
    alignItems: "center",
  },
  statValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#174d3c",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: "#666",
    fontWeight: "500",
  },
});
