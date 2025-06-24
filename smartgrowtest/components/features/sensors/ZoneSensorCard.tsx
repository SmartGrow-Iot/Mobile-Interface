// components/features/sensors/ZoneSensorCard.tsx - Updated with soil moisture support
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Card } from "../../ui/Card";
import { Badge } from "../../ui/Badge";
import { formatTimeAgo } from "../../../utils/dateUtils";

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

type ZoneSensorCardProps = {
  zoneData: ProcessedZoneData;
  onPress?: (zone: ProcessedZoneData) => void;
  sensorType: string;
};

export function ZoneSensorCard({
  zoneData,
  onPress,
  sensorType,
}: ZoneSensorCardProps) {
  // Get sensor icon based on type
  const getSensorIcon = (): keyof typeof Ionicons.glyphMap => {
    switch (sensorType) {
      case "temperature":
        return "thermometer-outline";
      case "humidity":
        return "water-outline";
      case "light":
        return "sunny-outline";
      case "soil":
        return "nutrition-outline";
      case "airquality":
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
      case "soil":
        return "#8b4513";
      case "airquality":
        return "#95a5a6";
      default:
        return "#666";
    }
  };

  // Get status info
  const getStatusInfo = () => {
    if (zoneData.critical) {
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
    <TouchableOpacity onPress={() => onPress?.(zoneData)} activeOpacity={0.7}>
      <Card
        style={[styles.container, zoneData.critical && styles.criticalBorder]}
      >
        <View style={styles.content}>
          {/* Header with zone info */}
          <View style={styles.header}>
            <View style={styles.zoneInfo}>
              <Text style={styles.zoneIcon}>{zoneData.icon}</Text>
              <View style={styles.zoneDetails}>
                <Text style={styles.zoneName} numberOfLines={1}>
                  {zoneData.zoneName}
                </Text>
                <Text style={styles.sensorTypeText}>
                  {sensorType.charAt(0).toUpperCase() + sensorType.slice(1)}{" "}
                  Sensor
                </Text>
              </View>
            </View>

            {/* Status badge */}
            <Badge
              variant={zoneData.critical ? "error" : "success"}
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
                  zoneData.critical && styles.criticalValue,
                ]}
              >
                {zoneData.value}
              </Text>
              <Text style={styles.lastUpdated}>
                Updated {formatTimeAgo(zoneData.lastUpdated)}
              </Text>
            </View>
          </View>

          {/* Soil moisture details (only for soil sensors) */}
          {sensorType === "soil" &&
            zoneData.soilMoistureDetails &&
            zoneData.soilMoistureDetails.length > 0 && (
              <View style={styles.soilDetailsContainer}>
                <Text style={styles.soilDetailsTitle}>Moisture by Pin:</Text>
                <View style={styles.soilPinGrid}>
                  {zoneData.soilMoistureDetails.map((detail) => (
                    <View
                      key={detail.pin}
                      style={[
                        styles.soilPinItem,
                        detail.critical && styles.soilPinCritical,
                      ]}
                    >
                      <Text style={styles.soilPinLabel}>Pin {detail.pin}</Text>
                      <Text
                        style={[
                          styles.soilPinValue,
                          detail.critical && styles.soilPinValueCritical,
                        ]}
                      >
                        {detail.moisture}%
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            )}

          {/* Warning for critical values */}
          {zoneData.critical && (
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
  zoneInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  zoneIcon: {
    fontSize: 32,
    marginRight: 12,
  },
  zoneDetails: {
    flex: 1,
  },
  zoneName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 2,
  },
  sensorTypeText: {
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
  soilDetailsContainer: {
    marginBottom: 12,
  },
  soilDetailsTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  soilPinGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  soilPinItem: {
    backgroundColor: "#f0f8ff",
    borderRadius: 8,
    padding: 8,
    minWidth: "22%",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e1f5fe",
  },
  soilPinCritical: {
    backgroundColor: "#ffebee",
    borderColor: "#ffcdd2",
  },
  soilPinLabel: {
    fontSize: 10,
    color: "#666",
    marginBottom: 2,
  },
  soilPinValue: {
    fontSize: 12,
    fontWeight: "600",
    color: "#1976d2",
  },
  soilPinValueCritical: {
    color: "#d32f2f",
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
