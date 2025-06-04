// components/ui/StatItem.tsx
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

type StatItemProps = {
  icon: keyof typeof Ionicons.glyphMap;
  iconColor: string;
  value: string;
  label?: string;
  size?: "small" | "medium" | "large";
};

export function StatItem({
  icon,
  iconColor,
  value,
  label,
  size = "medium",
}: StatItemProps) {
  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Ionicons
          name={icon}
          size={size === "small" ? 16 : size === "large" ? 24 : 20}
          color={iconColor}
        />
        <Text style={[styles.value, styles[`${size}Value`]]}>{value}</Text>
      </View>
      {label && (
        <Text style={[styles.label, styles[`${size}Label`]]}>{label}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
  },
  iconContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  value: {
    marginLeft: 4,
    color: "#666",
    fontWeight: "500",
  },
  label: {
    marginTop: 2,
    color: "#888",
    fontSize: 10,
  },
  smallValue: {
    fontSize: 12,
  },
  mediumValue: {
    fontSize: 14,
  },
  largeValue: {
    fontSize: 16,
  },
  smallLabel: {
    fontSize: 8,
  },
  mediumLabel: {
    fontSize: 10,
  },
  largeLabel: {
    fontSize: 12,
  },
});
