import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Alert,
  RefreshControl,
  ScrollView,
  TouchableOpacity,
  Text,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import Header from "../../components/Header";
import { apiRequest } from "@/services/api";
import { Card } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";
import { EmptyState } from "../../components/ui/EmptyState";
import { LoadingSpinner } from "../../components/LoadingSpinner";

// Types for environmental data from API
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

interface PlantData {
  plantId: string;
  name: string;
  zone: string;
  moisturePin: number;
  zoneHardware: {
    sensors: {
      moisture: string;
    };
  };
  status: string;
  description: string;
  type: string;
  growthTime: number;
  image: string;
  userId: string;
  thresholds: {
    light: { min: number; max: number };
    temperature: { min: number; max: number };
    moisture: { min: number; max: number };
    airQuality: { min: number; max: number };
  };
  createdAt: string;
  updatedAt: string;
}

interface ZoneData {
  zone: string;
  sensors: {
    moistureSensor: {
      [pin: string]: string;
    };
  };
  plantIds: string[];
}

interface SoilMoistureData {
  plantId: string;
  plantName: string;
  zone: string;
  pin: number;
  moisture: number;
  critical: boolean;
  timestamp: Date;
  icon: string;
}

// Sensor configuration mapping
const sensorConfigs: Record<
  string,
  {
    name: string;
    icon: string;
    description: string;
    unit: string;
    thresholds: { min: number; max: number; critical: number };
  }
> = {
  temperature: {
    name: "Temperature Sensor",
    icon: "🌡️",
    description: "Monitor ambient temperature for optimal plant growth",
    unit: "°C",
    thresholds: { min: 18, max: 32, critical: 35 },
  },
  humidity: {
    name: "Humidity Sensor",
    icon: "💧",
    description: "Track relative humidity levels in growing environment",
    unit: "%",
    thresholds: { min: 40, max: 80, critical: 20 },
  },
  light: {
    name: "Light Sensor",
    icon: "☀️",
    description: "Monitor light intensity for photosynthesis optimization",
    unit: "%",
    thresholds: { min: 30, max: 90, critical: 20 },
  },
  airquality: {
    name: "Air Quality Sensor",
    icon: "🌬️",
    description: "Monitor air quality and environmental conditions",
    unit: "ppm",
    thresholds: { min: 300, max: 600, critical: 1000 },
  },
  soil: {
    name: "Soil Moisture Sensor",
    icon: "🟫",
    description: "Monitor soil moisture levels for optimal plant hydration",
    unit: "%",
    thresholds: { min: 30, max: 70, critical: 20 },
  },
};

const getZoneDisplayName = (zoneId: string) =>
  ({ zone1: "Zone 1", zone2: "Zone 2", zone3: "Zone 3", zone4: "Zone 4" }[
    zoneId
  ] || zoneId);

const getPlantIcon = (zone: string) =>
  zone === "zone1" || zone === "zone2"
    ? "🌶️"
    : zone === "zone3" || zone === "zone4"
    ? "🍆"
    : "🌱";

const isCriticalValue = (value: number, sensorType: string) => {
  const cfg = sensorConfigs[sensorType];
  if (!cfg) return false;
  return (
    value <= cfg.thresholds.critical ||
    value < cfg.thresholds.min ||
    value > cfg.thresholds.max
  );
};

// Environmental Data Card Component
const EnvironmentalDataCard = ({
  data,
  sensorType,
}: {
  data: EnvironmentalDataResponse;
  sensorType: string;
}) => {
  const config = sensorConfigs[sensorType];
  const value = data.zoneSensors[sensorType as keyof typeof data.zoneSensors];
  const critical = isCriticalValue(value, sensorType);

  return (
    <Card style={[styles.envCard, critical && styles.criticalBorder]}>
      <View style={styles.envHeader}>
        <View style={styles.envInfo}>
          <Text style={styles.envIcon}>{config.icon}</Text>
          <View style={styles.envDetails}>
            <Text style={styles.envTitle}>Environmental Data</Text>
            <Text style={styles.envSubtitle}>
              Latest reading from all zones
            </Text>
          </View>
        </View>
        <Badge variant={critical ? "error" : "success"} size="small">
          {critical ? "Critical" : "Normal"}
        </Badge>
      </View>

      <View style={styles.envReading}>
        <View style={styles.readingIcon}>
          <Ionicons
            name={getEnvSensorIcon(sensorType)}
            size={32}
            color={getEnvSensorColor(sensorType)}
          />
        </View>
        <View style={styles.readingDetails}>
          <Text style={[styles.envValue, critical && styles.criticalValue]}>
            {value}
            {config.unit}
          </Text>
          <Text style={styles.envTimestamp}>
            Updated {new Date(data.timestamp).toLocaleTimeString()}
          </Text>
        </View>
      </View>

      {critical && (
        <View style={styles.warningContainer}>
          <Ionicons name="warning" size={16} color="#ff4444" />
          <Text style={styles.warningText}>
            Value outside optimal range ({config.thresholds.min}-
            {config.thresholds.max}
            {config.unit})
          </Text>
        </View>
      )}
    </Card>
  );
};

