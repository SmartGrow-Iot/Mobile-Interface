// app/sensors/[sensor].tsx - Updated with correct API endpoints
import React, { useState, useEffect } from "react";
import { View, StyleSheet, Alert, RefreshControl } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import Header from "../../components/Header";
import { apiRequest } from "@/services/api";

// Import components
import { SensorHeader } from "../../components/features/sensors/SensorHeader";
import { SensorStats } from "../../components/features/sensors/SensorStats";
import { ZoneSensorsList } from "../../components/features/sensors/ZoneSensorsList";
import { EmptyState } from "../../components/ui/EmptyState";
import { LoadingSpinner } from "../../components/LoadingSpinner";

// Types for sensor data from API
interface EnvironmentalSensorData {
  id: string;
  sensorType: string;
  value: number;
  unit: string;
  timestamp: string;
  zoneId: string;
  isActive: boolean;
}

interface ProcessedZoneData {
  id: string;
  zoneId: string;
  zoneName: string;
  sensorType: string;
  value: string;
  rawValue: number;
  critical: boolean;
  icon: string;
  lastUpdated: Date;
}

// Sensor configuration mapping
const sensorConfigs: Record<
  string,
  {
    name: string;
    icon: string;
    description: string;
    unit: string;
    apiType: string; // API sensor type mapping
    thresholds: { min: number; max: number; critical: number };
  }
> = {
  temperature: {
    name: "Temperature Sensor",
    icon: "🌡️",
    description: "Monitor ambient temperature for optimal plant growth",
    unit: "°C",
    apiType: "temp",
    thresholds: { min: 18, max: 32, critical: 35 },
  },
  humidity: {
    name: "Humidity Sensor",
    icon: "💧",
    description: "Track relative humidity levels in growing environment",
    unit: "%",
    apiType: "humidity",
    thresholds: { min: 40, max: 80, critical: 20 },
  },
  light: {
    name: "Light Sensor",
    icon: "☀️",
    description: "Monitor light intensity for photosynthesis optimization",
    unit: "%",
    apiType: "light",
    thresholds: { min: 30, max: 90, critical: 20 },
  },
  airquality: {
    name: "Air Quality Sensor",
    icon: "🌬️",
    description: "Monitor air quality and environmental conditions",
    unit: "ppm",
    apiType: "air_quality",
    thresholds: { min: 300, max: 600, critical: 1000 },
  },
};

// Zone name mapping
const getZoneDisplayName = (zoneId: string): string => {
  const zoneMap: Record<string, string> = {
    zone1: "Zone 1",
    zone2: "Zone 2",
    zone3: "Zone 3",
    zone4: "Zone 4",
  };
  return zoneMap[zoneId] || zoneId;
};

// Get zone icon based on zone ID
const getZoneIcon = (zoneId: string): string => {
  switch (zoneId) {
    case "zone1":
    case "zone2":
      return "🌶️"; // Chili zones
    case "zone3":
    case "zone4":
      return "🍆"; // Eggplant zones
    default:
      return "🌱"; // Default plant icon
  }
};

// Helper function to determine if value is critical
const isCriticalValue = (value: number, sensorType: string): boolean => {
  const config = sensorConfigs[sensorType];
  if (!config) return false;

  return (
    value <= config.thresholds.critical ||
    value < config.thresholds.min ||
    value > config.thresholds.max
  );
};

