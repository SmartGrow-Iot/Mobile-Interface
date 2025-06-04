// app/actuator/override.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  TextInput,
  Alert,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import Header from "../../components/Header";
import { Card } from "../../components/ui/Card";

type ThresholdType = "watering" | "wind" | "light";

type ThresholdSettings = {
  watering: { value: string; unit: string };
  wind: { value: string; unit: string };
  light: { value: string; unit: string };
};

export default function ActuatorOverride() {
  const router = useRouter();
  const { zone, plant, plantId } = useLocalSearchParams();

  // Modal state
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedThreshold, setSelectedThreshold] =
    useState<ThresholdType | null>(null);

  // Threshold values
  const [thresholds, setThresholds] = useState<ThresholdSettings>({
    watering: { value: "200", unit: "ml" },
    wind: { value: "100", unit: "s" },
    light: { value: "100", unit: "s" },
  });

  // Input state for modal
  const [inputValue, setInputValue] = useState("");

  // Get zone name from URL params
  const zoneName = typeof zone === "string" ? zone : "Zone A";
  const plantName = typeof plant === "string" ? plant : "";

  // Actuator configurations
  const actuatorConfigs = [
    {
      type: "watering" as ThresholdType,
      title: "Watering",
      icon: "water-outline" as const,
      color: "#45aaf2",
      backgroundColor: "#e3f2fd",
    },
    {
      type: "wind" as ThresholdType,
      title: "Wind",
      icon: "leaf-outline" as const,
      color: "#4caf50",
      backgroundColor: "#e8f5e9",
    },
    {
      type: "light" as ThresholdType,
      title: "Light",
      icon: "sunny-outline" as const,
      color: "#ff9800",
      backgroundColor: "#fff3e0",
    },
  ];

  // Handle actuator button press
  const handleActuatorPress = (type: ThresholdType) => {
    setSelectedThreshold(type);
    setInputValue(thresholds[type].value);
    setModalVisible(true);
  };

  // Handle threshold setting options
  const handleThresholdOption = (option: string) => {
    if (!selectedThreshold) return;

    switch (option) {
      case "duration":
        // For wind and light - set by duration
        handleSaveThreshold();
        break;
      case "volume":
        // For watering - set by volume
        handleSaveThreshold();
        break;
      case "current_co2":
        // Set by current CO2 level
        setInputValue("420"); // Example current CO2 level
        break;
      case "current_humidity":
        // Set by current humidity
        setInputValue("60"); // Example current humidity
        break;
      case "current_light":
        // Set by current light intensity
        setInputValue("70"); // Example current light level
        break;
      case "humidity_range":
        // Set by humidity range
        Alert.alert("Humidity Range", "Set min and max humidity values");
        break;
      case "co2_range":
        // Set by CO2 range
        Alert.alert("CO2 Range", "Set min and max CO2 values");
        break;
      case "light_range":
        // Set by light intensity range
        Alert.alert("Light Range", "Set min and max light intensity values");
        break;
      case "current_moisture":
        // Set by current moisture
        setInputValue("40"); // Example current moisture
        break;
      case "moisture_range":
        // Set by moisture range
        Alert.alert("Moisture Range", "Set min and max moisture values");
        break;
    }
  };

  // Save threshold value
  const handleSaveThreshold = () => {
    if (!selectedThreshold || !inputValue.trim()) {
      Alert.alert("Error", "Please enter a valid value");
      return;
    }

    setThresholds((prev) => ({
      ...prev,
      [selectedThreshold]: {
        ...prev[selectedThreshold],
        value: inputValue,
      },
    }));

    Alert.alert(
      "Success",
      `${
        selectedThreshold.charAt(0).toUpperCase() + selectedThreshold.slice(1)
      } threshold updated to ${inputValue}${thresholds[selectedThreshold].unit}`
    );

    setModalVisible(false);
    setSelectedThreshold(null);
    setInputValue("");
  };

  // Cancel modal
  const handleCancel = () => {
    setModalVisible(false);
    setSelectedThreshold(null);
    setInputValue("");
  };

  // Get modal options based on threshold type
  const getModalOptions = () => {
    switch (selectedThreshold) {
      case "watering":
        return [
          { key: "volume", label: "Set by volume", primary: true },
          { key: "current_moisture", label: "Set by current moisture" },
          { key: "moisture_range", label: "Set by moisture range (min - max)" },
        ];
      case "wind":
        return [
          { key: "duration", label: "Set by duration", primary: true },
          { key: "current_co2", label: "Set by current CO2 level" },
          { key: "current_humidity", label: "Set by current humidity" },
          { key: "humidity_range", label: "Set by humidity range (min - max)" },
          { key: "co2_range", label: "Set by CO2 level range (min - max)" },
        ];
      case "light":
        return [
          { key: "duration", label: "Set by current duration", primary: true },
          { key: "current_light", label: "Set by current light intensity" },
          {
            key: "light_range",
            label: "Set by light intensity range (min - max)",
          },
        ];
      default:
        return [];
    }
  };

  // Get current sensor readings
  const getCurrentReadings = () => ({
    temp: "28°C",
    humidity: "60%",
    moisture: "40%",
    light: "70%",
    wind: "5 m/s",
  });

  const readings = getCurrentReadings();

  // Custom breadcrumbs
  const customBreadcrumbs = [
    { label: "Home", route: "/" },
    { label: zoneName, route: `/plants/zone/${zoneName}` },
    ...(plantName ? [{ label: plantName, route: `/plants/${plantId}` }] : []),
    { label: "Actuator Override" },
  ];

  return (
    <View style={styles.container}>
      <Header
        title="Actuator Override"
        showBackButton={true}
        customBreadcrumbs={customBreadcrumbs}
      />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Zone Info Card */}
        <Card style={styles.zoneCard}>
          <View style={styles.zoneHeader}>
            <View style={styles.zoneIconContainer}>
              <Text style={styles.zoneIcon}>
                {zoneName.includes("A")
                  ? "A"
                  : zoneName.includes("B")
                  ? "B"
                  : zoneName.includes("C")
                  ? "C"
                  : "D"}
              </Text>
            </View>
            <View style={styles.zoneInfo}>
              <Text style={styles.zoneName}>{zoneName}</Text>
              <Text style={styles.zoneSubtext}>Available Plants</Text>
              <View style={styles.plantList}>
                <Text style={styles.plantItem}>• Chilli</Text>
                <Text style={styles.plantItem}>• Egg</Text>
              </View>
            </View>
          </View>
        </Card>

        {/* Current Readings Card */}
        <Card style={styles.readingsCard}>
          <View style={styles.readingsHeader}>
            <Text style={styles.readingsTitle}>Current Readings</Text>
          </View>
          <View style={styles.readingsGrid}>
            <View style={styles.readingItem}>
              <Text style={styles.readingLabel}>Temp</Text>
              <Text style={styles.readingValue}>{readings.temp}</Text>
            </View>
            <View style={styles.readingItem}>
              <Text style={styles.readingLabel}>Humidity</Text>
              <Text style={styles.readingValue}>{readings.humidity}</Text>
            </View>
            <View style={styles.readingItem}>
              <Text style={styles.readingLabel}>Moisture</Text>
              <Text style={styles.readingValue}>{readings.moisture}</Text>
            </View>
            <View style={styles.readingItem}>
              <Text style={styles.readingLabel}>Light</Text>
              <Text style={styles.readingValue}>{readings.light}</Text>
            </View>
            <View style={styles.readingItem}>
              <Text style={styles.readingLabel}>Wind</Text>
              <Text style={styles.readingValue}>{readings.wind}</Text>
            </View>
          </View>
        </Card>

        {/* Actuator Controls */}
        <View style={styles.actuatorSection}>
          {actuatorConfigs.map((config) => (
            <TouchableOpacity
              key={config.type}
              style={[
                styles.actuatorButton,
                { backgroundColor: config.backgroundColor },
              ]}
              onPress={() => handleActuatorPress(config.type)}
              activeOpacity={0.7}
            >
              <View
                style={[
                  styles.actuatorIconContainer,
                  { backgroundColor: config.color },
                ]}
              >
                <Ionicons name={config.icon} size={32} color="#fff" />
              </View>
              <View style={styles.actuatorInfo}>
                <Text style={styles.actuatorTitle}>{config.title}</Text>
                <Text style={styles.actuatorSubtitle}>
                  {config.type === "watering"
                    ? "Watering Threshold: "
                    : config.type === "wind"
                    ? "Wind Threshold: "
                    : "Light Threshold: "}
                  <Text style={styles.thresholdValue}>
                    {thresholds[config.type].value}
                    {thresholds[config.type].unit}
                  </Text>
                </Text>
                <TouchableOpacity
                  style={styles.adjustButton}
                  onPress={() => handleActuatorPress(config.type)}
                >
                  <Text style={styles.adjustButtonText}>Adjust threshold</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Threshold Setting Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={handleCancel}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Threshold setting</Text>
              <TouchableOpacity onPress={handleCancel}>
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>

            <View style={styles.modalContent}>
              {/* Input field for threshold value */}
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>
                  {selectedThreshold === "watering"
                    ? "Watering threshold:"
                    : selectedThreshold === "wind"
                    ? "Wind threshold:"
                    : "Light threshold:"}
                </Text>
                <View style={styles.inputWrapper}>
                  <TextInput
                    style={styles.thresholdInput}
                    value={inputValue}
                    onChangeText={setInputValue}
                    placeholder="Enter value"
                    keyboardType="numeric"
                  />
                  <Text style={styles.unitLabel}>
                    {selectedThreshold
                      ? thresholds[selectedThreshold].unit
                      : ""}
                  </Text>
                </View>
              </View>

              {/* Option buttons */}
              <View style={styles.optionsContainer}>
                {getModalOptions().map((option, index) => (
                  <TouchableOpacity
                    key={option.key}
                    style={[
                      styles.optionButton,
                      option.primary && styles.primaryOptionButton,
                    ]}
                    onPress={() => handleThresholdOption(option.key)}
                  >
                    <Text
                      style={[
                        styles.optionButtonText,
                        option.primary && styles.primaryOptionButtonText,
                      ]}
                    >
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
        </View>
      </Modal>
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
    padding: 16,
  },
  zoneCard: {
    marginBottom: 16,
    padding: 20,
  },
  zoneHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  zoneIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#ff4444",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  zoneIcon: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#fff",
  },
  zoneInfo: {
    flex: 1,
  },
  zoneName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  zoneSubtext: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  plantList: {
    flexDirection: "row",
    gap: 16,
  },
  plantItem: {
    fontSize: 14,
    color: "#333",
  },
  readingsCard: {
    marginBottom: 24,
    padding: 20,
  },
  readingsHeader: {
    marginBottom: 16,
  },
  readingsTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  readingsGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    flexWrap: "wrap",
  },
  readingItem: {
    alignItems: "center",
    minWidth: "18%",
  },
  readingLabel: {
    fontSize: 12,
    color: "#666",
    marginBottom: 4,
    fontWeight: "600",
  },
  readingValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  actuatorSection: {
    gap: 16,
  },
  actuatorButton: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  actuatorIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  actuatorInfo: {
    flex: 1,
  },
  actuatorTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  actuatorSubtitle: {
    fontSize: 14,
    color: "#666",
    marginBottom: 12,
  },
  thresholdValue: {
    fontWeight: "600",
    color: "#333",
  },
  adjustButton: {
    backgroundColor: "#27ae60",
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignSelf: "flex-start",
  },
  adjustButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContainer: {
    backgroundColor: "#fff",
    borderRadius: 20,
    width: "100%",
    maxWidth: 400,
    maxHeight: "80%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  modalContent: {
    padding: 20,
  },
  inputContainer: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 12,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 12,
    backgroundColor: "#f8f8f8",
  },
  thresholdInput: {
    flex: 1,
    padding: 16,
    fontSize: 16,
    color: "#333",
  },
  unitLabel: {
    paddingRight: 16,
    fontSize: 16,
    color: "#666",
    fontWeight: "500",
  },
  optionsContainer: {
    gap: 12,
  },
  optionButton: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 25,
    padding: 16,
    alignItems: "center",
    marginBottom: 8,
  },
  primaryOptionButton: {
    backgroundColor: "#174d3c",
    borderColor: "#174d3c",
  },
  optionButtonText: {
    fontSize: 16,
    color: "#333",
    fontWeight: "500",
  },
  primaryOptionButtonText: {
    color: "#fff",
    fontWeight: "600",
  },
});
