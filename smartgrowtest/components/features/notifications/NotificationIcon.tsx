// components/features/notifications/NotificationIcon.tsx
import React from "react";
import { TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { NotificationBadge } from "./NotificationBadge";

type NotificationIconProps = {
  unreadCount: number;
  onPress: () => void;
  iconColor?: string;
  iconSize?: number;
};

export function NotificationIcon({
  unreadCount,
  onPress,
  iconColor = "#174d3c",
  iconSize = 26,
}: NotificationIconProps) {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <Ionicons
        name="notifications-outline"
        size={iconSize}
        color={iconColor}
      />
      <NotificationBadge count={unreadCount} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "relative",
    padding: 8,
  },
});
