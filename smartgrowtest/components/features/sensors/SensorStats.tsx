// components/features/sensors/SensorStats.tsx
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Card } from "../../ui/Card";
import { StatItem } from "../../ui/StatItem";

type SensorStatsProps = {
  stats: {
    totalGroups: number;
    criticalGroups: number;
    averageValue?: number;
    unit?: string;
  };
};

export function SensorStats({ stats }: SensorStatsProps) {
  return (
    <Card style={styles.container}>
      <Text style={styles.title}>Overview</Text>
      <View style={styles.statsRow}>
        <StatItem
          icon="business-outline"
          iconColor="#3498db"
          value={stats.totalGroups.toString()}
          label="Total Groups"
          size="medium"
        />
        <StatItem
          icon="warning-outline"
          iconColor="#e74c3c"
          value={stats.criticalGroups.toString()}
          label="Critical"
          size="medium"
        />
        {stats.averageValue !== undefined && (
          <StatItem
            icon="analytics-outline"
            iconColor="#27ae60"
            value={`${stats.averageValue.toFixed(1)}${stats.unit || ""}`}
            label="Average"
            size="medium"
          />
        )}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
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
