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

// Updated sensors list to match the environmental data API
const sensors = [
  { label: "Light Sensor", icon: "☀️", route: "light" },
  { label: "Soil Moisture Sensor", icon: "🟫", route: "soil" }, // Updated from "Soil Sensor"
  { label: "Air Quality Sensor", icon: "🌬️", route: "airquality" },
  { label: "Temperature Sensor", icon: "🌡️", route: "temperature" },
  { label: "Humidity Sensor", icon: "💧", route: "humidity" },
];

export default function SensorsScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Header title="Sensors" showSearch={true} showProfile={true} />

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.description}>
          Monitor environmental conditions across all zones
        </Text>

        {sensors.map((sensor, idx) => (
          <TouchableOpacity
            key={idx}
            style={styles.sensorBtn}
            activeOpacity={0.8}
            onPress={() => router.push(`/sensors/${sensor.route}`)}
          >
            <Text style={styles.sensorIcon}>{sensor.icon}</Text>
            <View style={styles.sensorInfo}>
              <Text style={styles.sensorLabel}>{sensor.label}</Text>
              <Text style={styles.sensorSubtext}>View data from zones 1-4</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#999" />
          </TouchableOpacity>
        ))}

        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>Environmental Monitoring</Text>
          <Text style={styles.infoText}>
            All sensors collect data automatically and provide real-time
            insights into your plant growing conditions across all zones.
          </Text>
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
  sensorBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 24,
    marginVertical: 10,
    width: "100%",
    maxWidth: 340,
    shadowColor: "#000",
    shadowOpacity: 0.07,
    shadowRadius: 6,
    elevation: 3,
  },
  sensorIcon: {
    fontSize: 36,
    marginRight: 18,
  },
  sensorInfo: {
    flex: 1,
  },
  sensorLabel: {
    fontSize: 20,
    fontWeight: "600",
    color: "#222",
    marginBottom: 2,
  },
  sensorSubtext: {
    fontSize: 14,
    color: "#666",
  },
  infoCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    marginTop: 24,
    width: "100%",
    maxWidth: 340,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#174d3c",
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
  },
});
