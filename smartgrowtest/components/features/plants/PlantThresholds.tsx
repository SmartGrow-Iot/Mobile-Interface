// components/features/plants/PlantThresholds.tsx
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { PlantThreshold } from "../../../types/Plant";

type PlantThresholdsProps = {
  thresholds: PlantThreshold[];
  actuatorText: string;
  onActuatorPress?: () => void;
};

export function PlantThresholds({
  thresholds,
  actuatorText,
  onActuatorPress,
}: PlantThresholdsProps) {
  const getIconName = (icon: string): keyof typeof Ionicons.glyphMap => {
    switch (icon) {
      case "☀️":
        return "sunny";
      case "💧":
        return "water";
      case "🌡️":
        return "thermometer-outline";
      default:
        return "information-circle-outline";
    }
  };

  const getIconColor = (icon: string): string => {
    switch (icon) {
      case "☀️":
        return "#f7b731";
      case "💧":
        return "#45aaf2";
      case "🌡️":
        return "#e74c3c";
      default:
        return "#666";
    }
  };

  return (
    <View style={styles.container}>
      {thresholds.map((threshold, idx) => (
        <View
          key={idx}
          style={[styles.thresholdBox, { backgroundColor: threshold.bg }]}
        >
          <Text style={[styles.thresholdText, { color: threshold.color }]}>
            {threshold.label}{" "}
            <Text style={{ color: threshold.color, fontWeight: "bold" }}>
              {threshold.value}
            </Text>
          </Text>
          <Ionicons
            name={getIconName(threshold.icon)}
            size={22}
            color={getIconColor(threshold.icon)}
            style={styles.thresholdIcon}
          />
        </View>
      ))}
      <TouchableOpacity style={styles.actuatorBtn} onPress={onActuatorPress}>
        <Text style={styles.actuatorText}>{actuatorText}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
});
