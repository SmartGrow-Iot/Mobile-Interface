// app/notifications.tsx - Complete implementation with force refresh
import React from "react";
import { View, StyleSheet, TouchableOpacity, Text, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import Header from "../components/Header";
import { NotificationsList } from "../components/features/notifications/NotificationsList";
import { useNotifications } from "../hooks/useNotifications";
import { Notification } from "../types/Notification";
import { TabButton } from "../components/ui/TabButton";

type NotificationFilter = "all" | "unread" | "critical";

export default function NotificationsScreen() {
  const router = useRouter();
  const {
    notifications,
    unreadCount,
    isLoading,
    markAsRead,
    dismissNotification,
    markAllAsRead,
    clearAll,
    refresh,
  } = useNotifications();

  const [filter, setFilter] = React.useState<NotificationFilter>("all");

  const filteredNotifications = notifications.filter((notification) => {
    switch (filter) {
      case "unread":
        return notification.status === "unread";
      case "critical":
        return notification.priority === "critical";
      default:
        return notification.status !== "dismissed";
    }
  });

  const handleNotificationPress = (notification: Notification) => {
    // Mark as read when pressed
    if (notification.status === "unread") {
      markAsRead(notification.id);
    }

    // Navigate based on notification type
    if (notification.plantId) {
      router.push(`/plants/${notification.plantId}`);
    } else if (notification.sensorType) {
      router.push(`/sensors/${notification.sensorType}`);
    }
  };

  const handleNotificationDismiss = (notification: Notification) => {
    dismissNotification(notification.id);
  };

  const handleMarkAllAsRead = () => {
    if (unreadCount > 0) {
      markAllAsRead();
    }
  };

  const handleClearAll = () => {
    Alert.alert(
      "Clear All Notifications",
      "Are you sure you want to clear all notifications? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Clear All", style: "destructive", onPress: clearAll },
      ]
    );
  };

  // ✨ Force refresh function (clears cache and fetches fresh data)
  const handleForceRefresh = async () => {
    console.log("🔄 Force refreshing notifications...");
    await refresh(); // This now uses the updated refresh function
  };

  const customBreadcrumbs = [
    { label: "Home", route: "/" },
    { label: "Profile", route: "/(tabs)/profile" },
    { label: "Notifications" },
  ];

  return (
    <View style={styles.container}>
      <Header
        title="Notifications"
        showBackButton={true}
        customBreadcrumbs={customBreadcrumbs}
      />

      {/* Filter Tabs */}
      <View style={styles.filterContainer}>
        <TabButton
          title="All"
          isActive={filter === "all"}
          onPress={() => setFilter("all")}
          style={styles.filterTab}
        />
        <TabButton
          title={`Unread (${unreadCount})`}
          isActive={filter === "unread"}
          onPress={() => setFilter("unread")}
          style={styles.filterTab}
        />
        <TabButton
          title="Critical"
          isActive={filter === "critical"}
          onPress={() => setFilter("critical")}
          style={styles.filterTab}
        />
      </View>

      {/* Action Buttons */}
      <View style={styles.actionBar}>
        <TouchableOpacity
          style={[
            styles.actionButton,
            unreadCount === 0 && styles.disabledButton,
          ]}
          onPress={handleMarkAllAsRead}
          disabled={unreadCount === 0}
        >
          <Ionicons
            name="checkmark-done"
            size={18}
            color={unreadCount === 0 ? "#999" : "#174d3c"}
          />
          <Text
            style={[
              styles.actionButtonText,
              unreadCount === 0 && styles.disabledText,
            ]}
          >
            Mark All Read
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.refreshButton]}
          onPress={handleForceRefresh}
          disabled={isLoading}
        >
          <Ionicons
            name={isLoading ? "sync" : "refresh-outline"}
            size={18}
            color={isLoading ? "#999" : "#2196F3"}
          />
          <Text
            style={[
              styles.actionButtonText,
              { color: isLoading ? "#999" : "#2196F3" },
            ]}
          >
            {isLoading ? "Refreshing..." : "Refresh"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.actionButton,
            notifications.length === 0 && styles.disabledButton,
          ]}
          onPress={handleClearAll}
          disabled={notifications.length === 0}
        >
          <Ionicons
            name="trash-outline"
            size={18}
            color={notifications.length === 0 ? "#999" : "#ff4444"}
          />
          <Text
            style={[
              styles.actionButtonText,
              { color: notifications.length === 0 ? "#999" : "#ff4444" },
            ]}
          >
            Clear All
          </Text>
        </TouchableOpacity>
      </View>

      {/* Notifications List */}
      <NotificationsList
        notifications={filteredNotifications}
        onNotificationPress={handleNotificationPress}
        onNotificationDismiss={handleNotificationDismiss}
        isRefreshing={isLoading}
        onRefresh={handleForceRefresh}
      />

      {/* Debug Info in Development */}
      {__DEV__ && (
        <View style={styles.debugContainer}>
          <Text style={styles.debugText}>
            📊 Debug: {notifications.length} notifications |
            {isLoading ? " Loading..." : " Ready"} | Unread: {unreadCount}
          </Text>
          <Text style={styles.debugSubText}>
            Pull down to force refresh or use refresh button
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f8f8",
  },
  filterContainer: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  filterTab: {
    flex: 1,
    marginHorizontal: 4,
  },
  actionBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 8,
    backgroundColor: "#f8f8f8",
    flex: 1,
    marginHorizontal: 3,
    justifyContent: "center",
    minHeight: 40,
  },
  refreshButton: {
    backgroundColor: "#e3f2fd",
  },
  disabledButton: {
    backgroundColor: "#f0f0f0",
    opacity: 0.6,
  },
  actionButtonText: {
    marginLeft: 6,
    fontSize: 12,
    fontWeight: "500",
    color: "#174d3c",
  },
  disabledText: {
    color: "#999",
  },
  debugContainer: {
    backgroundColor: "#e8f5e8",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: "#d0d0d0",
  },
  debugText: {
    fontSize: 11,
    color: "#174d3c",
    fontFamily: "monospace",
    marginBottom: 2,
  },
  debugSubText: {
    fontSize: 10,
    color: "#666",
    fontFamily: "monospace",
  },
});
