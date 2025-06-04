// components/features/sensors/GroupsList.tsx - Fixed TypeScript types
import React from "react";
import { View, Text, StyleSheet, FlatList, RefreshControl } from "react-native";
import { GroupData } from "../../../types/Sensor";
import { GroupCard } from "./GroupCard";
import { EmptyState } from "../../ui/EmptyState";

type GroupsListProps = {
  groups: GroupData[];
  onGroupPress?: (group: GroupData) => void;
  showZones?: boolean;
  title?: string;
  emptyStateMessage?: string;
  // Fix: Use the correct type for refreshControl
  refreshControl?: React.ReactElement<any>;
  // Alternative: More specific typing
  // refreshControl?: React.ComponentProps<typeof RefreshControl>;
  // Or even simpler:
  // onRefresh?: () => void;
  // refreshing?: boolean;
};

export function GroupsList({
  groups,
  onGroupPress,
  showZones = false,
  title,
  emptyStateMessage = "No sensor data available",
  refreshControl,
}: GroupsListProps) {
  if (groups.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <EmptyState
          icon="hardware-chip-outline"
          title="No Data"
          subtitle={emptyStateMessage}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {title && <Text style={styles.title}>{title}</Text>}
      <FlatList
        data={groups}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <GroupCard group={item} onPress={onGroupPress} showZone={showZones} />
        )}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        refreshControl={refreshControl}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#174d3c",
    marginBottom: 16,
    textAlign: "center",
  },
  listContent: {
    paddingBottom: 20,
  },
});
