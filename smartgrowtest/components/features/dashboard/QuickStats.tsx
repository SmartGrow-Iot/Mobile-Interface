import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Card } from "../../ui/Card";
import { StatItem } from "../../ui/StatItem";

type QuickStatsProps = {
  totalPlants: number;
  healthyPlants: number;
  criticalAlerts: number;
  optimalZones: number;
};

export function QuickStats({
  totalPlants,
  healthyPlants,
  criticalAlerts,
  optimalZones,
}: QuickStatsProps) {
  return (
    <Card style={styles.container}>
      <Text style={styles.title}>Quick Overview</Text>
      <View style={styles.statsRow}>
        <StatItem
          icon="leaf-outline"
          iconColor="#27ae60"
          value={totalPlants.toString()}
          label="Total Plants"
          size="medium"
        />
        <StatItem
          icon="checkmark-circle-outline"
          iconColor="#2ecc71"
          value={healthyPlants.toString()}
          label="Healthy"
          size="medium"
        />
        <StatItem
          icon="warning-outline"
          iconColor="#e74c3c"
          value={criticalAlerts.toString()}
          label="Alerts"
          size="medium"
        />
        <StatItem
          icon="shield-checkmark-outline"
          iconColor="#3498db"
          value={optimalZones.toString()}
          label="Optimal Zones"
          size="medium"
        />
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#174d3c",
    marginBottom: 16,
    textAlign: "center",
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
});
