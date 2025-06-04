import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Card } from "../../ui/Card";
import { PlantReading } from "../../../types/Plant";

type PlantReadingsProps = {
  readings: PlantReading[];
  title?: string;
};

export function PlantReadings({
  readings,
  title = "Current Readings",
}: PlantReadingsProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <Card style={styles.readingsCard}>
        <View style={styles.readingsRow}>
          {readings.map((reading, idx) => (
            <View key={idx} style={styles.readingBox}>
              <Text style={styles.readingLabel}>{reading.label}</Text>
              <Text style={styles.readingValue}>{reading.value}</Text>
            </View>
          ))}
        </View>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#174d3c",
    marginBottom: 12,
  },
  readingsCard: {
    padding: 16,
  },
  readingsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  readingBox: {
    alignItems: "center",
    flex: 1,
  },
  readingLabel: {
    fontWeight: "bold",
    fontSize: 12,
    color: "#888",
    marginBottom: 4,
  },
  readingValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#174d3c",
  },
});
