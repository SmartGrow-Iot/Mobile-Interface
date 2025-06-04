// components/features/plants/PlantInfoCards.tsx
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Card } from "../../ui/Card";

type PlantInfo = {
  datePlanted: string;
  optimalMoisture: string;
  optimalLight: string;
  optimalTemp: string;
  type: string;
  growthTime: string;
  notes: string;
};

type PlantInfoCardsProps = {
  plantInfo: PlantInfo;
};

export function PlantInfoCards({ plantInfo }: PlantInfoCardsProps) {
  return (
    <View style={styles.container}>
      <Card style={styles.infoCard}>
        <Text style={styles.infoLabel}>Date Planted</Text>
        <Text style={styles.infoValue}>{plantInfo.datePlanted}</Text>

        <Text style={styles.infoLabel}>Optimal Moisture</Text>
        <Text style={styles.infoValue}>{plantInfo.optimalMoisture}</Text>

        <Text style={styles.infoLabel}>Optimal Light Level</Text>
        <Text style={styles.infoValue}>{plantInfo.optimalLight}</Text>

        <Text style={styles.infoLabel}>Optimal Temp.</Text>
        <Text style={styles.infoValue}>{plantInfo.optimalTemp}</Text>
      </Card>

      <Card style={styles.infoCard}>
        <Text style={styles.infoLabel}>Plant Info</Text>

        <Text style={styles.infoSubLabel}>Type</Text>
        <Text style={styles.infoValue}>{plantInfo.type}</Text>

        <Text style={styles.infoSubLabel}>Growth Time</Text>
        <Text style={styles.infoValue}>{plantInfo.growthTime}</Text>

        <Text style={styles.infoSubLabel}>Notes:</Text>
        <Text style={styles.infoValue}>{plantInfo.notes}</Text>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  infoCard: {
    flex: 1,
    marginHorizontal: 6,
  },
  infoLabel: {
    fontWeight: "bold",
    fontSize: 14,
    color: "#174d3c",
    marginTop: 8,
    marginBottom: 4,
  },
  infoSubLabel: {
    fontWeight: "600",
    fontSize: 13,
    color: "#666",
    marginTop: 6,
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 13,
    color: "#333",
    marginBottom: 4,
    lineHeight: 18,
  },
});
