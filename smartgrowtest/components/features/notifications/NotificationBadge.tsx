// components/features/notifications/NotificationBadge.tsx
import React from "react";
import { View, Text, StyleSheet } from "react-native";

type NotificationBadgeProps = {
  count: number;
  size?: "small" | "medium" | "large";
  color?: string;
  show?: boolean;
};

export function NotificationBadge({
  count,
  size = "medium",
  color = "#ff4444",
  show = true,
}: NotificationBadgeProps) {
  if (!show || count === 0) return null;

  const displayCount = count > 99 ? "99+" : count.toString();

  return (
    <View style={[styles.badge, styles[size], { backgroundColor: color }]}>
      <Text style={[styles.text, styles[`${size}Text`]]}>{displayCount}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 4,
    position: "absolute",
    top: -8,
    right: -8,
    borderWidth: 2,
    borderColor: "#fff",
  },
  small: {
    minWidth: 16,
    height: 16,
    borderRadius: 8,
  },
  medium: {
    minWidth: 20,
    height: 20,
    borderRadius: 10,
  },
  large: {
    minWidth: 24,
    height: 24,
    borderRadius: 12,
  },
  text: {
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
  },
  smallText: {
    fontSize: 10,
  },
  mediumText: {
    fontSize: 12,
  },
  largeText: {
    fontSize: 14,
  },
});
