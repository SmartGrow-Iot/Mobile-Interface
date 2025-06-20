

// components/features/alerts/AlertCard.tsx
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {Alert} from "../../../types/Alert";


type AlertCardProps = {
  alert: Alert;
  onPress?: (alert: Alert) => void;
  onDismiss?: (alert: Alert) => void;
};

export function AlertCard({ alert, onPress, onDismiss }: AlertCardProps) {
  const getIconName = (iconType: string): keyof typeof Ionicons.glyphMap => {
    switch (iconType) {
      case "light":
        return "sunny-outline";
      case "water":
        return "water-outline";
      case "temperature":
        return "thermometer-outline";
      case "humidity":
        return "cloudy-outline";
      default:
        return "warning-outline";
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "low":
        return "#2196F3";
      case "medium":
        return "#FF9800";
      case "high":
        return "#FF5722";
      case "critical":
        return "#F44336";
      default:
        return "#666";
    }
  };

  return (
    <View style={[styles.alertBox, { backgroundColor: alert.color + "20" }]}>
      <View style={styles.alertContent}>
        <View style={styles.iconContainer}>
          <Ionicons
            name={getIconName(alert.icon)}
            size={24}
            color={alert.color}
            style={styles.alertIcon}
          />
          <View
            style={[
              styles.severityIndicator,
              { backgroundColor: getSeverityColor(alert.severity) },
            ]}
          />
        </View>
        <Text style={styles.alertText}>{alert.text}</Text>
      </View>
      <View style={styles.actions}>
        {onPress && (
          <TouchableOpacity
            style={styles.alertAction}
            onPress={() => onPress(alert)}
          >
            <Text style={styles.alertActionText}>View</Text>
          </TouchableOpacity>
        )}
        {onDismiss && (
          <TouchableOpacity
            style={[styles.alertAction, styles.dismissAction]}
            onPress={() => onDismiss(alert)}
          >
            <Ionicons name="close" size={16} color="#666" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  alertBox: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  alertContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  iconContainer: {
    position: "relative",
    marginRight: 12,
  },
  alertIcon: {
    // Icon styles handled by Ionicons
  },
  severityIndicator: {
    position: "absolute",
    top: -2,
    right: -2,
    width: 8,
    height: 8,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#fff",
  },
  alertText: {
    fontSize: 15,
    color: "#333",
    fontWeight: "500",
    flex: 1,
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
  },
  alertAction: {
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginLeft: 8,
  },
  dismissAction: {
    paddingHorizontal: 8,
    backgroundColor: "transparent",
  },
  alertActionText: {
    color: "#174d3c",
    fontWeight: "600",
  },
});
