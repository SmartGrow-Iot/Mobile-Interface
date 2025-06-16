// app/actuator/override.tsx
import React, { useState, useEffect } from "react";
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
import { apiRequest } from "@/services/api";

type ThresholdType = "watering" | "fan" | "light";

type ThresholdSettings = {
  watering: { value: string; unit: string[] };
  fan: { value: string; unit: string[] };
  light: { value: string; unit: string[] };
};

export default function ActuatorOverride() {
  const { zone, plant, plantId } = useLocalSearchParams();
  
  // User Detail
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchUserInfo = async () => {
        // TODO: Fetch User Detail
      };
      fetchUserInfo();
    }, []); // Run once when screen is opened


  // Modal state
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedThreshold, setSelectedThreshold] =
    useState<ThresholdType | null>(null);
  const [enableIndex, setEnableIndex] = useState(0); // For adjusting SELECTED OPTION in card popup
  const [selectedUnitIndex, setSelectedUnitIndex] = useState([0,0,0]); // For adjusting THRESHOLD DATA in each actuator card


  // Threshold values
  const [thresholds, setThresholds] = useState<ThresholdSettings>({
    watering: { value: "200", unit: ["ml", "%", "%"] },
    fan: { value: "100", unit: ["s", "%", "%", "%", "%"] },
    light: { value: "100", unit: ["s", "%", "%"] },
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
      index: 0,
    },
    {
      type: "fan" as ThresholdType,
      title: "Fan",
      icon: "leaf-outline" as const,
      color: "#4caf50",
      backgroundColor: "#e8f5e9",
      index: 1,
    },
    {
      type: "light" as ThresholdType,
      title: "Light",
      icon: "sunny-outline" as const,
      color: "#ff9800",
      backgroundColor: "#fff3e0",
      index: 2,
    },
  ];

  // Handle actuator button press
  const handleActuatorPress = (type: ThresholdType) => {
    setEnableIndex(0)
    setSelectedThreshold(type);
    setInputValue(thresholds[type].value);
    setModalVisible(true);
  };

  // Handle threshold setting options
  const handleThresholdOption = (option: string) => {
    if (!selectedThreshold) return;

    switch (option) {
      case "fan_duration":
        // For Fan - set by duration
        if(enableIndex!=0){setEnableIndex(0);return;}
        handleSaveThreshold();
        setSelectedUnitIndex([selectedUnitIndex[0],0,selectedUnitIndex[2]]) // save unit for watering, fan, light.
        break;
      case "light_duration":
        // For light - set by duration
        if(enableIndex!=0){setEnableIndex(0);return;}
        handleSaveThreshold();
        setSelectedUnitIndex([selectedUnitIndex[0],selectedUnitIndex[1],0]) // save unit for watering, fan, light.
        break;
      case "volume":
        // For watering - set by volume
        if(enableIndex!=0){setEnableIndex(0);return;}
        handleSaveThreshold();
        setSelectedUnitIndex([0,selectedUnitIndex[1],selectedUnitIndex[2]]) // save unit for watering, fan, light.
        break;
      case "co2":
        // Set by current CO2 level
        if(enableIndex!=1){setEnableIndex(1);return;}
        // setInputValue("420"); // Example current CO2 level
        handleSaveThreshold();
        setSelectedUnitIndex([selectedUnitIndex[0], 1, selectedUnitIndex[2]])
        break;
      case "humidity":
        // Set by current humidity
        if(enableIndex!=2){setEnableIndex(2);return;}
        // setInputValue("60"); // Example current humidity
        handleSaveThreshold();
        setSelectedUnitIndex([selectedUnitIndex[0], 2, selectedUnitIndex[2]])
        break;
      case "light_intensity":
        // Set by current light intensity
        if(enableIndex!=1){setEnableIndex(1);return;}
        // setInputValue("70"); // Example current light level
        handleSaveThreshold();
        setSelectedUnitIndex([selectedUnitIndex[0], selectedUnitIndex[1], 1])
        break;
      case "humidity_range":
        // Set by humidity range
        if(enableIndex!=3){setEnableIndex(3);return;}
        // Alert.alert("Humidity Range", "Set min and max humidity values");
        handleSaveThreshold();
        setSelectedUnitIndex([selectedUnitIndex[0], 3, selectedUnitIndex[2]])
        break;
      case "co2_range":
        // Set by CO2 range
        if(enableIndex!=4){setEnableIndex(4);return;}
        // Alert.alert("CO2 Range", "Set min and max CO2 values");
        handleSaveThreshold();
        setSelectedUnitIndex([selectedUnitIndex[0], 4, selectedUnitIndex[2]])
        break;
      case "light_range":
        if(enableIndex!=2){setEnableIndex(2);return;}
        // Set by light intensity range
        // Alert.alert("Light Range", "Set min and max light intensity values");
        handleSaveThreshold();
        setSelectedUnitIndex([selectedUnitIndex[0], selectedUnitIndex[1], 2])
        break;
      case "moisture":
        // Set by current moisture
        if(enableIndex!=1){setEnableIndex(1);return;}
        // setInputValue("40"); // Example current moisture
        handleSaveThreshold();
        setSelectedUnitIndex([1, selectedUnitIndex[1], selectedUnitIndex[2]])
        break;
      case "moisture_range":
        // Set by moisture range
        if(enableIndex!=2){setEnableIndex(2);return;}
        // Alert.alert("Moisture Range", "Set min and max moisture values");
        handleSaveThreshold();
        setSelectedUnitIndex([2, selectedUnitIndex[1], selectedUnitIndex[2]])
        break;
    }
  };

  // Save threshold value
  const handleSaveThreshold = async () => {
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

    const actuatorCalledInAPI = 
    selectedThreshold === "watering"
      ? "water"
      : selectedThreshold === "fan"
      ? "fan"
      : selectedThreshold === "light"
      ? "light"
      : "invalid actuator"

      const actuatorActionToDoInAPI = 
      selectedThreshold === "watering"
      ? "watering"
      : selectedThreshold === "fan"
      ? "fan_on"
      : selectedThreshold === "light"
      ? "light_on"
      : "invalid actuator"

    try {      
      console.log('Try to water: ', zone)

      const payload = {
        action: actuatorActionToDoInAPI, // e.g., "watering"
        actuatorId: "actuator-123", // Replace with actual actuator ID
        plantId: plant,
        amount: parseFloat(inputValue),
        trigger: "manual",
        triggerBy: "Test by Wan [Can be deleted]",
        timestamp: new Date().toISOString(), // current time in ISO format
      };

      console.log("Payload to be sent:", payload);

      const response = await apiRequest(`/logs/action/${actuatorCalledInAPI}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Server responded with error:", errorData);
        Alert.alert("Error", errorData.message || "Failed to send action.");
        return;
      }
      
      const responseData = await response.json();
      console.log("Water action response:", responseData);
    } catch (error) {
      console.error('Error sending water action:', error);
      Alert.alert("Error", "Failed to start override action.");
    } finally {
      setModalVisible(false);
      setSelectedThreshold(null);
      setEnableIndex(0);
      setInputValue("");
    }

    Alert.alert(
      "Success",
      `${
        selectedThreshold.charAt(0).toUpperCase() + selectedThreshold.slice(1)
      } threshold updated to ${inputValue}${thresholds[selectedThreshold].unit[enableIndex]} [STARTING OVERRIDE!]`
    );
  };

  // Cancel modal
  const handleCancel = () => {
    setModalVisible(false);
    setSelectedThreshold(null);
    setEnableIndex(0);
    setInputValue("");
  };

  // Get modal options based on threshold type
  const getModalOptions = () => {
    switch (selectedThreshold) {
      case "watering":
        return [
          { key: "volume", label: "Set by volume", primary: true },
          { key: "moisture", label: "Set by moisture" },
          // { key: "moisture_range", label: "Set by moisture range (min - max)" }, // Hold these features for now
        ];
      case "fan":
        return [
          { key: "fan_duration", label: "Set by duration", primary: true },
          { key: "co2", label: "Set by CO2 level" },
          { key: "humidity", label: "Set by humidity" },
          // { key: "humidity_range", label: "Set by humidity range (min - max)" }, // Hold these features for now
          // { key: "co2_range", label: "Set by CO2 level range (min - max)" },
        ];
      case "light":
        return [
          { key: "light_duration", label: "Set by duration", primary: true },
          { key: "light_intensity", label: "Set by light intensity" },
          {
            key: "light_range",
            // label: "Set by light intensity range (min - max)", // Hold these features for now
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
    fan: "5 m/s",
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
              <Text style={styles.readingLabel}>Fan</Text>
              <Text style={styles.readingValue}>{readings.fan}</Text>
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
                    ? "Watering Amount: "
                    : config.type === "fan"
                    ? "Fan Amount: "
                    : "Light Amount: "}
                  <Text style={styles.thresholdValue}>
                    {thresholds[config.type].value}
                    {thresholds[config.type].unit[selectedUnitIndex[config.index]]}
                  </Text>
                </Text>
                <TouchableOpacity
                  style={styles.adjustButton}
                  onPress={() => handleActuatorPress(config.type)}
                >
                  <Text style={styles.adjustButtonText}>Start Override</Text>
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
              <Text style={styles.modalTitle}>Override setting</Text>
              <TouchableOpacity onPress={handleCancel}>
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>

            <View style={styles.modalContent}>
              {/* Input field for threshold value */}
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>
                  {selectedThreshold === "watering"
                    ? "Watering amount:"
                    : selectedThreshold === "fan"
                    ? "Fan amount:"
                    : "Light amount:"}
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
                      ? thresholds[selectedThreshold].unit[enableIndex]
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
                      index == enableIndex && styles.primaryOptionButton,
                    ]}
                    onPress={() => handleThresholdOption(option.key)}
                  >
                    <Text
                      style={[
                        styles.optionButtonText,
                        index == enableIndex && styles.primaryOptionButtonText,
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
