// app/(tabs)/sensors.tsx - Fixed routes to match API field names
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import Header from "../../components/Header";

// Updated sensors list with correct routes matching API field names
const sensors = [
  {
    label: "Light Sensor",
    icon: "☀️",
    route: "light", // matches API field
    description: "Environmental data shared across all zones",
    type: "environmental",
  },
  {
    label: "Temperature Sensor",
    icon: "🌡️",
    route: "temp", // Changed from "temperature" to match API field
    description: "Environmental data shared across all zones",
    type: "environmental",
  },
  {
    label: "Humidity Sensor",
    icon: "💧",
    route: "humidity", // matches API field
    description: "Environmental data shared across all zones",
    type: "environmental",
  },
  {
    label: "Air Quality Sensor",
    icon: "🌬️",
    route: "airQuality", // matches API field exactly
    description: "Environmental data shared across all zones",
    type: "environmental",
  },
  {
    label: "Soil Moisture Sensor",
    icon: "🟫",
    route: "soil",
    description: "Individual plant monitoring by zone and pin",
    type: "plant-specific",
  },
];

export default function SensorsScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Header
        title="Sensors"
        showSearch={true}
        showProfile={true}
        showNotifications={true}
      />

      <ScrollView contentContainerStyle={styles.content}>
        {/* Environmental Sensors Section */}
        <View style={styles.sensorSection}>
          <Text style={styles.sectionTitle}>Environmental Sensors</Text>
          <Text style={styles.sectionDescription}>
            Shared data across all zones for consistency
          </Text>
          {sensors
            .filter((sensor) => sensor.type === "environmental")
            .map((sensor, idx) => (
              <TouchableOpacity
                key={idx}
                style={[styles.sensorBtn, styles.environmentalSensor]}
                activeOpacity={0.8}
                onPress={() => router.push(`/sensors/${sensor.route}`)}
              >
                <Text style={styles.sensorIcon}>{sensor.icon}</Text>
                <View style={styles.sensorInfo}>
                  <Text style={styles.sensorLabel}>{sensor.label}</Text>
                  <Text style={styles.sensorSubtext}>{sensor.description}</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#999" />
              </TouchableOpacity>
            ))}
        </View>

        {/* Plant-Specific Sensors Section */}
        <View style={styles.sensorSection}>
          <Text style={styles.sectionTitle}>Plant-Specific Sensors</Text>
          <Text style={styles.sectionDescription}>
            Individual monitoring per plant by zone and pin
          </Text>
          {sensors
            .filter((sensor) => sensor.type === "plant-specific")
            .map((sensor, idx) => (
              <TouchableOpacity
                key={idx}
                style={[styles.sensorBtn, styles.plantSpecificSensor]}
                activeOpacity={0.8}
                onPress={() => router.push(`/sensors/${sensor.route}`)}
              >
                <Text style={styles.sensorIcon}>{sensor.icon}</Text>
                <View style={styles.sensorInfo}>
                  <Text style={styles.sensorLabel}>{sensor.label}</Text>
                  <Text style={styles.sensorSubtext}>{sensor.description}</Text>
                </View>
                <View style={[styles.sensorBadge, styles.plantBadge]}>
                  <Text style={[styles.sensorBadgeText, styles.plantBadgeText]}>
                    Per Plant
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#999" />
              </TouchableOpacity>
            ))}
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>Data Sources</Text>
          <View style={styles.infoContent}>
            <View style={styles.infoSection}>
              <View style={styles.infoIconContainer}>
                <Ionicons name="cloud-outline" size={20} color="#3498db" />
              </View>
              <View style={styles.infoTextContainer}>
                <Text style={styles.infoSectionTitle}>
                  Environmental Sensors
                </Text>
                <Text style={styles.infoText}>
                  Light, Temperature, Humidity, and Air Quality sensors share
                  environmental data across all zones for consistency.
                </Text>
              </View>
            </View>

            <View style={styles.infoSection}>
              <View style={styles.infoIconContainer}>
                <Ionicons name="leaf-outline" size={20} color="#27ae60" />
              </View>
              <View style={styles.infoTextContainer}>
                <Text style={styles.infoSectionTitle}>
                  Soil Moisture Sensors
                </Text>
                <Text style={styles.infoText}>
                  Individual plant monitoring with zone-specific and
                  pin-specific data for precise soil moisture tracking. Each
                  plant has its own optimal thresholds.
                </Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f8f8",
  },
  content: {
    padding: 16,
    alignItems: "center",
    flexGrow: 1,
  },
  description: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  sensorSection: {
    width: "100%",
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#174d3c",
    marginBottom: 8,
    textAlign: "center",
  },
  sectionDescription: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginBottom: 16,
    paddingHorizontal: 20,
  },
  sensorBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 20,
    marginVertical: 6,
    width: "100%",
    maxWidth: 360,
    alignSelf: "center",
    shadowColor: "#000",
    shadowOpacity: 0.07,
    shadowRadius: 6,
    elevation: 3,
  },
  environmentalSensor: {
    borderLeftWidth: 4,
    borderLeftColor: "#3498db",
  },
  plantSpecificSensor: {
    borderLeftWidth: 4,
    borderLeftColor: "#27ae60",
  },
  sensorIcon: {
    fontSize: 32,
    marginRight: 16,
  },
  sensorInfo: {
    flex: 1,
  },
  sensorLabel: {
    fontSize: 18,
    fontWeight: "600",
    color: "#222",
    marginBottom: 4,
  },
  sensorSubtext: {
    fontSize: 13,
    color: "#666",
    lineHeight: 18,
  },
  sensorBadge: {
    backgroundColor: "#3498db",
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginRight: 12,
  },
  plantBadge: {
    backgroundColor: "#27ae60",
  },
  sensorBadgeText: {
    fontSize: 10,
    fontWeight: "600",
    color: "#fff",
  },
  plantBadgeText: {
    color: "#fff",
  },
  infoCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    marginTop: 24,
    width: "100%",
    maxWidth: 360,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#174d3c",
    marginBottom: 16,
    textAlign: "center",
  },
  infoContent: {
    gap: 16,
  },
  infoSection: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
  },
  infoIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#f8f9fa",
    alignItems: "center",
    justifyContent: "center",
  },
  infoTextContainer: {
    flex: 1,
  },
  infoSectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  infoText: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
  },
});
