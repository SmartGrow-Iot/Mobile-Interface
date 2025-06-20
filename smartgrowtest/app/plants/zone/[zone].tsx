// app/plants/zone/[zone].tsx - Updated with actuator data
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import Header from "../../../components/Header";
import { apiRequest } from "@/services/api";
import { PlantDetail } from "@/types/Plant";

// Types for actuator data
interface ActuatorData {
  actuatorId: string;
  actuatorModel: string;
  description: string;
  type: "watering" | "light" | "fan";
  zone: string;
  createdAt: string;
}

interface ZoneActuatorsResponse {
  count: number;
  actuators: ActuatorData[];
}

interface ActuatorSummary {
  watering: ActuatorData[];
  light: ActuatorData[];
  fan: ActuatorData[];
}

export default function ZoneScreen() {
  const { zone } = useLocalSearchParams();
  const router = useRouter();
  const [zonePlants, setZonePlants] = useState<PlantDetail[]>([]);
  const [actuators, setActuators] = useState<ActuatorSummary>({
    watering: [],
    light: [],
    fan: [],
  });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Zone display name mapping
  const getZoneDisplayName = (zoneId: string): string => {
    const zoneMap: Record<string, string> = {
      zone1: "Zone 1",
      zone2: "Zone 2",
      zone3: "Zone 3",
      zone4: "Zone 4",
    };
    return zoneMap[zoneId] || zoneId;
  };

  // Fetch plants for the zone
  const fetchPlants = async () => {
    try {
      console.log("Fetching plants for zone:", zone);
      const response = await apiRequest(`/zones/${zone}/plants`);
      console.log("Fetched Plants:", response);
      const plants = response?.plants || [];
      setZonePlants(plants);
    } catch (error) {
      console.error("Error fetching plants:", error);
      setZonePlants([]);
    }
  };

  // Fetch actuators for the zone
  const fetchActuators = async () => {
    const actuatorTypes: ("watering" | "light" | "fan")[] = [
      "watering",
      "light",
      "fan",
    ];
    const newActuators: ActuatorSummary = {
      watering: [],
      light: [],
      fan: [],
    };

    try {
      console.log("Fetching actuators for zone:", zone);

      // Fetch each type of actuator
      for (const type of actuatorTypes) {
        try {
          const response: ZoneActuatorsResponse = await apiRequest(
            `/actuators/zone/${zone}?type=${type}`
          );
          console.log(`${type} actuators in ${zone}:`, response.count);
          newActuators[type] = (response.actuators || []).filter(
              (actuator) => actuator?.actuatorId
          );
        } catch (error) {
          console.error(`Error fetching ${type} actuators:`, error);
          newActuators[type] = [];
        }
      }

      setActuators(newActuators);
    } catch (error) {
      console.error("Error fetching actuators:", error);
    }
  };

  // Initial data fetch
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        await Promise.all([fetchPlants(), fetchActuators()]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [zone]);

  // Handle refresh
  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await Promise.all([fetchPlants(), fetchActuators()]);
    } finally {
      setRefreshing(false);
    }
  };

  // Handle plant press
  const handlePlantPress = (plantId: string) => {
    router.push(`/plants/${plantId}`);
  };

  // Handle actuator press - navigate to actuator override
  const handleActuatorPress = (actuator: ActuatorData) => {
    router.push({
      pathname: "/actuator/override",
      params: {
        zone: zone,
        actuatorId: actuator.actuatorId,
        actuatorType: actuator.type,
      },
    });
  };

  // Get icon for actuator type
  const getActuatorIcon = (type: string): keyof typeof Ionicons.glyphMap => {
    switch (type) {
      case "watering":
        return "water-outline";
      case "light":
        return "sunny-outline";
      case "fan":
        return "leaf-outline";
      default:
        return "hardware-chip-outline";
    }
  };

  // Get color for actuator type
  const getActuatorColor = (type: string): string => {
    switch (type) {
      case "watering":
        return "#45aaf2";
      case "light":
        return "#f7b731";
      case "fan":
        return "#4caf50";
      default:
        return "#666";
    }
  };

  // Calculate total actuators
  const totalActuators =
    actuators.watering.length + actuators.light.length + actuators.fan.length;

  // Custom breadcrumbs for zone page
  const customBreadcrumbs = [
    { label: "Home", route: "/" },
    { label: getZoneDisplayName(zone as string) },
  ];

  if (loading) {
    return (
      <View style={styles.container}>
        <Header
          title={getZoneDisplayName(zone as string)}
          showBackButton={true}
          customBreadcrumbs={customBreadcrumbs}
        />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#174d3c" />
          <Text style={styles.loadingText}>Loading zone data...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header
        title={getZoneDisplayName(zone as string)}
        showBackButton={true}
        customBreadcrumbs={customBreadcrumbs}
      />

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={["#174d3c"]}
            tintColor="#174d3c"
          />
        }
      >
        {/* Zone Summary */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Zone Summary</Text>
          <View style={styles.summaryRow}>
            <View style={styles.summaryItem}>
              <Ionicons name="leaf-outline" size={24} color="#4caf50" />
              <Text style={styles.summaryValue}>{zonePlants.length}</Text>
              <Text style={styles.summaryLabel}>Plants</Text>
            </View>
            <View style={styles.summaryItem}>
              <Ionicons
                name="hardware-chip-outline"
                size={24}
                color="#2196f3"
              />
              <Text style={styles.summaryValue}>{totalActuators}</Text>
              <Text style={styles.summaryLabel}>Actuators</Text>
            </View>
            <View style={styles.summaryItem}>
              <Ionicons
                name="checkmark-circle-outline"
                size={24}
                color="#ff9800"
              />
              <Text style={styles.summaryValue}>
                {zonePlants.filter((p) => p.status === "optimal").length}
              </Text>
              <Text style={styles.summaryLabel}>Healthy</Text>
            </View>
          </View>
        </View>

        {/* Actuators Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Actuators ({totalActuators})</Text>

          {/* Watering Actuators */}
          <View style={styles.actuatorTypeSection}>
            <Text style={styles.actuatorTypeTitle}>
              💧 Watering Systems ({actuators.watering.length})
            </Text>
            {actuators.watering.length === 0 ? (
              <Text style={styles.noActuatorsText}>
                No watering actuators found
              </Text>
            ) : (
              actuators.watering.map((actuator) => (
                <TouchableOpacity
                  key={actuator.actuatorId}
                  style={styles.actuatorCard}
                  onPress={() => handleActuatorPress(actuator)}
                >
                  <View style={styles.actuatorHeader}>
                    <Ionicons
                      name={getActuatorIcon(actuator.type)}
                      size={24}
                      color={getActuatorColor(actuator.type)}
                    />
                    <Text style={styles.actuatorModel}>
                      {actuator.actuatorModel}
                    </Text>
                  </View>
                  <Text style={styles.actuatorDescription}>
                    {actuator.description}
                  </Text>
                  <Text style={styles.actuatorId}>
                    ID: {actuator.actuatorId}
                  </Text>
                </TouchableOpacity>
              ))
            )}
          </View>

          {/* Light Actuators */}
          <View style={styles.actuatorTypeSection}>
            <Text style={styles.actuatorTypeTitle}>
              ☀️ Light Systems ({actuators.light.length})
            </Text>
            {actuators.light.length === 0 ? (
              <Text style={styles.noActuatorsText}>
                No light actuators found
              </Text>
            ) : (
              actuators.light.map((actuator) => (
                <TouchableOpacity
                  key={actuator.actuatorId}
                  style={styles.actuatorCard}
                  onPress={() => handleActuatorPress(actuator)}
                >
                  <View style={styles.actuatorHeader}>
                    <Ionicons
                      name={getActuatorIcon(actuator.type)}
                      size={24}
                      color={getActuatorColor(actuator.type)}
                    />
                    <Text style={styles.actuatorModel}>
                      {actuator.actuatorModel}
                    </Text>
                  </View>
                  <Text style={styles.actuatorDescription}>
                    {actuator.description}
                  </Text>
                  <Text style={styles.actuatorId}>
                    ID: {actuator.actuatorId}
                  </Text>
                </TouchableOpacity>
              ))
            )}
          </View>

          {/* Fan Actuators */}
          <View style={styles.actuatorTypeSection}>
            <Text style={styles.actuatorTypeTitle}>
              🌪️ Ventilation Systems ({actuators.fan.length})
            </Text>
            {actuators.fan.length === 0 ? (
              <Text style={styles.noActuatorsText}>No fan actuators found</Text>
            ) : (
              actuators.fan.map((actuator) => (
                <TouchableOpacity
                  key={actuator.actuatorId}
                  style={styles.actuatorCard}
                  onPress={() => handleActuatorPress(actuator)}
                >
                  <View style={styles.actuatorHeader}>
                    <Ionicons
                      name={getActuatorIcon(actuator.type)}
                      size={24}
                      color={getActuatorColor(actuator.type)}
                    />
                    <Text style={styles.actuatorModel}>
                      {actuator.actuatorModel}
                    </Text>
                  </View>
                  <Text style={styles.actuatorDescription}>
                    {actuator.description}
                  </Text>
                  <Text style={styles.actuatorId}>
                    ID: {actuator.actuatorId}
                  </Text>
                </TouchableOpacity>
              ))
            )}
          </View>
        </View>

        {/* Plants Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Plants ({zonePlants.length})</Text>
          <View style={styles.plantsGrid}>
            {zonePlants.length === 0 ? (
              <Text style={styles.noPlantsText}>
                No plants found in this zone
              </Text>
            ) : (
              zonePlants.map((plant) => (
                <TouchableOpacity
                  key={plant.plantId}
                  style={styles.plantCard}
                  onPress={() => handlePlantPress(plant.plantId)}
                >
                  <View style={styles.plantHeader}>
                    <Text style={styles.plantName}>{plant.name}</Text>
                    <View
                      style={[
                        styles.statusBadge,
                        {
                          backgroundColor:
                            plant.status === "optimal" ? "#4CAF50" : "#FF5252",
                        },
                      ]}
                    >
                      <Text style={styles.statusText}>{plant.status}</Text>
                    </View>
                  </View>
                  <Text style={styles.plantType}>{plant.type}</Text>
                  <View style={styles.plantStats}>
                    <View style={styles.statItem}>
                      <Ionicons
                        name="water-outline"
                        size={20}
                        color="#45aaf2"
                      />
                      <Text style={styles.statValue}>{plant.waterLevel}%</Text>
                    </View>
                    <View style={styles.statItem}>
                      <Ionicons
                        name="sunny-outline"
                        size={20}
                        color="#f7b731"
                      />
                      <Text style={styles.statValue}>{plant.lightLevel}%</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))
            )}
          </View>
        </View>
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
  },
  scrollContent: {
    paddingBottom: 32,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#666",
  },
  summaryCard: {
    backgroundColor: "#fff",
    margin: 16,
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#174d3c",
    marginBottom: 16,
    textAlign: "center",
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  summaryItem: {
    alignItems: "center",
  },
  summaryValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginTop: 8,
  },
  summaryLabel: {
    fontSize: 12,
    color: "#666",
    marginTop: 4,
  },
  section: {
    marginHorizontal: 16,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#174d3c",
    marginBottom: 16,
  },
  actuatorTypeSection: {
    marginBottom: 20,
  },
  actuatorTypeTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 12,
  },
  actuatorCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  actuatorHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  actuatorModel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginLeft: 12,
  },
  actuatorDescription: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  actuatorId: {
    fontSize: 12,
    color: "#999",
    fontFamily: "monospace",
  },
  noActuatorsText: {
    fontSize: 14,
    color: "#999",
    fontStyle: "italic",
    textAlign: "center",
    paddingVertical: 16,
  },
  plantsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  plantCard: {
    width: "48%",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  plantHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  plantName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#174d3c",
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
  plantType: {
    fontSize: 14,
    color: "#666",
    marginBottom: 12,
  },
  plantStats: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  statValue: {
    marginLeft: 4,
    fontSize: 14,
    color: "#666",
    fontWeight: "500",
  },
  noPlantsText: {
    fontSize: 14,
    color: "#999",
    fontStyle: "italic",
    textAlign: "center",
    paddingVertical: 20,
  },
});
