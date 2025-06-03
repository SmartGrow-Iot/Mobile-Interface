import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { useLocalSearchParams } from "expo-router";
import Header from "../../components/Header";

const sensorIcons: Record<string, string> = {
  light: "☀️",
  soil: "🟫",
  airquality: "🌬️",
  temperature: "🌡️",
  humidity: "💧",
};

const sensorNames: Record<string, string> = {
  light: "Light Sensor",
  soil: "Soil Sensor",
  airquality: "Air Quality Sensor",
  temperature: "Temperature Sensor",
  humidity: "Humidity Sensor",
};

const groupData = [
  { group: "Group 1", icon: "🍆", value: "80% moisture", critical: false },
  { group: "Group 2", icon: "🌶️", value: "74% moisture", critical: false },
  { group: "GROUP 3", icon: "🍆", value: "85% moisture", critical: false },
  { group: "GROUP 4", icon: "🍆", value: "66% moisture", critical: true },
  { group: "GROUP 5", icon: "🌶️", value: "80% moisture", critical: false },
  { group: "GROUP 6", icon: "🌶️", value: "90% moisture", critical: false },
  // Add more items to test scrolling
  { group: "GROUP 7", icon: "🌶️", value: "75% moisture", critical: false },
  { group: "GROUP 8", icon: "🍆", value: "88% moisture", critical: false },
  { group: "GROUP 9", icon: "🌶️", value: "45% moisture", critical: true },
  { group: "GROUP 10", icon: "🍆", value: "92% moisture", critical: false },
];

export default function SensorDetail() {
  const { sensor } = useLocalSearchParams();
  const icon = sensorIcons[sensor as string] || "❓";
  const name = sensorNames[sensor as string] || "Sensor";

  // Custom breadcrumbs for sensor detail page
  const customBreadcrumbs = [
    { label: "Home", route: "/" },
    { label: "Sensors", route: "/(tabs)/sensors" },
    { label: name }, // Current page (no route)
  ];

  return (
    <View style={styles.container}>
      {/* Header Component */}
      <Header
        title={name}
        showBackButton={true}
        customBreadcrumbs={customBreadcrumbs}
      />

      {/* Main Content in ScrollView */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={true}
      >
        {/* Sensor Icon and Name Section */}
        <View style={styles.sensorHeader}>
          <Text style={styles.sensorIcon}>{icon}</Text>
          <Text style={styles.sensorName}>{name}</Text>
        </View>

        {/* Groups List */}
        <View style={styles.groupsContainer}>
          {groupData.map((g, idx) => (
            <View key={idx} style={styles.groupCard}>
              <Text style={styles.groupIcon}>{g.icon}</Text>
              <Text style={styles.groupName}>{g.group}</Text>
              <Text
                style={[
                  styles.groupValue,
                  g.critical && { color: "#ff4444", fontWeight: "bold" },
                ]}
              >
                {g.value}
              </Text>
            </View>
          ))}
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 40, // Extra padding at bottom
  },
  sensorHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 24,
    backgroundColor: "#fff",
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  sensorIcon: {
    fontSize: 48,
    marginRight: 12,
  },
  sensorName: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#174d3c",
  },
  groupsContainer: {
    paddingHorizontal: 16,
  },
  groupCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  groupIcon: {
    fontSize: 32,
    marginRight: 16,
  },
  groupName: {
    fontWeight: "600",
    fontSize: 18,
    flex: 1,
    color: "#333",
  },
  groupValue: {
    fontSize: 16,
    color: "#666",
    fontWeight: "500",
  },
});
