// components/ui/TabButton.tsx
import React from "react";
import { TouchableOpacity, Text, StyleSheet, ViewStyle } from "react-native";

type TabButtonProps = {
  title: string;
  isActive: boolean;
  onPress: () => void;
  style?: ViewStyle;
};

export function TabButton({ title, isActive, onPress, style }: TabButtonProps) {
  return (
    <TouchableOpacity
      style={[styles.tab, isActive && styles.activeTab, style]}
      onPress={onPress}
    >
      <Text style={[styles.tabText, isActive && styles.activeTabText]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  tab: {
    flex: 1,
    backgroundColor: "#fff",
    paddingVertical: 12,
    marginHorizontal: 6,
    borderRadius: 12,
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  activeTab: {
    backgroundColor: "#174d3c",
  },
  tabText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#174d3c",
  },
  activeTabText: {
    color: "#fff",
  },
});
