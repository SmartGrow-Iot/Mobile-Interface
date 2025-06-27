// components/features/plants/PlantInfoSection.tsx - New component for plant information
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Card } from "../../ui/Card";
import { PlantDetail, PlantHelpers } from "../../../types/Plant";

type PlantInfoSectionProps = {
  plant: PlantDetail;
};

export function PlantInfoSection({ plant }: PlantInfoSectionProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Plant Information</Text>

      {/* Basic Info Card */}
      <Card style={styles.infoCard}>
        <View style={styles.infoRow}>
          <View style={styles.infoItem}>
            <Ionicons name="location-outline" size={16} color="#666" />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Zone</Text>
              <Text style={styles.infoValue}>
                {PlantHelpers.getZoneDisplayName(plant.zone)}
              </Text>
            </View>
          </View>

          <View style={styles.infoItem}>
            <Ionicons name="hardware-chip-outline" size={16} color="#666" />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Moisture Pin</Text>
              <Text style={styles.infoValue}>Pin {plant.moisturePin}</Text>
            </View>
          </View>
        </View>

        <View style={styles.infoRow}>
          <View style={styles.infoItem}>
            <Ionicons name="leaf-outline" size={16} color="#666" />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Type</Text>
              <Text style={styles.infoValue}>
                {plant.type.charAt(0).toUpperCase() + plant.type.slice(1)}
              </Text>
            </View>
          </View>

          <View style={styles.infoItem}>
            <Ionicons name="time-outline" size={16} color="#666" />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Growth Time</Text>
              <Text style={styles.infoValue}>{plant.growthTime} days</Text>
            </View>
          </View>
        </View>
      </Card>

      {/* Description Card */}
      <Card style={styles.descriptionCard}>
        <View style={styles.descriptionHeader}>
          <Ionicons name="document-text-outline" size={18} color="#174d3c" />
          <Text style={styles.descriptionTitle}>Description</Text>
        </View>
        <Text style={styles.descriptionText}>
          {plant.description || "No description provided"}
        </Text>
      </Card>

      {/* Thresholds Card */}
      <Card style={styles.thresholdsCard}>
        <View style={styles.thresholdsHeader}>
          <Ionicons name="speedometer-outline" size={18} color="#174d3c" />
          <Text style={styles.thresholdsTitle}>Thresholds</Text>
        </View>

        <View style={styles.thresholdsList}>
          <View style={styles.thresholdItem}>
            <Text style={styles.thresholdIcon}>💧</Text>
            <View style={styles.thresholdContent}>
              <Text style={styles.thresholdLabel}>Moisture</Text>
              <Text style={styles.thresholdValue}>
                {plant.thresholds.moisture.min}% -{" "}
                {plant.thresholds.moisture.max}%
              </Text>
            </View>
          </View>

          <View style={styles.thresholdItem}>
            <Text style={styles.thresholdIcon}>🌡️</Text>
            <View style={styles.thresholdContent}>
              <Text style={styles.thresholdLabel}>Temperature</Text>
              <Text style={styles.thresholdValue}>
                {plant.thresholds.temperature.min}°C -{" "}
                {plant.thresholds.temperature.max}°C
              </Text>
            </View>
          </View>

          <View style={styles.thresholdItem}>
            <Text style={styles.thresholdIcon}>☀️</Text>
            <View style={styles.thresholdContent}>
              <Text style={styles.thresholdLabel}>Light</Text>
              <Text style={styles.thresholdValue}>
                {plant.thresholds.light.min} - {plant.thresholds.light.max}
              </Text>
            </View>
          </View>

          <View style={styles.thresholdItem}>
            <Text style={styles.thresholdIcon}>🌬️</Text>
            <View style={styles.thresholdContent}>
              <Text style={styles.thresholdLabel}>Air Quality</Text>
              <Text style={styles.thresholdValue}>
                {plant.thresholds.airQuality.min} -{" "}
                {plant.thresholds.airQuality.max} ppm
              </Text>
            </View>
          </View>
        </View>
      </Card>

      {/* Dates Card */}
      <Card style={styles.datesCard}>
        <View style={styles.datesHeader}>
          <Ionicons name="calendar-outline" size={18} color="#174d3c" />
          <Text style={styles.datesTitle}>Timeline</Text>
        </View>

        <View style={styles.datesList}>
          <View style={styles.dateItem}>
            <Text style={styles.dateLabel}>Created</Text>
            <Text style={styles.dateValue}>
              {new Date(plant.createdAt).toLocaleDateString("en-GB")}
            </Text>
          </View>

          <View style={styles.dateItem}>
            <Text style={styles.dateLabel}>Last Updated</Text>
            <Text style={styles.dateValue}>
              {new Date(plant.updatedAt).toLocaleDateString("en-GB")}
            </Text>
          </View>
        </View>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#174d3c",
    marginBottom: 12,
  },
  infoCard: {
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginHorizontal: 4,
  },
  infoContent: {
    marginLeft: 8,
  },
  infoLabel: {
    fontSize: 12,
    color: "#666",
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },
  descriptionCard: {
    marginBottom: 12,
  },
  descriptionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  descriptionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#174d3c",
    marginLeft: 8,
  },
  descriptionText: {
    fontSize: 14,
    color: "#333",
    lineHeight: 20,
  },
  thresholdsCard: {
    marginBottom: 12,
  },
  thresholdsHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  thresholdsTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#174d3c",
    marginLeft: 8,
  },
  thresholdsList: {
    gap: 12,
  },
  thresholdItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  thresholdIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  thresholdContent: {
    flex: 1,
  },
  thresholdLabel: {
    fontSize: 14,
    color: "#666",
    marginBottom: 2,
  },
  thresholdValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },
  datesCard: {
    marginBottom: 12,
  },
  datesHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  datesTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#174d3c",
    marginLeft: 8,
  },
  datesList: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  dateItem: {
    flex: 1,
    alignItems: "center",
  },
  dateLabel: {
    fontSize: 12,
    color: "#666",
    marginBottom: 4,
  },
  dateValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },
});
