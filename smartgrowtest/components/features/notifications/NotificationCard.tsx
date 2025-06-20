// components/features/notifications/NotificationCard.tsx
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Notification } from "../../../types/Notification";
import { formatTimeAgo } from "../../../utils/dateUtils";

type NotificationCardProps = {
  notification: Notification;
  onPress?: (notification: Notification) => void;
  onDismiss?: (notification: Notification) => void;
  showDismiss?: boolean;
};

export function NotificationCard({
  notification,
  onPress,
  onDismiss,
  showDismiss = true,
}: NotificationCardProps) {
  const getIcon = () => {
    switch (notification.type) {
      case "sensor_alert":
      case "threshold_exceeded":
        return "warning-outline";
      case "actuator_action":
        return "settings-outline";
      case "system_update":
        return "information-circle-outline";
      case "maintenance":
        return "build-outline";
      default:
        return "notifications-outline";
    }
  };

  const getPriorityColor = () => {
    switch (notification.priority) {
      case "critical":
        return "#ff4444";
      case "high":
        return "#ff9800";
      case "medium":
        return "#2196f3";
      case "low":
        return "#4caf50";
      default:
        return "#666";
    }
  };

  const getBackgroundColor = () => {
    if (notification.status === "unread") {
      return "#f8f9fa";
    }
    return "#fff";
  };

  return (
    <TouchableOpacity
      style={[
        styles.container,
        { backgroundColor: getBackgroundColor() },
        notification.status === "unread" && styles.unread,
      ]}
      onPress={() => onPress?.(notification)}
      activeOpacity={0.7}
    >
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <Ionicons name={getIcon()} size={24} color={getPriorityColor()} />
            {notification.priority === "critical" && (
              <View
                style={[
                  styles.priorityDot,
                  { backgroundColor: getPriorityColor() },
                ]}
              />
            )}
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.title} numberOfLines={1}>
              {notification.title}
            </Text>
            <Text style={styles.timestamp}>
              {formatTimeAgo(notification.timestamp)}
            </Text>
          </View>
          {showDismiss && (
            <TouchableOpacity
              style={styles.dismissButton}
              onPress={() => onDismiss?.(notification)}
            >
              <Ionicons name="close" size={20} color="#999" />
            </TouchableOpacity>
          )}
        </View>
        <Text style={styles.message} numberOfLines={2}>
          {notification.message}
        </Text>
        {notification.metadata && (
          <View style={styles.metadata}>
            {notification.metadata.currentValue && (
              <Text style={styles.metadataText}>
                Current: {notification.metadata.currentValue}
                {notification.metadata.unit}
              </Text>
            )}
            {notification.metadata.actionTaken && (
              <Text style={styles.metadataText}>
                Action: {notification.metadata.actionTaken}
              </Text>
            )}
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: "#f0f0f0",
  },
  unread: {
    borderLeftWidth: 4,
    borderLeftColor: "#174d3c",
  },
  content: {
    padding: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  iconContainer: {
    position: "relative",
    marginRight: 12,
  },
  priorityDot: {
    position: "absolute",
    top: -2,
    right: -2,
    width: 8,
    height: 8,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#fff",
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 2,
  },
  timestamp: {
    fontSize: 12,
    color: "#999",
  },
  dismissButton: {
    padding: 4,
  },
  message: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
    marginBottom: 8,
  },
  metadata: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  metadataText: {
    fontSize: 12,
    color: "#888",
    backgroundColor: "#f5f5f5",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
});