export default function SensorDetail() {
  const { sensor } = useLocalSearchParams();
  const router = useRouter();

  // State
  const [zoneData, setZoneData] = useState<ProcessedZoneData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const sensorType = typeof sensor === "string" ? sensor : "";
  const sensorConfig = sensorConfigs[sensorType];

  // Fetch environmental data for specific sensor type across all zones
  const fetchEnvironmentalData = async (showLoading = true) => {
    if (showLoading) setIsLoading(true);

    try {
      console.log(`Fetching environmental data for sensor type: ${sensorType}`);

      if (!sensorConfig) {
        throw new Error(`Invalid sensor type: ${sensorType}`);
      }

      // Fetch sensors of the specific type
      const response = await apiRequest(
        `/sensors?sensor_type=${sensorConfig.apiType}`
      );
      const sensorData: EnvironmentalSensorData[] = Array.isArray(response)
        ? response
        : [];

      console.log(`Found ${sensorData.length} ${sensorConfig.apiType} sensors`);

      if (sensorData.length === 0) {
        setZoneData([]);
        return;
      }

      // Process the sensor data by zone
      const processedData = processSensorDataByZone(sensorData, sensorType);
      setZoneData(processedData);
    } catch (error) {
      console.error("Error fetching environmental data:", error);
      Alert.alert(
        "Error",
        "Failed to fetch sensor data. Please check your connection and try again."
      );
      setZoneData([]);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  // Process sensor data and group by zones
  const processSensorDataByZone = (
    sensorData: EnvironmentalSensorData[],
    sensorType: string
  ): ProcessedZoneData[] => {
    // Group sensors by zone and get the latest reading for each zone
    const zoneMap = new Map<string, EnvironmentalSensorData>();

    sensorData.forEach((sensor) => {
      if (sensor.isActive) {
        const existing = zoneMap.get(sensor.zoneId);
        // Keep the most recent reading for each zone
        if (
          !existing ||
          new Date(sensor.timestamp) > new Date(existing.timestamp)
        ) {
          zoneMap.set(sensor.zoneId, sensor);
        }
      }
    });

    // Convert to ProcessedZoneData format
    const processedZones: ProcessedZoneData[] = [];

    zoneMap.forEach((sensor, zoneId) => {
      processedZones.push({
        id: `${zoneId}-${sensorType}`,
        zoneId: zoneId,
        zoneName: getZoneDisplayName(zoneId),
        sensorType: sensorType,
        value: `${sensor.value}${sensor.unit || sensorConfig?.unit || ""}`,
        rawValue: sensor.value,
        critical: isCriticalValue(sensor.value, sensorType),
        icon: getZoneIcon(zoneId),
        lastUpdated: new Date(sensor.timestamp),
      });
    });

    // Sort by critical status first, then by zone name
    return processedZones.sort((a, b) => {
      if (a.critical && !b.critical) return -1;
      if (!a.critical && b.critical) return 1;
      return a.zoneName.localeCompare(b.zoneName);
    });
  };

  // Initial load
  useEffect(() => {
    if (sensorType && sensorConfig) {
      fetchEnvironmentalData();
    }
  }, [sensorType]);

  // Handle refresh
  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchEnvironmentalData(false);
  };

  // Handle zone press
  const handleZonePress = (zoneData: ProcessedZoneData) => {
    Alert.alert(
      `${zoneData.zoneName} - ${sensorConfig?.name}`,
      `Value: ${zoneData.value}\nStatus: ${
        zoneData.critical ? "Critical" : "Normal"
      }\nLast Updated: ${zoneData.lastUpdated.toLocaleString()}`,
      [
        {
          text: "View Zone",
          onPress: () => {
            router.push(`/plants/zone/${zoneData.zoneId}`);
          },
        },
        {
          text: "OK",
          style: "cancel",
        },
      ]
    );
  };

  // Calculate stats - Fixed to match SensorStats component interface
  const stats = {
    totalGroups: zoneData.length,
    criticalGroups: zoneData.filter((z) => z.critical).length,
    averageValue:
      zoneData.length > 0
        ? Math.round(
            (zoneData.reduce((sum, z) => sum + z.rawValue, 0) /
              zoneData.length) *
              100
          ) / 100
        : undefined,
    unit: sensorConfig?.unit,
  };

  // Error state - sensor type not found
  if (!sensorConfig) {
    return (
      <View style={styles.container}>
        <Header title="Sensor Not Found" showBackButton={true} />
        <View style={styles.content}>
          <EmptyState
            icon="hardware-chip-outline"
            title="Sensor type not found"
            subtitle={`The sensor type "${sensorType}" is not supported.`}
          />
        </View>
      </View>
    );
  }

  // Custom breadcrumbs
  const customBreadcrumbs = [
    { label: "Home", route: "/" },
    { label: "Sensors", route: "/(tabs)/sensors" },
    { label: sensorConfig.name },
  ];

  // Loading state
  if (isLoading) {
    return (
      <View style={styles.container}>
        <Header
          title={sensorConfig.name}
          showBackButton={true}
          customBreadcrumbs={customBreadcrumbs}
        />
        <LoadingSpinner
          text={`Loading ${sensorConfig.name.toLowerCase()} data...`}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header
        title={sensorConfig.name}
        showBackButton={true}
        customBreadcrumbs={customBreadcrumbs}
      />

      <View style={styles.content}>
        {/* Sensor Header */}
        <SensorHeader
          icon={sensorConfig.icon}
          name={sensorConfig.name}
          description={sensorConfig.description}
        />

        {/* Stats */}
        <SensorStats stats={stats} />

        {/* Zone Sensors List */}
        <ZoneSensorsList
          zoneData={zoneData}
          onZonePress={handleZonePress}
          sensorType={sensorType}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
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
