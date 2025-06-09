import React, { useState } from "react";
import { View, StyleSheet, Alert, RefreshControl } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import Header from "../../components/Header";

// Import new components
import { SensorHeader } from "../../components/features/sensors/SensorHeader";
import { SensorStats } from "../../components/features/sensors/SensorStats";
import { GroupsList } from "../../components/features/sensors/GroupsList";
import { EmptyState } from "../../components/ui/EmptyState";
import { LoadingSpinner } from "../../components/LoadingSpinner";

// Import data and utils
import {
  getSensorInfo,
  getGroupDataBySensor,
  calculateSensorStats,
} from "../../data/sensors";
import { GroupData } from "../../types/Sensor";

export default function SensorDetail() {
  const { sensor } = useLocalSearchParams();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const sensorType = typeof sensor === "string" ? sensor : "";
  const sensorInfo = getSensorInfo(sensorType);
  const groupData = getGroupDataBySensor(sensorType);
  const stats = calculateSensorStats(groupData);

  // Handle group press
  const handleGroupPress = (group: GroupData) => {
    Alert.alert(
      `${group.group} Details`,
      `Zone: ${group.zone}\nValue: ${group.value}\nStatus: ${
        group.critical ? "Critical" : "Normal"
      }\nESP32 ID: ${group.esp32Id || "N/A"}`,
      [
        {
          text: "View Zone",
          onPress: () => {
            if (group.zone) {
              router.push(`/plants/zone/${group.zone}`);
            }
          },
        },
        {
          text: "OK",
          style: "cancel",
        },
      ]
    );
  };

  // Handle refresh
  const handleRefresh = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
    } finally {
      setIsLoading(false);
    }
  };

  if (!sensorInfo) {
    return (
      <View style={styles.container}>
        <Header title="Sensor Not Found" showBackButton={true} />
        <View style={styles.content}>
          <EmptyState
            icon="hardware-chip-outline"
            title="Sensor not found"
            subtitle="The sensor you're looking for doesn't exist."
          />
        </View>
      </View>
    );
  }

  // Custom breadcrumbs for sensor detail page
  const customBreadcrumbs = [
    { label: "Home", route: "/" },
    { label: "Sensors", route: "/(tabs)/sensors" },
    { label: sensorInfo.name },
  ];

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Header
          title={sensorInfo.name}
          showBackButton={true}
          customBreadcrumbs={customBreadcrumbs}
        />
        <LoadingSpinner text="Refreshing sensor data..." />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header Component */}
      <Header
        title={sensorInfo.name}
        showBackButton={true}
        customBreadcrumbs={customBreadcrumbs}
      />

      {/* Main Content - No ScrollView, let FlatList handle scrolling */}
      <View style={styles.content}>
        {/* Fixed Header Content */}
        <View>
          <SensorHeader
            icon={sensorInfo.icon}
            name={sensorInfo.name}
            description={sensorInfo.description}
          />

          <SensorStats
            stats={{
              ...stats,
              unit: sensorInfo.unit,
            }}
          />
        </View>

        {/* Scrollable Groups List */}
        <GroupsList
          groups={groupData}
          onGroupPress={handleGroupPress}
          showZones={true}
          title="Group Readings"
          emptyStateMessage={`No ${sensorInfo.name.toLowerCase()} data available`}
          refreshControl={
            <RefreshControl
              refreshing={isLoading}
              onRefresh={handleRefresh}
              colors={["#174d3c"]}
              tintColor="#174d3c"
            />
          }
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f8f8",
  },
  content: {
    flex: 1,
  },
});
