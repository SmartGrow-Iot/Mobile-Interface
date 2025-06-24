// components/features/plants/PlantHardwareSection.tsx - New component for hardware information
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Card } from "../../ui/Card";
import { PlantDetail, PlantHelpers } from "../../../types/Plant";

type PlantHardwareSectionProps = {
  plant: PlantDetail;
};

export function PlantHardwareSection({ plant }: PlantHardwareSectionProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Hardware Configuration</Text>

      {/* Zone Info Header */}
      <View style={styles.zoneHeader}>
        <Ionicons name="business-outline" size={20} color="#174d3c" />
        <Text style={styles.zoneTitle}>
          {PlantHelpers.getZoneDisplayName(plant.zone)} Hardware
        </Text>
      </View>

      {/* Actuators Card */}
      <Card style={styles.hardwareCard}>
        <View style={styles.hardwareHeader}>
          <Ionicons name="construct-outline" size={18} color="#e67e22" />
          <Text style={styles.hardwareTitle}>Actuators</Text>
        </View>

        <View style={styles.hardwareList}>
          <View style={styles.hardwareItem}>
            <View style={styles.hardwareIcon}>
              <Text style={styles.hardwareEmoji}>💧</Text>
            </View>
            <View style={styles.hardwareContent}>
              <Text style={styles.hardwareLabel}>Water Pump</Text>
              <Text style={styles.hardwareId}>
                {plant.zoneHardware.actuators.waterActuator}
              </Text>
            </View>
          </View>

          <View style={styles.hardwareItem}>
            <View style={styles.hardwareIcon}>
              <Text style={styles.hardwareEmoji}>💡</Text>
            </View>
            <View style={styles.hardwareContent}>
              <Text style={styles.hardwareLabel}>Light Controller</Text>
              <Text style={styles.hardwareId}>
                {plant.zoneHardware.actuators.lightActuator}
              </Text>
            </View>
          </View>

          <View style={styles.hardwareItem}>
            <View style={styles.hardwareIcon}>
              <Text style={styles.hardwareEmoji}>🌪️</Text>
            </View>
            <View style={styles.hardwareContent}>
              <Text style={styles.hardwareLabel}>Fan Controller</Text>
              <Text style={styles.hardwareId}>
                {plant.zoneHardware.actuators.fanActuator}
              </Text>
            </View>
          </View>
        </View>
      </Card>

      {/* Sensors Card */}
      <Card style={styles.hardwareCard}>
        <View style={styles.hardwareHeader}>
          <Ionicons name="radio-outline" size={18} color="#3498db" />
          <Text style={styles.hardwareTitle}>Sensors</Text>
        </View>

        <View style={styles.hardwareList}>
          <View style={styles.hardwareItem}>
            <View style={styles.hardwareIcon}>
              <Text style={styles.hardwareEmoji}>☀️</Text>
            </View>
            <View style={styles.hardwareContent}>
              <Text style={styles.hardwareLabel}>Light Sensor</Text>
              <Text style={styles.hardwareId}>
                {plant.zoneHardware.sensors.light}
              </Text>
            </View>
          </View>

          <View style={styles.hardwareItem}>
            <View style={styles.hardwareIcon}>
              <Text style={styles.hardwareEmoji}>🌡️</Text>
            </View>
            <View style={styles.hardwareContent}>
              <Text style={styles.hardwareLabel}>Temperature Sensor</Text>
              <Text style={styles.hardwareId}>
                {plant.zoneHardware.sensors.temperature}
              </Text>
            </View>
          </View>

          <View style={styles.hardwareItem}>
            <View style={styles.hardwareIcon}>
              <Text style={styles.hardwareEmoji}>💧</Text>
            </View>
            <View style={styles.hardwareContent}>
              <Text style={styles.hardwareLabel}>Humidity Sensor</Text>
              <Text style={styles.hardwareId}>
                {plant.zoneHardware.sensors.humidity}
              </Text>
            </View>
          </View>

          <View style={styles.hardwareItem}>
            <View style={styles.hardwareIcon}>
              <Text style={styles.hardwareEmoji}>🟫</Text>
            </View>
            <View style={styles.hardwareContent}>
              <Text style={styles.hardwareLabel}>Moisture Sensor</Text>
              <Text style={styles.hardwareId}>
                {plant.zoneHardware.sensors.moisture}
              </Text>
              <Text style={styles.hardwareNote}>
                Connected to Pin {plant.moisturePin}
              </Text>
            </View>
          </View>

          <View style={styles.hardwareItem}>
            <View style={styles.hardwareIcon}>
              <Text style={styles.hardwareEmoji}>🌬️</Text>
            </View>
            <View style={styles.hardwareContent}>
              <Text style={styles.hardwareLabel}>Air Quality Sensor</Text>
              <Text style={styles.hardwareId}>
                {plant.zoneHardware.sensors.airQuality}
              </Text>
            </View>
          </View>
        </View>
      </Card>

      {/* Hardware Info Note */}
      <View style={styles.infoNote}>
        <Ionicons name="information-circle-outline" size={16} color="#666" />
        <Text style={styles.infoNoteText}>
          Hardware IDs shown above correspond to the physical devices in{" "}
          {PlantHelpers.getZoneDisplayName(plant.zone)}. These are shared across
          all plants in the same zone.
        </Text>
      </View>
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
  zoneHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: "#f8f9fa",
    borderRadius: 8,
  },
  zoneTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#174d3c",
    marginLeft: 8,
  },
  hardwareCard: {
    marginBottom: 12,
  },
  hardwareHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  hardwareTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginLeft: 8,
  },
  hardwareList: {
    gap: 12,
  },
  hardwareItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingVertical: 8,
  },
  hardwareIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#f8f9fa",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  hardwareEmoji: {
    fontSize: 18,
  },
  hardwareContent: {
    flex: 1,
  },
  hardwareLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 2,
  },
  hardwareId: {
    fontSize: 13,
    color: "#666",
    fontFamily: "monospace",
    marginBottom: 2,
  },
  hardwareNote: {
    fontSize: 12,
    color: "#999",
    fontStyle: "italic",
  },
  infoNote: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "#f0f8ff",
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  infoNoteText: {
    fontSize: 12,
    color: "#666",
    marginLeft: 8,
    flex: 1,
    lineHeight: 16,
  },
});
