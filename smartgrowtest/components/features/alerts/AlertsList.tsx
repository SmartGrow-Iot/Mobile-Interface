// components/features/alerts/AlertsList.tsx
import React from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import { AlertCard } from "./AlertCard"; 
import { Alert } from "../../../types/Alert";

type AlertsListProps = {
  alerts: Alert[];
  title?: string;
  onAlertPress?: (alert: Alert) => void;
  onAlertDismiss?: (alert: Alert) => void;
  maxItems?: number;
  showEmpty?: boolean;
};

export function AlertsList({
  alerts,
  title = "Alerts",
  onAlertPress,
  onAlertDismiss,
  maxItems,
  showEmpty = true,
}: AlertsListProps) {
  const displayAlerts = maxItems ? alerts.slice(0, maxItems) : alerts;

  if (alerts.length === 0 && !showEmpty) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {alerts.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>No alerts at this time</Text>
          <Text style={styles.emptySubtext}>Your plants are doing well!</Text>
        </View>
      ) : (
        <FlatList
          data={displayAlerts}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <AlertCard
              alert={item}
              onPress={onAlertPress}
              onDismiss={onAlertDismiss}
            />
          )}
          showsVerticalScrollIndicator={false}
          scrollEnabled={false}
        />
      )}
      {maxItems && alerts.length > maxItems && (
        <Text style={styles.moreText}>
          +{alerts.length - maxItems} more alerts
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#174d3c",
    marginBottom: 12,
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 32,
    backgroundColor: "#f8f9fa",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#e9ecef",
    borderStyle: "dashed",
  },
  emptyText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#28a745",
    marginBottom: 4,
  },
  emptySubtext: {
    fontSize: 14,
    color: "#6c757d",
  },
  moreText: {
    textAlign: "center",
    fontSize: 14,
    color: "#666",
    fontStyle: "italic",
    marginTop: 8,
  },
});
