// app/sensors/[sensor].tsx - Updated with correct API endpoints from documentation
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

// Types for sensor data from API (based on 3.2 get_environmental_data)
interface EnvironmentalDataResponse {
  recordId: string;
  zoneId: string;
  timestamp: string; // ISO 8601 format
  zoneSensors: {
    humidity: number;
    temp: number;
    light: number;
    airQuality: number;
  };
  soilMoistureByPin: Array<{
    pin: number;
    soilMoisture: number;
  }>;
  userId: string;
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
  soilMoistureDetails?: Array<{
    pin: number;
    moisture: number;
    critical: boolean;
  }>;
}

// Sensor configuration mapping (updated to match API sensor types)
const sensorConfigs: Record<
  string,
  {
    name: string;
    icon: string;
    description: string;
    unit: string;
    apiField: keyof EnvironmentalDataResponse["zoneSensors"] | "soilMoisture"; // API field mapping
    thresholds: { min: number; max: number; critical: number };
  }
> = {
  temperature: {
    name: "Temperature Sensor",
    icon: "🌡️",
    description: "Monitor ambient temperature for optimal plant growth",
    unit: "°C",
    apiField: "temp",
    thresholds: { min: 18, max: 32, critical: 35 },
  },
  humidity: {
    name: "Humidity Sensor",
    icon: "💧",
    description: "Track relative humidity levels in growing environment",
    unit: "%",
    apiField: "humidity",
    thresholds: { min: 40, max: 80, critical: 20 },
  },
  light: {
    name: "Light Sensor",
    icon: "☀️",
    description: "Monitor light intensity for photosynthesis optimization",
    unit: "%",
    apiField: "light",
    thresholds: { min: 30, max: 90, critical: 20 },
  },
  airquality: {
    name: "Air Quality Sensor",
    icon: "🌬️",
    description: "Monitor air quality and environmental conditions",
    unit: "ppm",
    apiField: "airQuality",
    thresholds: { min: 300, max: 600, critical: 1000 },
  },
  soil: {
    name: "Soil Moisture Sensor",
    icon: "🟫",
    description: "Monitor soil moisture levels for optimal plant hydration",
    unit: "%",
    apiField: "soilMoisture",
    thresholds: { min: 30, max: 70, critical: 20 },
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

  // Fetch environmental data using API 3.2 get_environmental_data
  const fetchEnvironmentalData = async (showLoading = true) => {
    if (showLoading) setIsLoading(true);

    try {
      console.log(`Fetching environmental data for sensor type: ${sensorType}`);

      if (!sensorConfig) {
        throw new Error(`Invalid sensor type: ${sensorType}`);
      }

      // Use API 3.2: GET /api/v1/logs/sensor-data with latest=true to get latest record per zone
      const response: EnvironmentalDataResponse[] = await apiRequest(
        `/logs/sensor-data?latest=true&limit=100`
      );

      console.log(`Found ${response.length} environmental data records`);

      if (response.length === 0) {
        setZoneData([]);
        return;
      }

      // Process the environmental data by zone for the specific sensor type
      const processedData = processEnvironmentalDataByZone(
        response,
        sensorType
      );
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

  // Process environmental data and group by zones for specific sensor type
  const processEnvironmentalDataByZone = (
    environmentalData: EnvironmentalDataResponse[],
    sensorType: string
  ): ProcessedZoneData[] => {
    const processedZones: ProcessedZoneData[] = [];
    const config = sensorConfigs[sensorType];

    // Group by zone and get the latest reading for each zone
    const zoneMap = new Map<string, EnvironmentalDataResponse>();

    environmentalData.forEach((record) => {
      const existing = zoneMap.get(record.zoneId);
      // Keep the most recent reading for each zone
      if (
        !existing ||
        new Date(record.timestamp) > new Date(existing.timestamp)
      ) {
        zoneMap.set(record.zoneId, record);
      }
    });

    // Convert to ProcessedZoneData format based on sensor type
    zoneMap.forEach((record, zoneId) => {
      let value: number;
      let displayValue: string;
      let soilMoistureDetails:
        | Array<{ pin: number; moisture: number; critical: boolean }>
        | undefined;

      // Extract value based on sensor type
      if (sensorType === "soil") {
        // For soil moisture, calculate average from all pins
        const totalMoisture = record.soilMoistureByPin.reduce(
          (sum, pin) => sum + pin.soilMoisture,
          0
        );
        value = totalMoisture / record.soilMoistureByPin.length;
        displayValue = `${Math.round(value)}${config.unit}`;

        // Include detailed pin data for soil moisture
        soilMoistureDetails = record.soilMoistureByPin.map((pin) => ({
          pin: pin.pin,
          moisture: pin.soilMoisture,
          critical: isCriticalValue(pin.soilMoisture, sensorType),
        }));
      } else {
        // For other sensor types, get value from zoneSensors
        const apiField =
          config.apiField as keyof EnvironmentalDataResponse["zoneSensors"];
        value = record.zoneSensors[apiField];
        displayValue = `${value}${config.unit}`;
      }

      processedZones.push({
        id: `${zoneId}-${sensorType}`,
        zoneId: zoneId,
        zoneName: getZoneDisplayName(zoneId),
        sensorType: sensorType,
        value: displayValue,
        rawValue: value,
        critical: isCriticalValue(value, sensorType),
        icon: getZoneIcon(zoneId),
        lastUpdated: new Date(record.timestamp),
        soilMoistureDetails,
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
