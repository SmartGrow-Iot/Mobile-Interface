// app/sensors/[sensor].tsx - Clean refactored version
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Alert,
  RefreshControl,
  ScrollView,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import Header from "../../components/Header";
import { EmptyState } from "../../components/ui/EmptyState";
import { LoadingSpinner } from "../../components/LoadingSpinner";

// Import types and services
import {
  EnvironmentalDataResponse,
  SoilMoistureData,
  SensorType,
  sensorConfigs,
} from "../../types/Sensor";
import { sensorService } from "../../services/sensorService";

// Import components
import {
  EnvironmentalDataCard,
  SoilMoisturePlantCard,
  ZoneSelector,
  SensorHeader,
  SummaryStats,
} from "../../components/features/sensors/SensorDetailComponents";

export default function SensorDetail() {
  const { sensor } = useLocalSearchParams();
  const sensorType =
    typeof sensor === "string" ? (sensor as SensorType) : "light";
  const sensorConfig = sensorConfigs[sensorType];

  // State management
  const [environmentalData, setEnvironmentalData] =
    useState<EnvironmentalDataResponse | null>(null);
  const [soilMoistureData, setSoilMoistureData] = useState<SoilMoistureData[]>(
    []
  );
  const [availableZones, setAvailableZones] = useState<string[]>([]);
  const [selectedZone, setSelectedZone] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Data fetching functions
  const fetchData = async (showLoading = true) => {
    if (showLoading) setIsLoading(true);

    try {
      if (!sensorConfig) throw new Error(`Invalid sensor type: ${sensorType}`);

      if (sensorType === "soil") {
        await fetchSoilMoistureData();
      } else {
        await fetchEnvironmentalData();
      }
    } catch (error) {
      console.error("Error fetching sensor data:", error);
      Alert.alert("Error", "Failed to fetch sensor data.");
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  const fetchEnvironmentalData = async () => {
    try {
      const data = await sensorService.fetchEnvironmentalData();
      setEnvironmentalData(data);
    } catch (error) {
      console.error("Error fetching environmental data:", error);
      throw error;
    }
  };

  const fetchSoilMoistureData = async () => {
    try {
      const { soilData, availableZones: zones } =
        await sensorService.fetchSoilMoistureData();

      setSoilMoistureData(soilData);
      setAvailableZones(zones);

      // Auto-select first zone with plants, or zone1 if none
      if (!selectedZone) {
        const firstZoneWithPlants =
          soilData.length > 0 ? soilData[0].zone : "zone1";
        setSelectedZone(firstZoneWithPlants);
      }
    } catch (error) {
      console.error("Error fetching soil moisture data:", error);
      throw error;
    }
  };

  // Event handlers
  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchData(false);
  };

  const handleZoneSelect = (zone: string) => {
    setSelectedZone(zone);
  };

  // Effects
  useEffect(() => {
    if (sensorType && sensorConfig) {
      fetchData();
    }
  }, [sensorType]);

  // Filter soil moisture data by selected zone
  const filteredSoilData = selectedZone
    ? soilMoistureData.filter((plant) => plant.zone === selectedZone)
    : soilMoistureData;

  // Render functions
  const renderContent = () => {
    if (sensorType === "soil") {
      return (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Soil Moisture by Plant</Text>

          {availableZones.length > 0 && (
            <ZoneSelector
              selectedZone={selectedZone}
              onZoneSelect={handleZoneSelect}
              zones={availableZones}
            />
          )}

          {filteredSoilData.length === 0 ? (
            <EmptyState
              icon="leaf-outline"
              title="No Plants Found"
              subtitle={
                selectedZone
                  ? `No plants with soil sensors found in ${sensorService.getZoneDisplayName(
                      selectedZone
                    )}`
                  : "No plants with soil sensors found"
              }
            />
          ) : (
            <View style={styles.plantsContainer}>
              {filteredSoilData.map((plant) => (
                <SoilMoisturePlantCard key={plant.plantId} plantData={plant} />
              ))}
            </View>
          )}
        </View>
      );
    } else if (environmentalData) {
      return (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Environmental Data</Text>
          <EnvironmentalDataCard
            data={environmentalData}
            sensorType={sensorType}
          />
        </View>
      );
    }

    return null;
  };

  const shouldShowSummary = () => {
    return (
      (sensorType !== "soil" && environmentalData) ||
      (sensorType === "soil" && soilMoistureData.length > 0)
    );
  };

  // Early returns for loading and error states
  if (!sensorConfig.name) {
    return (
      <View style={styles.container}>
        <Header
          title={sensorConfig.name || "Sensor Config"}
          showBackButton={true}
          showNotifications={true}
        />
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

  // Main render
  return (
    <View style={styles.container}>
      <Header title={sensorConfig.name} showBackButton />

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.scrollContainer}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            colors={["#174d3c"]}
            tintColor="#174d3c"
          />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Sensor Header */}
        <SensorHeader sensorConfig={sensorConfig} />

        {/* Main Content */}
        {renderContent()}

        {/* Summary Statistics */}
        {shouldShowSummary() && (
          <SummaryStats
            sensorType={sensorType}
            environmentalData={environmentalData}
            soilMoistureData={soilMoistureData}
            availableZones={availableZones}
            sensorConfig={sensorConfig}
          />
        )}

        {/* Bottom padding for better spacing */}
        <View style={styles.bottomPadding} />
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
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#174d3c",
    marginBottom: 16,
  },
  plantsContainer: {
    gap: 12,
  },
  bottomPadding: {
    height: 32,
  },
});
