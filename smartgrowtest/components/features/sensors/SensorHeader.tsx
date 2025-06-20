// components/features/sensors/SensorHeader.tsx
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Card } from "../../ui/Card";

type SensorHeaderProps = {
  icon: string;
  name: string;
  description?: string;
  backgroundColor?: string;
};

export function SensorHeader({
  icon,
  name,
  description,
  backgroundColor = "#fff",
}: SensorHeaderProps) {
  return (
    <Card style={[styles.container, { backgroundColor }]}>
      <View style={styles.content}>
        <Text style={styles.sensorIcon}>{icon}</Text>
        <View style={styles.textContainer}>
          <Text style={styles.sensorName}>{name}</Text>
          {description && <Text style={styles.description}>{description}</Text>}
        </View>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    paddingVertical: 24,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  sensorIcon: {
    fontSize: 48,
    marginRight: 12,
  },
  textContainer: {
    alignItems: "center",
  },
  sensorName: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#174d3c",
  },
  description: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
    textAlign: "center",
  },
});
