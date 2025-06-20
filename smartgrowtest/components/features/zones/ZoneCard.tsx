// components/features/zones/ZoneCard.tsx
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Zone } from "../../../types/Zone";
import { Badge } from "../../ui/Badge";
import { StatItem } from "../../ui/StatItem";
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

  const cardStyle = {
    small: styles.smallCard,
    medium: styles.mediumCard,
    large: styles.largeCard,
  };

  return (
    <TouchableOpacity
      style={cardStyle[size]}
      onPress={() => onPress?.(zone)}
      activeOpacity={0.7}
    >
      <Card variant="elevated">
        <View style={styles.zoneHeader}>
          <View style={styles.zoneInfo}>
            <Text style={styles.zoneIcon}>{zone.icon}</Text>
            <View>
              <Text style={[styles.zoneName, styles[`${size}Name`]]}>
                {zone.name}
              </Text>
              <Text style={styles.plantCount}>{zone.plantCount} plants</Text>
            </View>
          </View>
          <Badge
            variant={getStatusVariant(zone.status)}
            size={size === "large" ? "medium" : "small"}
          >
            {zone.status}
          </Badge>
        </View>

        {showStats && (
          <View style={styles.zoneStats}>
            <StatItem
              icon="water-outline"
              iconColor="#45aaf2"
              value={`${zone.averageWaterLevel}%`}
              label="Water"
              size={size === "large" ? "medium" : "small"}
            />
            <StatItem
              icon="sunny-outline"
              iconColor="#f7b731"
              value={`${zone.averageLightLevel}%`}
              label="Light"
              size={size === "large" ? "medium" : "small"}
            />
            {zone.humidity && (
              <StatItem
                icon="water-outline"
                iconColor="#5dade2"
                value={`${zone.humidity}%`}
                label="Humidity"
                size={size === "large" ? "medium" : "small"}
              />
            )}
            {zone.temperature && (
              <StatItem
                icon="thermometer-outline"
                iconColor="#e74c3c"
                value={`${zone.temperature}°C`}
                label="Temp"
                size={size === "large" ? "medium" : "small"}
              />
            )}
          </View>
        )}

        {zone.lastUpdated && (
          <Text style={styles.lastUpdated}>
            Updated {zone.lastUpdated.toLocaleTimeString()}
          </Text>
        )}
      </Card>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
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
  zoneHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
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
  zoneName: {
    fontWeight: "bold",
    color: "#333",
    marginBottom: 2,
  },
  smallName: {
    fontSize: 16,
  },
  mediumName: {
    fontSize: 18,
  },
  largeName: {
    fontSize: 20,
  },
  plantCount: {
    fontSize: 12,
    color: "#666",
  },
  zoneStats: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
  },
  lastUpdated: {
    fontSize: 10,
    color: "#999",
    textAlign: "center",
    marginTop: 8,
  },
});
