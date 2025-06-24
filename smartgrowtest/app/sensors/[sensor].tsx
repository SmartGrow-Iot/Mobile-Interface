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
interface EnvironmentalDataResponse {
  recordId: string;
  zoneId: string;
  timestamp: string;
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

// Sensor configuration mapping
const sensorConfigs: Record<
  string,
  {
    name: string;
    icon: string;
    description: string;
    unit: string;
    apiField: keyof EnvironmentalDataResponse["zoneSensors"] | "soilMoisture";
    thresholds: { min: number; max: number; critical: number };
  }
> = {
  temperature: { name: "Temperature Sensor", icon: "🌡️", description: "Monitor ambient temperature for optimal plant growth", unit: "°C", apiField: "temp", thresholds: { min: 18, max: 32, critical: 35 } },
  humidity:    { name: "Humidity Sensor",    icon: "💧", description: "Track relative humidity levels in growing environment", unit: "%", apiField: "humidity", thresholds: { min: 40, max: 80, critical: 20 } },
  light:       { name: "Light Sensor",       icon: "☀️", description: "Monitor light intensity for photosynthesis optimization", unit: "%", apiField: "light", thresholds: { min: 30, max: 90, critical: 20 } },
  airquality:  { name: "Air Quality Sensor", icon: "🌬️", description: "Monitor air quality and environmental conditions", unit: "ppm", apiField: "airQuality", thresholds: { min: 300, max: 600, critical: 1000 } },
  soil:        { name: "Soil Moisture Sensor", icon: "🟫", description: "Monitor soil moisture levels for optimal plant hydration", unit: "%", apiField: "soilMoisture", thresholds: { min: 30, max: 70, critical: 20 } },
};

const getZoneDisplayName = (zoneId: string) => ({ zone1: "Zone 1", zone2: "Zone 2", zone3: "Zone 3", zone4: "Zone 4" }[zoneId] || zoneId);
const getZoneIcon = (zoneId: string) => (zoneId === "zone1" || zoneId === "zone2" ? "🌶️" : zoneId === "zone3" || zoneId === "zone4" ? "🍆" : "🌱");
const isCriticalValue = (value: number, sensorType: string) => {
  const cfg = sensorConfigs[sensorType]; if (!cfg) return false;
  return value <= cfg.thresholds.critical || value < cfg.thresholds.min || value > cfg.thresholds.max;
};

export default function SensorDetail() {
  const { sensor } = useLocalSearchParams();
  const router = useRouter();
  const sensorType = typeof sensor === "string" ? sensor : "";
  const sensorConfig = sensorConfigs[sensorType];

  const [zoneData, setZoneData] = useState<ProcessedZoneData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchEnvironmentalData = async (showLoading = true) => {
    if (showLoading) setIsLoading(true);
    try {
      if (!sensorConfig) throw new Error(`Invalid sensor type: ${sensorType}`);
      // 🔄 use updated endpoint
      const response: EnvironmentalDataResponse[] = await apiRequest(
        `/logs/sensors?latest=true&limit=100`
      );
      if (!response.length) return setZoneData([]);
      setZoneData(processEnvironmentalDataByZone(response, sensorType));
    } catch (e) {
      console.error(e);
      Alert.alert("Error", "Failed to fetch sensor data.");
      setZoneData([]);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  const processEnvironmentalDataByZone = (
    data: EnvironmentalDataResponse[],
    type: string
  ): ProcessedZoneData[] => {
    const cfg = sensorConfigs[type];
    if (!cfg) return [];
    // non-soil: single latest card
    if (type !== "soil") {
      const latest = data.reduce((p, c) => new Date(c.timestamp) > new Date(p.timestamp) ? c : p);
      const raw = latest.zoneSensors[cfg.apiField as keyof typeof latest.zoneSensors];
      return [{
        id: `${type}-latest`, zoneId: latest.zoneId, zoneName: "All Zones",
        sensorType: type, value: `${raw}${cfg.unit}`, rawValue: raw,
        critical: isCriticalValue(raw, type), icon: cfg.icon,
        lastUpdated: new Date(latest.timestamp)
      }];
    }
    // soil: break into zones
    const map = new Map<string, EnvironmentalDataResponse>();
    data.forEach(r => {
      const ex = map.get(r.zoneId);
      if (!ex || new Date(r.timestamp) > new Date(ex.timestamp)) map.set(r.zoneId, r);
    });
    const out: ProcessedZoneData[] = [];
    map.forEach((r, z) => {
      const total = r.soilMoistureByPin.reduce((s, p) => s + p.soilMoisture, 0);
      const avg = total / r.soilMoistureByPin.length;
      out.push({
        id: `${z}-soil`, zoneId: z, zoneName: getZoneDisplayName(z), sensorType: "soil",
        value: `${Math.round(avg)}${cfg.unit}`, rawValue: avg,
        critical: isCriticalValue(avg, "soil"), icon: getZoneIcon(z),
        lastUpdated: new Date(r.timestamp),
        soilMoistureDetails: r.soilMoistureByPin.map(p => ({ pin: p.pin, moisture: p.soilMoisture, critical: isCriticalValue(p.soilMoisture, "soil") }))
      });
    });
    return out.sort((a, b) => (a.critical === b.critical ? a.zoneName.localeCompare(b.zoneName) : a.critical ? -1 : 1));
  };

  useEffect(() => { if (sensorType && sensorConfig) fetchEnvironmentalData(); }, [sensorType]);
  const handleRefresh = async () => { setIsRefreshing(true); await fetchEnvironmentalData(false); };
  const handleZonePress = (z: ProcessedZoneData) => {
    Alert.alert(
      `${z.zoneName} - ${sensorConfig.name}`,
      `Value: ${z.value}\nStatus: ${z.critical ? "Critical" : "Normal"}`,
      z.sensorType === "soil" ? [{ text: "View Zone", onPress: () => router.push(`/plants/zone/${z.zoneId}`) }, { text: "OK", style: "cancel" }] : [{ text: "OK" }]
    );
  };

  if (!sensorConfig) return (
    <View style={styles.container}>
      <Header title="Sensor Not Found" showBackButton />
      <EmptyState icon="hardware-chip-outline" title="Sensor not supported" />
    </View>
  );

  if (isLoading) return (
    <View style={styles.container}>
      <Header title={sensorConfig.name} showBackButton />
      <LoadingSpinner text={`Loading ${sensorConfig.name} data...`} />
    </View>
  );

  const stats = {
    totalGroups: zoneData.length,
    criticalGroups: zoneData.filter(z => z.critical).length,
    averageValue: zoneData.length
      ? Math.round(zoneData.reduce((s, z) => s + z.rawValue, 0) / zoneData.length * 100) / 100
      : undefined,
    unit: sensorConfig.unit,
  };

  return (
    <View style={styles.container}>
      <Header title={sensorConfig.name} showBackButton />
      <View style={styles.content}>
        <SensorHeader icon={sensorConfig.icon} name={sensorConfig.name} description={sensorConfig.description} />
        <SensorStats stats={stats} />
        <ZoneSensorsList
          zoneData={zoneData}
          onZonePress={sensorType === "soil" ? handleZonePress : undefined}
          sensorType={sensorType}
          refreshControl={
            <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} colors={["#174d3c"]} tintColor="#174d3c" />
          }
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8f8f8" },
  content: { flex: 1 },
});