// Soil Moisture Plant Card Component
const SoilMoisturePlantCard = ({
  plantData,
}: {
  plantData: SoilMoistureData;
}) => {
  const hasData = plantData.moisture > 0;

  return (
    <Card
      style={[styles.plantCard, plantData.critical && styles.criticalBorder]}
    >
      <View style={styles.plantHeader}>
        <View style={styles.plantInfo}>
          <Text style={styles.plantIcon}>{plantData.icon}</Text>
          <View style={styles.plantDetails}>
            <Text style={styles.plantName}>{plantData.plantName}</Text>
            <Text style={styles.plantZone}>
              {getZoneDisplayName(plantData.zone)}
            </Text>
          </View>
        </View>
        <Badge
          variant={
            !hasData ? "warning" : plantData.critical ? "error" : "success"
          }
          size="small"
        >
          {!hasData ? "No Data" : plantData.critical ? "Critical" : "Normal"}
        </Badge>
      </View>

      <View style={styles.moistureReading}>
        <View style={styles.readingIcon}>
          <Ionicons name="water-outline" size={24} color="#8b4513" />
        </View>
        <View style={styles.readingDetails}>
          <Text
            style={[
              styles.moistureValue,
              plantData.critical && styles.criticalValue,
              !hasData && styles.noDataValue,
            ]}
          >
            {hasData ? `${plantData.moisture}%` : "No Data"}
          </Text>
          <Text style={styles.moisturePin}>Pin {plantData.pin}</Text>
        </View>
      </View>

      <Text style={styles.plantTimestamp}>
        {hasData
          ? `Updated ${plantData.timestamp.toLocaleTimeString()}`
          : "No recent data"}
      </Text>

      {!hasData && (
        <View style={styles.warningContainer}>
          <Ionicons name="information-circle" size={16} color="#f39c12" />
          <Text style={[styles.warningText, { color: "#f39c12" }]}>
            No sensor data available for this pin
          </Text>
        </View>
      )}

      {hasData && plantData.critical && (
        <View style={styles.warningContainer}>
          <Ionicons name="warning" size={16} color="#ff4444" />
          <Text style={styles.warningText}>
            Moisture level below optimal range
          </Text>
        </View>
      )}
    </Card>
  );
};

