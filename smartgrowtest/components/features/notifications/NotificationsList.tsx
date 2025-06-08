// components/features/notifications/NotificationsList.tsx
import React from "react";
import { View, Text, FlatList, StyleSheet, RefreshControl } from "react-native";
import { NotificationCard } from "./NotificationCard";
import { EmptyState } from "../../ui/EmptyState";
import { Notification } from "../../../types/Notification";

type NotificationsListProps = {
  notifications: Notification[];
  onNotificationPress?: (notification: Notification) => void;
  onNotificationDismiss?: (notification: Notification) => void;
  isRefreshing?: boolean;
  onRefresh?: () => void;
  emptyStateTitle?: string;
  emptyStateSubtitle?: string;
};

export function NotificationsList({
  notifications,
  onNotificationPress,
  onNotificationDismiss,
  isRefreshing = false,
  onRefresh,
  emptyStateTitle = "No notifications",
  emptyStateSubtitle = "You're all caught up!",
}: NotificationsListProps) {
  if (notifications.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <EmptyState
          icon="notifications-outline"
          title={emptyStateTitle}
          subtitle={emptyStateSubtitle}
        />
      </View>
    );
  }

  return (
    <FlatList
      data={notifications}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <NotificationCard
          notification={item}
          onPress={onNotificationPress}
          onDismiss={onNotificationDismiss}
        />
      )}
      contentContainerStyle={styles.list}
      showsVerticalScrollIndicator={false}
      refreshControl={
        onRefresh ? (
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={onRefresh}
            colors={["#174d3c"]}
            tintColor="#174d3c"
          />
        ) : undefined
      }
    />
  );
}

const styles = StyleSheet.create({
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  list: {
    padding: 16,
    paddingBottom: 32,
  },
});
