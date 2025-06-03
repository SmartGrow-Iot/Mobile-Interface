import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import Header from "../../components/Header"; 

type PlantData = {
  name: string;
  image: string;
  datePlanted: string;
  optimalMoisture: string;
  optimalLight: string;
  optimalTemp: string;
  type: string;
  growthTime: string;
  notes: string;
  zone: string; // Add zone info for breadcrumbs
  thresholds: {
    label: string;
    value: string;
    color: string;
    bg: string;
    icon: string;
  }[];
  actuator: string;
  readings: {
    label: string;
    value: string;
  }[];
};

const plantData: Record<string, PlantData> = {
  "CP-1": {
    name: "Chili Plant 1",
    image: "🌶️",
    zone: "Zone A",
    datePlanted: "23/5/2024",
    optimalMoisture: "50% - 70%",
    optimalLight: "70% - 80%",
    optimalTemp: "25°C - 30°C",
    type: "Warm-season fruiting vegetable",
    growthTime: "60-90 days to maturity",
    notes:
      "Prefers well-drained soil and benefits from regular feeding during flowering and fruiting stages.",
    thresholds: [
      {
        label: "Light Threshold is",
        value: "Optimal",
        color: "#222",
        bg: "#f5f5f5",
        icon: "☀️",
      },
      {
        label: "Water Threshold is",
        value: "Critical",
        color: "red",
        bg: "#fff",
        icon: "💧",
      },
    ],
    actuator: "Override Actuator",
    readings: [
      { label: "Temp", value: "28°C" },
      { label: "Humidity", value: "60%" },
      { label: "Moisture", value: "40%" },
      { label: "Light", value: "70%" },
      { label: "Wind", value: "5 m/s" },
    ],
  },
  // Add zone info to other plants
  "CP-2": {
    name: "Chili Plant 2",
    image: "🌶️",
    zone: "Zone A",
    datePlanted: "24/5/2024",
    optimalMoisture: "50% - 70%",
    optimalLight: "70% - 80%",
    optimalTemp: "25°C - 30°C",
    type: "Warm-season fruiting vegetable",
    growthTime: "60-90 days",
    notes: "Placeholder data for CP-2.",
    thresholds: [
      {
        label: "Light Threshold is",
        value: "Optimal",
        color: "#222",
        bg: "#f5f5f5",
        icon: "☀️",
      },
      {
        label: "Water Threshold is",
        value: "Optimal",
        color: "#222",
        bg: "#fff",
        icon: "💧",
      },
    ],
    actuator: "Override Actuator",
    readings: [
      { label: "Temp", value: "27°C" },
      { label: "Humidity", value: "62%" },
      { label: "Moisture", value: "55%" },
      { label: "Light", value: "75%" },
      { label: "Wind", value: "4 m/s" },
    ],
  },
  "CP-3": {
    name: "Chili Plant 3",
    image: "🌶️",
    zone: "Zone A",
    datePlanted: "25/5/2024",
    optimalMoisture: "50% - 70%",
    optimalLight: "70% - 80%",
    optimalTemp: "25°C - 30°C",
    type: "Warm-season fruiting vegetable",
    growthTime: "60-90 days",
    notes: "Placeholder data for CP-3.",
    thresholds: [
      {
        label: "Light Threshold is",
        value: "Critical",
        color: "red",
        bg: "#f5f5f5",
        icon: "☀️",
      },
      {
        label: "Water Threshold is",
        value: "Optimal",
        color: "#222",
        bg: "#fff",
        icon: "💧",
      },
    ],
    actuator: "Override Actuator",
    readings: [
      { label: "Temp", value: "29°C" },
      { label: "Humidity", value: "58%" },
      { label: "Moisture", value: "45%" },
      { label: "Light", value: "80%" },
      { label: "Wind", value: "6 m/s" },
    ],
  },
  "CP-4": {
    name: "Chili Plant 4",
    image: "🌶️",
    zone: "Zone A",
    datePlanted: "26/5/2024",
    optimalMoisture: "50% - 70%",
    optimalLight: "70% - 80%",
    optimalTemp: "25°C - 30°C",
    type: "Warm-season fruiting vegetable",
    growthTime: "60-90 days",
    notes: "Placeholder data for CP-4.",
    thresholds: [
      {
        label: "Light Threshold is",
        value: "Optimal",
        color: "#222",
        bg: "#f5f5f5",
        icon: "☀️",
      },
      {
        label: "Water Threshold is",
        value: "Critical",
        color: "red",
        bg: "#fff",
        icon: "💧",
      },
    ],
    actuator: "Override Actuator",
    readings: [
      { label: "Temp", value: "28°C" },
      { label: "Humidity", value: "60%" },
      { label: "Moisture", value: "50%" },
      { label: "Light", value: "70%" },
      { label: "Wind", value: "5 m/s" },
    ],
  },
  "CP-5": {
    name: "Chili Plant 5",
    image: "🌶️",
    zone: "Zone B",
    datePlanted: "27/5/2024",
    optimalMoisture: "50% - 70%",
    optimalLight: "70% - 80%",
    optimalTemp: "25°C - 30°C",
    type: "Warm-season fruiting vegetable",
    growthTime: "60-90 days",
    notes: "Placeholder data for CP-5.",
    thresholds: [
      {
        label: "Light Threshold is",
        value: "Critical",
        color: "red",
        bg: "#f5f5f5",
        icon: "☀️",
      },
      {
        label: "Water Threshold is",
        value: "Critical",
        color: "red",
        bg: "#fff",
        icon: "💧",
      },
    ],
    actuator: "Override Actuator",
    readings: [
      { label: "Temp", value: "30°C" },
      { label: "Humidity", value: "55%" },
      { label: "Moisture", value: "35%" },
      { label: "Light", value: "85%" },
      { label: "Wind", value: "7 m/s" },
    ],
  },
  "CP-6": {
    name: "Chili Plant 6",
    image: "🌶️",
    zone: "Zone B",
    datePlanted: "28/5/2024",
    optimalMoisture: "50% - 70%",
    optimalLight: "70% - 80%",
    optimalTemp: "25°C - 30°C",
    type: "Warm-season fruiting vegetable",
    growthTime: "60-90 days",
    notes: "Placeholder data for CP-6.",
    thresholds: [
      {
        label: "Light Threshold is",
        value: "Optimal",
        color: "#222",
        bg: "#f5f5f5",
        icon: "☀️",
      },
      {
        label: "Water Threshold is",
        value: "Optimal",
        color: "#222",
        bg: "#fff",
        icon: "💧",
      },
    ],
    actuator: "Override Actuator",
    readings: [
      { label: "Temp", value: "27°C" },
      { label: "Humidity", value: "63%" },
      { label: "Moisture", value: "60%" },
      { label: "Light", value: "72%" },
      { label: "Wind", value: "4 m/s" },
    ],
  },
  "CP-7": {
    name: "Chili Plant 7",
    image: "🌶️",
    zone: "Zone B",
    datePlanted: "29/5/2024",
    optimalMoisture: "50% - 70%",
    optimalLight: "70% - 80%",
    optimalTemp: "25°C - 30°C",
    type: "Warm-season fruiting vegetable",
    growthTime: "60-90 days",
    notes: "Placeholder data for CP-7.",
    thresholds: [
      {
        label: "Light Threshold is",
        value: "Optimal",
        color: "#222",
        bg: "#f5f5f5",
        icon: "☀️",
      },
      {
        label: "Water Threshold is",
        value: "Critical",
        color: "red",
        bg: "#fff",
        icon: "💧",
      },
    ],
    actuator: "Override Actuator",
    readings: [
      { label: "Temp", value: "28°C" },
      { label: "Humidity", value: "60%" },
      { label: "Moisture", value: "55%" },
      { label: "Light", value: "70%" },
      { label: "Wind", value: "5 m/s" },
    ],
  },
  "CP-8": {
    name: "Chili Plant 8",
    image: "🌶️",
    zone: "Zone B",
    datePlanted: "30/5/2024",
    optimalMoisture: "50% - 70%",
    optimalLight: "70% - 80%",
    optimalTemp: "25°C - 30°C",
    type: "Warm-season fruiting vegetable",
    growthTime: "60-90 days",
    notes: "Placeholder data for CP-8.",
    thresholds: [
      {
        label: "Light Threshold is",
        value: "Optimal",
        color: "#222",
        bg: "#f5f5f5",
        icon: "☀️",
      },
      {
        label: "Water Threshold is",
        value: "Optimal",
        color: "#222",
        bg: "#fff",
        icon: "💧",
      },
    ],
    actuator: "Override Actuator",
    readings: [
      { label: "Temp", value: "27°C" },
      { label: "Humidity", value: "62%" },
      { label: "Moisture", value: "60%" },
      { label: "Light", value: "75%" },
      { label: "Wind", value: "4 m/s" },
    ],
  },
  "EP-1": {
    name: "Eggplant 1",
    image: "🍆",
    zone: "Zone C",
    datePlanted: "23/5/2024",
    optimalMoisture: "60% - 80%",
    optimalLight: "60% - 75%",
    optimalTemp: "22°C - 28°C",
    type: "Warm-season fruiting vegetable",
    growthTime: "70-100 days",
    notes: "Placeholder data for EP-1.",
    thresholds: [
      {
        label: "Light Threshold is",
        value: "Optimal",
        color: "#222",
        bg: "#f5f5f5",
        icon: "☀️",
      },
      {
        label: "Water Threshold is",
        value: "Optimal",
        color: "#222",
        bg: "#fff",
        icon: "💧",
      },
    ],
    actuator: "Override Actuator",
    readings: [
      { label: "Temp", value: "25°C" },
      { label: "Humidity", value: "65%" },
      { label: "Moisture", value: "70%" },
      { label: "Light", value: "65%" },
      { label: "Wind", value: "3 m/s" },
    ],
  },
  "EP-2": {
    name: "Eggplant 2",
    image: "🍆",
    zone: "Zone C",
    datePlanted: "24/5/2024",
    optimalMoisture: "60% - 80%",
    optimalLight: "60% - 75%",
    optimalTemp: "22°C - 28°C",
    type: "Warm-season fruiting vegetable",
    growthTime: "70-100 days",
    notes: "Placeholder data for EP-2.",
    thresholds: [
      {
        label: "Light Threshold is",
        value: "Optimal",
        color: "#222",
        bg: "#f5f5f5",
        icon: "☀️",
      },
      {
        label: "Water Threshold is",
        value: "Optimal",
        color: "#222",
        bg: "#fff",
        icon: "💧",
      },
    ],
    actuator: "Override Actuator",
    readings: [
      { label: "Temp", value: "24°C" },
      { label: "Humidity", value: "68%" },
      { label: "Moisture", value: "75%" },
      { label: "Light", value: "70%" },
      { label: "Wind", value: "3 m/s" },
    ],
  },
  "EP-3": {
    name: "Eggplant 3",
    image: "🍆",
    zone: "Zone C",
    datePlanted: "25/5/2024",
    optimalMoisture: "60% - 80%",
    optimalLight: "60% - 75%",
    optimalTemp: "22°C - 28°C",
    type: "Warm-season fruiting vegetable",
    growthTime: "70-100 days",
    notes: "Placeholder data for EP-3.",
    thresholds: [
      {
        label: "Light Threshold is",
        value: "Critical",
        color: "red",
        bg: "#f5f5f5",
        icon: "☀️",
      },
      {
        label: "Water Threshold is",
        value: "Optimal",
        color: "#222",
        bg: "#fff",
        icon: "💧",
      },
    ],
    actuator: "Override Actuator",
    readings: [
      { label: "Temp", value: "26°C" },
      { label: "Humidity", value: "60%" },
      { label: "Moisture", value: "65%" },
      { label: "Light", value: "60%" },
      { label: "Wind", value: "4 m/s" },
    ],
  },
  "EP-4": {
    name: "Eggplant 4",
    image: "🍆",
    zone: "Zone C",
    datePlanted: "26/5/2024",
    optimalMoisture: "60% - 80%",
    optimalLight: "60% - 75%",
    optimalTemp: "22°C - 28°C",
    type: "Warm-season fruiting vegetable",
    growthTime: "70-100 days",
    notes: "Placeholder data for EP-4.",
    thresholds: [
      {
        label: "Light Threshold is",
        value: "Optimal",
        color: "#222",
        bg: "#f5f5f5",
        icon: "☀️",
      },
      {
        label: "Water Threshold is",
        value: "Critical",
        color: "red",
        bg: "#fff",
        icon: "💧",
      },
    ],
    actuator: "Override Actuator",
    readings: [
      { label: "Temp", value: "25°C" },
      { label: "Humidity", value: "67%" },
      { label: "Moisture", value: "70%" },
      { label: "Light", value: "65%" },
      { label: "Wind", value: "3 m/s" },
    ],
  },
  "EP-5": {
    name: "Eggplant 5",
    image: "🍆",
    zone: "Zone D",
    datePlanted: "27/5/2024",
    optimalMoisture: "60% - 80%",
    optimalLight: "60% - 75%",
    optimalTemp: "22°C - 28°C",
    type: "Warm-season fruiting vegetable",
    growthTime: "70-100 days",
    notes: "Placeholder data for EP-5.",
    thresholds: [
      {
        label: "Light Threshold is",
        value: "Optimal",
        color: "#222",
        bg: "#f5f5f5",
        icon: "☀️",
      },
      {
        label: "Water Threshold is",
        value: "Optimal",
        color: "#222",
        bg: "#fff",
        icon: "💧",
      },
    ],
    actuator: "Override Actuator",
    readings: [
      { label: "Temp", value: "24°C" },
      { label: "Humidity", value: "68%" },
      { label: "Moisture", value: "75%" },
      { label: "Light", value: "70%" },
      { label: "Wind", value: "3 m/s" },
    ],
  },
  "EP-6": {
    name: "Eggplant 6",
    image: "🍆",
    zone: "Zone D",
    datePlanted: "28/5/2024",
    optimalMoisture: "60% - 80%",
    optimalLight: "60% - 75%",
    optimalTemp: "22°C - 28°C",
    type: "Warm-season fruiting vegetable",
    growthTime: "70-100 days",
    notes: "Placeholder data for EP-6.",
    thresholds: [
      {
        label: "Light Threshold is",
        value: "Optimal",
        color: "#222",
        bg: "#f5f5f5",
        icon: "☀️",
      },
      {
        label: "Water Threshold is",
        value: "Optimal",
        color: "#222",
        bg: "#fff",
        icon: "💧",
      },
    ],
    actuator: "Override Actuator",
    readings: [
      { label: "Temp", value: "25°C" },
      { label: "Humidity", value: "65%" },
      { label: "Moisture", value: "70%" },
      { label: "Light", value: "65%" },
      { label: "Wind", value: "3 m/s" },
    ],
  },
  "EP-7": {
    name: "Eggplant 7",
    image: "🍆",
    zone: "Zone D",
    datePlanted: "29/5/2024",
    optimalMoisture: "60% - 80%",
    optimalLight: "60% - 75%",
    optimalTemp: "22°C - 28°C",
    type: "Warm-season fruiting vegetable",
    growthTime: "70-100 days",
    notes: "Placeholder data for EP-7.",
    thresholds: [
      {
        label: "Light Threshold is",
        value: "Optimal",
        color: "#222",
        bg: "#f5f5f5",
        icon: "☀️",
      },
      {
        label: "Water Threshold is",
        value: "Critical",
        color: "red",
        bg: "#fff",
        icon: "💧",
      },
    ],
    actuator: "Override Actuator",
    readings: [
      { label: "Temp", value: "25°C" },
      { label: "Humidity", value: "67%" },
      { label: "Moisture", value: "70%" },
      { label: "Light", value: "65%" },
      { label: "Wind", value: "3 m/s" },
    ],
  },
  "EP-8": {
    name: "Eggplant 8",
    image: "🍆",
    zone: "Zone D",
    datePlanted: "30/5/2024",
    optimalMoisture: "60% - 80%",
    optimalLight: "60% - 75%",
    optimalTemp: "22°C - 28°C",
    type: "Warm-season fruiting vegetable",
    growthTime: "70-100 days",
    notes: "Placeholder data for EP-8.",
    thresholds: [
      {
        label: "Light Threshold is",
        value: "Optimal",
        color: "#222",
        bg: "#f5f5f5",
        icon: "☀️",
      },
      {
        label: "Water Threshold is",
        value: "Optimal",
        color: "#222",
        bg: "#fff",
        icon: "💧",
      },
    ],
    actuator: "Override Actuator",
    readings: [
      { label: "Temp", value: "24°C" },
      { label: "Humidity", value: "68%" },
      { label: "Moisture", value: "75%" },
      { label: "Light", value: "70%" },
      { label: "Wind", value: "3 m/s" },
    ],
  },
};