// Zone Selection Component
const ZoneSelector = ({
  selectedZone,
  onZoneSelect,
  zones,
}: {
  selectedZone: string | null;
  onZoneSelect: (zone: string) => void;
  zones: string[];
}) => {
  return (
    <View style={styles.zoneSelectorContainer}>
      <Text style={styles.zoneSelectorTitle}>Select Zone</Text>
      <View style={styles.zoneButtons}>
        {zones.map((zone) => (
          <TouchableOpacity
            key={zone}
            style={[
              styles.zoneButton,
              selectedZone === zone && styles.selectedZoneButton,
            ]}
            onPress={() => onZoneSelect(zone)}
          >
            <Text
              style={[
                styles.zoneButtonText,
                selectedZone === zone && styles.selectedZoneButtonText,
              ]}
            >
              {getZoneDisplayName(zone)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

// Helper functions
const getEnvSensorIcon = (
  sensorType: string
): keyof typeof Ionicons.glyphMap => {
  switch (sensorType) {
    case "temperature":
      return "thermometer-outline";
    case "humidity":
      return "water-outline";
    case "light":
      return "sunny-outline";
    case "airquality":
      return "cloud-outline";
    default:
      return "hardware-chip-outline";
  }
};

const getEnvSensorColor = (sensorType: string): string => {
  switch (sensorType) {
    case "temperature":
      return "#e74c3c";
    case "humidity":
      return "#3498db";
    case "light":
      return "#f39c12";
    case "airquality":
      return "#95a5a6";
    default:
      return "#666";
  }
};

export default function SensorDetail() {
  const { sensor } = useLocalSearchParams();
  const router = useRouter();
  const sensorType = typeof sensor === "string" ? sensor : "";
  const sensorConfig = sensorConfigs[sensorType];

  const [environmentalData, setEnvironmentalData] =
    useState<EnvironmentalDataResponse | null>(null);
  const [soilMoistureData, setSoilMoistureData] = useState<SoilMoistureData[]>(
    []
  );
  const [availableZones, setAvailableZones] = useState<string[]>([]);
  const [selectedZone, setSelectedZone] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchEnvironmentalData = async (showLoading = true) => {
    if (showLoading) setIsLoading(true);

    try {
      if (!sensorConfig) throw new Error(`Invalid sensor type: ${sensorType}`);

      if (sensorType === "soil") {
        // For soil moisture, fetch data for all zones and plants
        await fetchSoilMoistureData();
      } else {
        // For environmental sensors, get latest data from any zone
        const response: EnvironmentalDataResponse[] = await apiRequest(
          `/logs/sensors?latest=true&limit=1`
        );

        if (response.length > 0) {
          setEnvironmentalData(response[0]);
        }
      }
    } catch (e) {
      console.error(e);
      Alert.alert("Error", "Failed to fetch sensor data.");
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  const fetchSoilMoistureData = async () => {
    try {
      const zones = ["zone1", "zone2", "zone3", "zone4"];
      const allSoilData: SoilMoistureData[] = [];
      const zonesWithPlants: string[] = [];

      console.log("Starting to fetch soil moisture data for all zones...");

      for (const zone of zones) {
        try {
          console.log(`Fetching plants for ${zone}...`);

          // Get all plants in this zone directly
          const zoneResponse = await apiRequest(`/zones/${zone}/plants`);
          const plants = zoneResponse.plants || [];

          console.log(
            `Found ${plants.length} plants in ${zone}:`,
            plants.map((p:any) => p.name)
          );

          if (plants.length === 0) {
            console.log(`No plants found in ${zone}, skipping...`);
            continue;
          }

          zonesWithPlants.push(zone);

          // Get latest sensor data for this zone
          console.log(`Fetching sensor data for ${zone}...`);
          const sensorResponse: EnvironmentalDataResponse[] = await apiRequest(
            `/logs/sensors?zoneId=${zone}&latest=true`
          );

          console.log(`Sensor response for ${zone}:`, sensorResponse);

          if (sensorResponse.length === 0) {
            console.log(`No sensor data found for ${zone}, skipping...`);
            continue;
          }

          const latestData = sensorResponse[0];
          console.log(`Latest sensor data for ${zone}:`, latestData);
          console.log(`Soil moisture readings:`, latestData.soilMoistureByPin);

          // Process each plant in this zone
          for (const plant of plants) {
            try {
              console.log(
                `Processing plant: ${plant.name}, pin: ${plant.moisturePin}`
              );

              // Find the moisture data for this plant's pin
              const moistureReading = latestData.soilMoistureByPin.find(
                (reading) => reading.pin === plant.moisturePin
              );

              console.log(
                `Moisture reading for pin ${plant.moisturePin}:`,
                moistureReading
              );

              // Always add the plant, even if no moisture reading is available
              const moisture = moistureReading
                ? moistureReading.soilMoisture
                : 0;
              const critical = moistureReading
                ? isCriticalValue(moisture, "soil")
                : true; // Mark as critical if no data

              const plantData = {
                plantId: plant.plantId,
                plantName: plant.name,
                zone: plant.zone,
                pin: plant.moisturePin,
                moisture: moisture,
                critical: critical,
                timestamp: new Date(latestData.timestamp),
                icon: getPlantIcon(plant.zone),
              };

              console.log(`Adding plant data:`, plantData);
              allSoilData.push(plantData);

              if (!moistureReading) {
                console.warn(
                  `No moisture reading found for plant ${plant.name} with pin ${plant.moisturePin}. Available pins:`,
                  latestData.soilMoistureByPin.map((r) => r.pin)
                );
              }
            } catch (error) {
              console.error(`Error processing plant ${plant.plantId}:`, error);
            }
          }
        } catch (error) {
          console.error(`Error fetching data for ${zone}:`, error);
        }
      }

      console.log(`Total soil data collected:`, allSoilData);
      console.log(`Zones with plants:`, zonesWithPlants);

      setAvailableZones(zonesWithPlants);
      setSoilMoistureData(allSoilData);

      // Auto-select first zone if none selected
      if (!selectedZone && zonesWithPlants.length > 0) {
        setSelectedZone(zonesWithPlants[0]);
      }
    } catch (error) {
      console.error("Error fetching soil moisture data:", error);
    }
  };

  useEffect(() => {
    if (sensorType && sensorConfig) {
      fetchEnvironmentalData();
    }
  }, [sensorType]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchEnvironmentalData(false);
  };

  // Filter soil moisture data by selected zone
  const filteredSoilData = selectedZone
    ? soilMoistureData.filter((plant) => plant.zone === selectedZone)
    : soilMoistureData;

  if (!sensorConfig) {
    return (
      <View style={styles.container}>
        <Header title="Sensor Not Found" showBackButton />
        <EmptyState icon="hardware-chip-outline" title="Sensor not supported" />
      </View>
    );
  }

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Header title={sensorConfig.name} showBackButton />
        <LoadingSpinner text={`Loading ${sensorConfig.name} data...`} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header title={sensorConfig.name} showBackButton />

      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            colors={["#174d3c"]}
            tintColor="#174d3c"
          />
        }
      >
        {/* Sensor Header */}
        <Card style={styles.headerCard}>
          <View style={styles.headerContent}>
            <Text style={styles.sensorIcon}>{sensorConfig.icon}</Text>
            <View style={styles.headerText}>
              <Text style={styles.sensorName}>{sensorConfig.name}</Text>
              <Text style={styles.sensorDescription}>
                {sensorConfig.description}
              </Text>
            </View>
          </View>
        </Card>

        {/* Environmental Data (for non-soil sensors) */}
        {sensorType !== "soil" && environmentalData && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Environmental Data</Text>
            <EnvironmentalDataCard
              data={environmentalData}
              sensorType={sensorType}
            />
          </View>
        )}

        {/* Soil Moisture Data (for soil sensor) */}
        {sensorType === "soil" && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Soil Moisture by Plant</Text>

            {availableZones.length > 0 && (
              <ZoneSelector
                selectedZone={selectedZone}
                onZoneSelect={setSelectedZone}
                zones={availableZones}
              />
            )}

            {filteredSoilData.length === 0 ? (
              <EmptyState
                icon="leaf-outline"
                title="No Plants Found"
                subtitle={
                  selectedZone
                    ? `No plants with soil sensors found in ${getZoneDisplayName(
                        selectedZone
                      )}`
                    : "No plants with soil sensors found"
                }
              />
            ) : (
              <View style={styles.plantsContainer}>
                {filteredSoilData.map((plant) => (
                  <SoilMoisturePlantCard
                    key={plant.plantId}
                    plantData={plant}
                  />
                ))}
              </View>
            )}
          </View>
        )}

        {/* Stats Summary */}
        {((sensorType !== "soil" && environmentalData) ||
          (sensorType === "soil" && soilMoistureData.length > 0)) && (
          <Card style={styles.statsCard}>
            <Text style={styles.statsTitle}>Summary</Text>
            <View style={styles.statsContainer}>
              {sensorType === "soil" ? (
                <>
                  <View style={styles.statItem}>
                    <Text style={styles.statValue}>
                      {soilMoistureData.length}
                    </Text>
                    <Text style={styles.statLabel}>Total Plants</Text>
                  </View>
                  <View style={styles.statItem}>
                    <Text style={styles.statValue}>
                      {availableZones.length}
                    </Text>
                    <Text style={styles.statLabel}>Active Zones</Text>
                  </View>
                  <View style={styles.statItem}>
                    <Text style={styles.statValue}>
                      {soilMoistureData.filter((p) => p.critical).length}
                    </Text>
                    <Text style={styles.statLabel}>Critical</Text>
                  </View>
                </>
              ) : (
                <>
                  <View style={styles.statItem}>
                    <Text style={styles.statValue}>1</Text>
                    <Text style={styles.statLabel}>Data Source</Text>
                  </View>
                  <View style={styles.statItem}>
                    <Text style={styles.statValue}>
                      {environmentalData &&
                      isCriticalValue(
                        environmentalData.zoneSensors[
                          sensorType as keyof typeof environmentalData.zoneSensors
                        ],
                        sensorType
                      )
                        ? "1"
                        : "0"}
                    </Text>
                    <Text style={styles.statLabel}>Critical</Text>
                  </View>
                  <View style={styles.statItem}>
                    <Text style={styles.statValue}>
                      {
                        environmentalData?.zoneSensors[
                          sensorType as keyof typeof environmentalData.zoneSensors
                        ]
                      }
                      {sensorConfig.unit}
                    </Text>
                    <Text style={styles.statLabel}>Current</Text>
                  </View>
                </>
              )}
            </View>
          </Card>
        )}
      </ScrollView>
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
    padding: 16,
  },

  // Header styles
  headerCard: {
    marginBottom: 20,
    padding: 20,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  sensorIcon: {
    fontSize: 48,
    marginRight: 16,
  },
  headerText: {
    flex: 1,
  },
  sensorName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#174d3c",
    marginBottom: 4,
  },
  sensorDescription: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
  },

  // Section styles
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#174d3c",
    marginBottom: 16,
  },

  // Environmental data styles
  envCard: {
    marginBottom: 12,
  },
  criticalBorder: {
    borderLeftWidth: 4,
    borderLeftColor: "#ff4444",
  },
  envHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  envInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  envIcon: {
    fontSize: 32,
    marginRight: 12,
  },
  envDetails: {
    flex: 1,
  },
  envTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 2,
  },
  envSubtitle: {
    fontSize: 14,
    color: "#666",
  },
  envReading: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  readingIcon: {
    marginRight: 16,
  },
  readingDetails: {
    flex: 1,
  },
  envValue: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  envTimestamp: {
    fontSize: 12,
    color: "#999",
  },
  criticalValue: {
    color: "#ff4444",
  },
  noDataValue: {
    color: "#f39c12",
    fontStyle: "italic",
  },

  // Zone selector styles
  zoneSelectorContainer: {
    marginBottom: 20,
  },
  zoneSelectorTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 12,
  },
  zoneButtons: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  zoneButton: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  selectedZoneButton: {
    backgroundColor: "#174d3c",
    borderColor: "#174d3c",
  },
  zoneButtonText: {
    fontSize: 14,
    color: "#666",
    fontWeight: "500",
  },
  selectedZoneButtonText: {
    color: "#fff",
  },

  // Plant card styles
  plantsContainer: {
    gap: 12,
  },
  plantCard: {
    marginBottom: 0,
  },
  plantHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  plantInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  plantIcon: {
    fontSize: 28,
    marginRight: 12,
  },
  plantDetails: {
    flex: 1,
  },
  plantName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 2,
  },
  plantZone: {
    fontSize: 14,
    color: "#666",
  },
  moistureReading: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f8ff",
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  moistureValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 2,
  },
  moisturePin: {
    fontSize: 12,
    color: "#666",
    fontWeight: "500",
  },
  plantTimestamp: {
    fontSize: 12,
    color: "#999",
    textAlign: "center",
  },

  // Warning styles
  warningContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffebee",
    borderRadius: 8,
    padding: 8,
    marginTop: 8,
  },
  warningText: {
    fontSize: 12,
    color: "#ff4444",
    fontWeight: "500",
    marginLeft: 6,
    flex: 1,
  },

  // Stats styles
  statsCard: {
    marginTop: 8,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#174d3c",
    marginBottom: 16,
    textAlign: "center",
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  statItem: {
    alignItems: "center",
  },
  statValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#174d3c",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: "#666",
    fontWeight: "500",
  },
});
