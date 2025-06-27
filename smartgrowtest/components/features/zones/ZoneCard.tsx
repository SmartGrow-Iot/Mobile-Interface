// components/features/zones/ZoneCard.tsx - Simplified for API data
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Zone, ZoneHelpers } from "../../../types/Zone";
import { Badge } from "../../ui/Badge";
import { Card } from "../../ui/Card";

type ZoneCardProps = {
  zone: Zone;
  onPress?: (zone: Zone) => void;
  size?: "small" | "medium" | "large";
};

export function ZoneCard({ zone, onPress, size = "medium" }: ZoneCardProps) {
  const getStatusVariant = (status: string) => {
    switch (status) {
      case "optimal":
        return "success";
      case "warning":
        return "warning";
      case "critical":
        return "error";
      default:
        return "default";
    }
  };

  const getZoneColor = (status: string) => {
    switch (status) {
      case "optimal":
        return "#e8f5e9"; // Light green
      case "warning":
        return "#fff3e0"; // Light orange
      case "critical":
        return "#ffebee"; // Light red
      default:
        return "#f5f5f5"; // Light gray
    }
  };

  const zoneIcon = ZoneHelpers.getPlantTypeIcon(zone.plants);

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
            <Text style={styles.zoneIcon}>{zoneIcon}</Text>
            <View style={styles.zoneDetails}>
              <View style={styles.zoneTitleRow}>
                <Text style={[styles.zoneName, styles[`${size}Name`]]}>
                  {zone.name}
                </Text>
                <Badge variant={getStatusVariant(zone.status)} size="small">
                  {zone.status.charAt(0).toUpperCase() + zone.status.slice(1)}
                </Badge>
              </View>
              <Text style={styles.plantCount}>
                {zone.plantCount} plant{zone.plantCount !== 1 ? "s" : ""}
              </Text>
            </View>
          </View>
        </View>

        {/* Basic zone info */}
        <View style={styles.zoneStats}>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Ionicons name="leaf-outline" size={14} color="#4caf50" />
              <Text style={styles.statValue}>{zone.plantCount}</Text>
              <Text style={styles.statLabel}>Plants</Text>
            </View>

            <View style={styles.statItem}>
              <Ionicons
                name="checkmark-circle-outline"
                size={14}
                color="#2ecc71"
              />
              <Text style={styles.statValue}>
                {zone.plants.filter((p) => p.status === "optimal").length}
              </Text>
              <Text style={styles.statLabel}>Healthy</Text>
            </View>

            <View style={styles.statItem}>
              <Ionicons name="warning-outline" size={14} color="#f39c12" />
              <Text style={styles.statValue}>
                {zone.plants.filter((p) => p.status === "warning").length}
              </Text>
              <Text style={styles.statLabel}>Warning</Text>
            </View>

            <View style={styles.statItem}>
              <Ionicons name="alert-circle-outline" size={14} color="#e74c3c" />
              <Text style={styles.statValue}>
                {zone.plants.filter((p) => p.status === "critical").length}
              </Text>
              <Text style={styles.statLabel}>Critical</Text>
            </View>
          </View>
        </View>

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
    justifyContent: "space-between",
  },
  statItem: {
    alignItems: "center",
    width: "23%",
    marginBottom: 4,
  },
  statValue: {
    fontSize: 12,
    fontWeight: "600",
    color: "#333",
    marginTop: 2,
  },
  statLabel: {
    fontSize: 8,
    color: "#666",
    marginTop: 1,
  },
  actionIndicator: {
    position: "absolute",
    top: 8,
    right: 8,
    opacity: 0.5,
  },
});
