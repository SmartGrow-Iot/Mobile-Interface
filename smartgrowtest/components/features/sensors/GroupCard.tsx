// components/features/sensors/GroupCard.tsx
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { GroupData } from "../../../types/Sensor";
import { Card } from "../../ui/Card";
import { Badge } from "../../ui/Badge";

type GroupCardProps = {
  group: GroupData;
  onPress?: (group: GroupData) => void;
  showZone?: boolean;
  showEsp32Id?: boolean;
};

export function GroupCard({
  group,
  onPress,
  showZone = false,
  showEsp32Id = true,
}: GroupCardProps) {
  return (
    <TouchableOpacity onPress={() => onPress?.(group)} activeOpacity={0.7}>
      <Card style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.groupIcon}>{group.icon}</Text>

          <View style={styles.infoContainer}>
            <Text style={styles.groupName}>{group.group}</Text>
            {showZone && group.zone && (
              <Text style={styles.zoneText}>{group.zone}</Text>
            )}
            {showEsp32Id && group.esp32Id && (
              <Text style={styles.esp32Text}>ESP32: {group.esp32Id}</Text>
            )}
          </View>

          <View style={styles.valueContainer}>
            <Text
              style={[
                styles.groupValue,
                group.critical && styles.criticalValue,
              ]}
            >
              {group.value}
            </Text>
            {group.critical && (
              <Badge variant="error" size="small">
                Critical
              </Badge>
            )}
          </View>
        </View>

        {group.lastUpdated && (
          <Text style={styles.lastUpdated}>
            Updated {group.lastUpdated.toLocaleTimeString()}
          </Text>
        )}
      </Card>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 12,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
  },
  groupIcon: {
    fontSize: 32,
    marginRight: 16,
  },
  infoContainer: {
    flex: 1,
  },
  groupName: {
    fontWeight: "600",
    fontSize: 18,
    color: "#333",
  },
  zoneText: {
    fontSize: 12,
    color: "#666",
    marginTop: 2,
  },
  esp32Text: {
    fontSize: 11,
    color: "#888",
    marginTop: 2,
    fontFamily: "monospace",
  },
  valueContainer: {
    alignItems: "flex-end",
  },
  groupValue: {
    fontSize: 16,
    color: "#666",
    fontWeight: "500",
  },
  criticalValue: {
    color: "#ff4444",
    fontWeight: "bold",
  },
  lastUpdated: {
    fontSize: 10,
    color: "#999",
    textAlign: "center",
    marginTop: 8,
    paddingHorizontal: 20,
  },
});
