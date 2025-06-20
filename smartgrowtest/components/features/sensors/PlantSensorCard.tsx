// components/features/sensors/PlantSensorCard.tsx
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Card } from "../../ui/Card";
import { Badge } from "../../ui/Badge";
import { formatTimeAgo } from "../../../utils/dateUtils";

// Interface for processed sensor groups
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

type PlantSensorCardProps = {
  sensorGroup: ProcessedSensorGroup;
  onPress?: (group: ProcessedSensorGroup) => void;
  sensorType: string;
};

export function PlantSensorCard({
  sensorGroup,
  onPress,
  sensorType,
}: PlantSensorCardProps) {
  // Get sensor icon based on type
  const getSensorIcon = (): keyof typeof Ionicons.glyphMap => {
    switch (sensorType) {
      case "temperature":
        return "thermometer-outline";
      case "humidity":
        return "water-outline";
      case "light":
        return "sunny-outline";
      case "soilMoisture":
        return "nutrition-outline";
      case "airQuality":
        return "cloud-outline";
      default:
        return "hardware-chip-outline";
    }
  };

  // Get sensor color based on type
  const getSensorColor = (): string => {
    switch (sensorType) {
      case "temperature":
        return "#e74c3c";
      case "humidity":
        return "#3498db";
      case "light":
        return "#f39c12";
      case "soilMoisture":
        return "#8b4513";
      case "airQuality":
        return "#95a5a6";
      default:
        return "#666";
    }
  };

  // Get status color and text
  const getStatusInfo = () => {
    if (sensorGroup.critical) {
      return {
        color: "#ff4444",
        text: "Critical",
        backgroundColor: "#ffebee",
      };
    }
    return {
      color: "#4caf50",
      text: "Normal",
      backgroundColor: "#e8f5e9",
    };
  };

  const statusInfo = getStatusInfo();

  return (
    <TouchableOpacity
      onPress={() => onPress?.(sensorGroup)}
      activeOpacity={0.7}
    >
      <Card
        style={[
          styles.container,
          sensorGroup.critical && styles.criticalBorder,
        ]}
      >
        <View style={styles.content}>
          {/* Header with plant info */}
          <View style={styles.header}>
            <View style={styles.plantInfo}>
              <Text style={styles.plantIcon}>{sensorGroup.icon}</Text>
              <View style={styles.plantDetails}>
                <Text style={styles.plantName} numberOfLines={1}>
                  {sensorGroup.plantName}
                </Text>
                <Text style={styles.zoneText}>{sensorGroup.zone}</Text>
              </View>
            </View>

            {/* Status badge */}
            <Badge
              variant={sensorGroup.critical ? "error" : "success"}
              size="small"
            >
              {statusInfo.text}
            </Badge>
          </View>

          {/* Sensor reading */}
          <View style={styles.sensorReading}>
            <View style={styles.readingIcon}>
              <Ionicons
                name={getSensorIcon()}
                size={24}
                color={getSensorColor()}
              />
            </View>
            <View style={styles.readingDetails}>
              <Text
                style={[
                  styles.value,
                  sensorGroup.critical && styles.criticalValue,
                ]}
              >
                {sensorGroup.value}
              </Text>
              <Text style={styles.lastUpdated}>
                Updated {formatTimeAgo(sensorGroup.lastUpdated)}
              </Text>
            </View>
          </View>

          {/* Technical details */}
          <View style={styles.technicalDetails}>
            <View style={styles.techItem}>
              <Text style={styles.techLabel}>Sensor ID:</Text>
              <Text style={styles.techValue}>
                {sensorGroup.sensorId.slice(-8)}
              </Text>
            </View>
            {sensorGroup.esp32Id && (
              <View style={styles.techItem}>
                <Text style={styles.techLabel}>ESP32:</Text>
                <Text style={styles.techValue}>{sensorGroup.esp32Id}</Text>
              </View>
            )}
            {sensorGroup.pinId !== undefined && (
              <View style={styles.techItem}>
                <Text style={styles.techLabel}>Pin:</Text>
                <Text style={styles.techValue}>{sensorGroup.pinId}</Text>
              </View>
            )}
            {sensorGroup.boardNumber !== undefined && (
              <View style={styles.techItem}>
                <Text style={styles.techLabel}>Board:</Text>
                <Text style={styles.techValue}>{sensorGroup.boardNumber}</Text>
              </View>
            )}
          </View>

          {/* Warning for critical values */}
          {sensorGroup.critical && (
            <View style={styles.warningContainer}>
              <Ionicons name="warning" size={16} color="#ff4444" />
              <Text style={styles.warningText}>
                Requires immediate attention
              </Text>
            </View>
          )}
        </View>
      </Card>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 12,
  },
  criticalBorder: {
    borderLeftWidth: 4,
    borderLeftColor: "#ff4444",
  },
  content: {
    padding: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  plantInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  plantIcon: {
    fontSize: 32,
    marginRight: 12,
  },
  plantDetails: {
    flex: 1,
  },
  plantName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 2,
  },
  zoneText: {
    fontSize: 14,
    color: "#666",
  },
  sensorReading: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    backgroundColor: "#f8f9fa",
    borderRadius: 12,
    padding: 12,
  },
  readingIcon: {
    marginRight: 12,
  },
  readingDetails: {
    flex: 1,
  },
  value: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 2,
  },
  criticalValue: {
    color: "#ff4444",
  },
  lastUpdated: {
    fontSize: 12,
    color: "#999",
  },
  technicalDetails: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 8,
  },
  techItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  techLabel: {
    fontSize: 12,
    color: "#888",
    marginRight: 4,
  },
  techValue: {
    fontSize: 12,
    color: "#333",
    fontWeight: "500",
    fontFamily: "monospace",
  },
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
  },
});