export default function PlantProfile() {
  const { plant } = useLocalSearchParams();
  const router = useRouter();
  console.log("Plant param:", plant);
  const plantKey = typeof plant === "string" ? plant.trim().toUpperCase() : "";
  const data = plantData[plantKey];

  if (!data) {
    return (
      <View style={styles.container}>
        <Header title="Plant Not Found" showBackButton={true} />
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Plant not found</Text>
        </View>
      </View>
    );
  }

  // Custom breadcrumbs for plant profile page
  const customBreadcrumbs = [
    { label: "Home", route: "/" },
    { label: data.zone, route: `/plants/zone/${data.zone}` },
    { label: data.name },
  ];

  return (
    <View style={styles.container}>
      {/* Header Component */}
      <Header
        title="Plant Profile"
        showBackButton={true}
        customBreadcrumbs={customBreadcrumbs}
      />

      {/* Main Content in ScrollView */}
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Plant Card & Thresholds */}
        <View style={styles.topSection}>
          <View style={styles.plantCard}>
            <Text style={styles.plantEmoji}>{data.image}</Text>
            <Text style={styles.plantName}>{data.name}</Text>
          </View>
          <View style={styles.thresholdsContainer}>
            {data.thresholds.map((t, idx) => (
              <View
                key={idx}
                style={[styles.thresholdBox, { backgroundColor: t.bg }]}
              >
                <Text style={[styles.thresholdText, { color: t.color }]}>
                  {t.label}{" "}
                  <Text style={{ color: t.color, fontWeight: "bold" }}>
                    {t.value}
                  </Text>
                </Text>
                {t.icon === "☀️" && (
                  <Ionicons
                    name="sunny"
                    size={22}
                    color="#f7b731"
                    style={styles.thresholdIcon}
                  />
                )}
                {t.icon === "💧" && (
                  <Ionicons
                    name="water"
                    size={22}
                    color="#45aaf2"
                    style={styles.thresholdIcon}
                  />
                )}
              </View>
            ))}
            <TouchableOpacity style={styles.actuatorBtn}>
              <Text style={styles.actuatorText}>{data.actuator}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Info Cards */}
        <View style={styles.infoCardsContainer}>
          <View style={styles.infoCard}>
            <Text style={styles.infoLabel}>Date Planted</Text>
            <Text style={styles.infoValue}>{data.datePlanted}</Text>
            <Text style={styles.infoLabel}>Optimal Moisture</Text>
            <Text style={styles.infoValue}>{data.optimalMoisture}</Text>
            <Text style={styles.infoLabel}>Optimal Light Level</Text>
            <Text style={styles.infoValue}>{data.optimalLight}</Text>
            <Text style={styles.infoLabel}>Optimal Temp.</Text>
            <Text style={styles.infoValue}>{data.optimalTemp}</Text>
          </View>
          <View style={styles.infoCard}>
            <Text style={styles.infoLabel}>Plant Info</Text>
            <Text style={styles.infoSubLabel}>Type</Text>
            <Text style={styles.infoValue}>{data.type}</Text>
            <Text style={styles.infoSubLabel}>Growth Time</Text>
            <Text style={styles.infoValue}>{data.growthTime}</Text>
            <Text style={styles.infoSubLabel}>Notes:</Text>
            <Text style={styles.infoValue}>{data.notes}</Text>
          </View>
        </View>

        {/* Sensor Readings */}
        <View style={styles.readingsContainer}>
          <Text style={styles.readingsTitle}>Current Readings</Text>
          <View style={styles.readingsRow}>
            {data.readings.map((r, idx) => (
              <View key={idx} style={styles.readingBox}>
                <Text style={styles.readingLabel}>{r.label}</Text>
                <Text style={styles.readingValue}>{r.value}</Text>
              </View>
            ))}
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
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 32,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    fontSize: 18,
    color: "#666",
  },
  topSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 20,
    marginBottom: 20,
  },
  plantCard: {
    width: 130,
    height: 170,
    backgroundColor: "#fff",
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.07,
    shadowRadius: 6,
    elevation: 3,
  },
  plantEmoji: {
    fontSize: 48,
  },
  plantName: {
    fontWeight: "bold",
    fontSize: 16,
    marginTop: 8,
    textAlign: "center",
    color: "#333",
  },
  thresholdsContainer: {
    flex: 1,
    marginLeft: 12,
  },
  thresholdBox: {
    position: "relative",
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    minWidth: 140,
    alignItems: "flex-start",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
  },
  thresholdText: {
    fontSize: 14,
    fontWeight: "500",
  },
  thresholdIcon: {
    position: "absolute",
    right: 12,
    top: 12,
  },
  actuatorBtn: {
    backgroundColor: "#27ae60",
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
    marginTop: 6,
  },
  actuatorText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  infoCardsContainer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  infoCard: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 6,
    shadowColor: "#000",
    shadowOpacity: 0.07,
    shadowRadius: 6,
    elevation: 2,
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
  readingsContainer: {
    paddingHorizontal: 20,
  },
  readingsTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#174d3c",
    marginBottom: 12,
  },
  readingsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.07,
    shadowRadius: 6,
    elevation: 2,
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
