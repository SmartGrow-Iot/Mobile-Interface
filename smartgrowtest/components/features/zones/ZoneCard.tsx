// components/features/zones/ZoneCard.tsx - Fixed with all required styles
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Zone } from "../../../types/Zone";
import { Badge } from "../../ui/Badge";
import { Card } from "../../ui/Card";

type ZoneCardProps = {
  zone: Zone;
  onPress?: (zone: Zone) => void;
  showStats?: boolean;
  size?: "small" | "medium" | "large";
};

export function ZoneCard({
  zone,
  onPress,
  showStats = true,
  size = "medium",
}: ZoneCardProps) {
  const getStatusVariant = (status: string) => {
    switch (status) {
      case "Optimal":
        return "success";
      case "Warning":
        return "warning";
      case "Critical":
        return "error";
      default:
        return "default";
    }
  };

  const getZoneIcon = (zoneId: string) => {
    // Return appropriate icon based on zone ID
    switch (zoneId) {
      case "zone1":
        return "🌶️"; // Chili zone
      case "zone2":
        return "🌶️"; // Chili zone
      case "zone3":
        return "🍆"; // Eggplant zone
      case "zone4":
        return "🍆"; // Eggplant zone
      default:
        return "🌱"; // Default plant icon
    }
  };

  const getZoneColor = (status: string) => {
    switch (status) {
      case "Optimal":
        return "#e8f5e9"; // Light green
      case "Warning":
        return "#fff3e0"; // Light orange
      case "Critical":
        return "#ffebee"; // Light red
      default:
        return "#f5f5f5"; // Light gray
    }
  };

  return (
    <TouchableOpacity
      style={styles.cardTouchable}
      onPress={() => onPress?.(zone)}
      activeOpacity={0.7}
    >
      <Card
        variant="elevated"
        style={[
          styles.cardContent,
          { backgroundColor: getZoneColor(zone.status) },
        ]}
      >
        <View style={styles.zoneHeader}>
          <View style={styles.zoneInfo}>
            <Text style={styles.zoneIcon}>{getZoneIcon(zone.id)}</Text>
            <View style={styles.zoneDetails}>
              <View style={styles.zoneTitleRow}>
                <Text style={[styles.zoneName, styles[`${size}Name`]]}>
                  {zone.name}
                </Text>
                <Badge variant={getStatusVariant(zone.status)} size="small">
                  {zone.status}
                </Badge>
              </View>
              <Text style={styles.plantCount}>
                {zone.plantCount} plants • {zone.plantType}
              </Text>
            </View>
          </View>
        </View>

        {showStats && (
          <View style={styles.zoneStats}>
            <View style={styles.statsGrid}>
              <View style={styles.statItem}>
                <Ionicons name="water-outline" size={14} color="#45aaf2" />
                <Text style={styles.statValue}>{zone.averageWaterLevel}%</Text>
                <Text style={styles.statLabel}>Water</Text>
              </View>

              <View style={styles.statItem}>
                <Ionicons name="sunny-outline" size={14} color="#f7b731" />
                <Text style={styles.statValue}>{zone.averageLightLevel}%</Text>
                <Text style={styles.statLabel}>Light</Text>
              </View>

              {zone.temperature && (
                <View style={styles.statItem}>
                  <Ionicons
                    name="thermometer-outline"
                    size={14}
                    color="#e74c3c"
                  />
                  <Text style={styles.statValue}>{zone.temperature}°C</Text>
                  <Text style={styles.statLabel}>Temp</Text>
                </View>
              )}

              {zone.humidity && (
                <View style={styles.statItem}>
                  <Ionicons name="water-outline" size={14} color="#5dade2" />
                  <Text style={styles.statValue}>{zone.humidity}%</Text>
                  <Text style={styles.statLabel}>Humidity</Text>
                </View>
              )}
            </View>
          </View>
        )}

        {zone.lastUpdated && (
          <Text style={styles.lastUpdated}>
            Updated {zone.lastUpdated.toLocaleTimeString()}
          </Text>
        )}

        {/* Action indicator */}
        <View style={styles.actionIndicator}>
          <Ionicons name="chevron-forward" size={16} color="#999" />
        </View>
      </Card>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  cardTouchable: {
    flex: 1,
  },
  smallCard: {
    width: "45%",
    marginBottom: 12,
  },
  mediumCard: {
    width: "48%",
    marginBottom: 16,
  },
  largeCard: {
    width: "100%",
    marginBottom: 16,
  },
  cardContent: {
    position: "relative",
    minHeight: 120,
    paddingBottom: 8,
  },
  zoneHeader: {
    marginBottom: 8,
  },
  zoneInfo: {
    flexDirection: "row",
    alignItems: "flex-start",
    flex: 1,
  },
  zoneIcon: {
    fontSize: 24,
    marginRight: 8,
    marginTop: 2,
  },
  zoneDetails: {
    flex: 1,
    minWidth: 0,
  },
  zoneTitleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 2,
  },
  zoneName: {
    fontWeight: "bold",
    color: "#333",
    flex: 1,
    marginRight: 4,
  },
  smallName: {
    fontSize: 14,
  },
  mediumName: {
    fontSize: 15,
  },
  largeName: {
    fontSize: 16,
  },
  plantCount: {
    fontSize: 11,
    color: "#666",
    fontWeight: "500",
  },
  zoneStats: {
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.3)",
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  statItem: {
    alignItems: "center",
    width: "48%",
    marginBottom: 4,
  },
  statValue: {
    fontSize: 12,
    fontWeight: "600",
    color: "#333",
    marginTop: 2,
  },
  statLabel: {
    fontSize: 9,
    color: "#666",
    marginTop: 1,
  },
  lastUpdated: {
    fontSize: 9,
    color: "#999",
    textAlign: "center",
    marginTop: 4,
  },
  actionIndicator: {
    position: "absolute",
    top: 8,
    right: 8,
    opacity: 0.5,
  },
});
