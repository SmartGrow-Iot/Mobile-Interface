// components/ui/Badge.tsx
import React from "react";
import { View, Text, StyleSheet, ViewStyle } from "react-native";

type BadgeProps = {
  children: React.ReactNode;
  variant?: "success" | "warning" | "error" | "info" | "default";
  size?: "small" | "medium" | "large";
  style?: ViewStyle;
};

export function Badge({
  children,
  variant = "default",
  size = "medium",
  style,
}: BadgeProps) {
  return (
    <View style={[styles.badge, styles[variant], styles[size], style]}>
      <Text
        style={[styles.text, styles[`${variant}Text`], styles[`${size}Text`]]}
      >
        {children}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  // Variants
  default: {
    backgroundColor: "#f0f0f0",
  },
  success: {
    backgroundColor: "#4CAF50",
  },
  warning: {
    backgroundColor: "#FF9800",
  },
  error: {
    backgroundColor: "#FF5252",
  },
  info: {
    backgroundColor: "#2196F3",
  },
  // Sizes
  small: {
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  medium: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  large: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  // Text styles
  text: {
    fontWeight: "600",
  },
  defaultText: {
    color: "#666",
  },
  successText: {
    color: "#fff",
  },
  warningText: {
    color: "#fff",
  },
  errorText: {
    color: "#fff",
  },
  infoText: {
    color: "#fff",
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
