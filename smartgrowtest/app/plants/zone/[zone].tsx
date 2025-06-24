// app/plants/zone/[zone].tsx - Simplified for API data only
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
import { Zone, ZonePlant, ZoneInfo, ZoneHelpers } from "@/types/Zone";

export default function ZoneScreen() {
  const { zone } = useLocalSearchParams();
  const router = useRouter();
  const [zoneData, setZoneData] = useState<Zone | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Fetch zone data from API
  const fetchZoneData = async () => {
    try {
      console.log("Fetching data for zone:", zone);

      // Fetch plants in the zone
      const plantsResponse = await apiRequest(`/zones/${zone}/plants`);
      console.log("Zone plants response:", plantsResponse);

      // Fetch zone info
      const zoneInfoResponse = await apiRequest(`/zones/${zone}`);
      console.log("Zone info response:", zoneInfoResponse);

      const plants: ZonePlant[] = plantsResponse?.plants || [];
      const zoneInfo: ZoneInfo = zoneInfoResponse;

      // Create zone object
      const zoneObject: Zone = {
        id: zone as string,
        name: ZoneHelpers.getZoneDisplayName(zone as string),
        status: ZoneHelpers.getZoneStatus(plants),
        plantCount: plants.length,
        plants: plants,
        zoneInfo: zoneInfo,
      };

      setZoneData(zoneObject);
    } catch (error) {
      console.error("Error fetching zone data:", error);
      // Create empty zone if API fails
      setZoneData({
        id: zone as string,
        name: ZoneHelpers.getZoneDisplayName(zone as string),
        status: "optimal",
        plantCount: 0,
        plants: [],
      });
    }
  };

  // Initial data fetch
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        await fetchZoneData();
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
      await fetchZoneData();
    } finally {
      setRefreshing(false);
    }
  };

  // Handle plant press
  const handlePlantPress = (plantId: string) => {
    router.push(`/plants/${plantId}`);
  };

  // Handle actuator press - navigate to actuator override
  const handleActuatorPress = () => {
    router.push({
      pathname: "/actuator/override",
      params: {
        zone: zone,
      },
    });
  };

  // Custom breadcrumbs for zone page
  const customBreadcrumbs = [
    { label: "Home", route: "/" },
    { label: zoneData?.name || "Zone" },
  ];

  if (loading) {
    return (
      <View style={styles.container}>
        <Header
          title={ZoneHelpers.getZoneDisplayName(zone as string)}
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

  if (!zoneData) {
    return (
      <View style={styles.container}>
        <Header title="Zone Not Found" showBackButton={true} />
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Failed to load zone data</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header
        title={zoneData.name}
        showBackButton={true}
        showNotifications={true} 
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
              <Text style={styles.summaryValue}>{zoneData.plantCount}</Text>
              <Text style={styles.summaryLabel}>Plants</Text>
            </View>
            <View style={styles.summaryItem}>
              <Ionicons
                name="checkmark-circle-outline"
                size={24}
                color="#2ecc71"
              />
              <Text style={styles.summaryValue}>
                {zoneData.plants.filter((p) => p.status === "optimal").length}
              </Text>
              <Text style={styles.summaryLabel}>Healthy</Text>
            </View>
            <View style={styles.summaryItem}>
              <Ionicons name="warning-outline" size={24} color="#f39c12" />
              <Text style={styles.summaryValue}>
                {zoneData.plants.filter((p) => p.status === "warning").length}
              </Text>
              <Text style={styles.summaryLabel}>Warning</Text>
            </View>
            <View style={styles.summaryItem}>
              <Ionicons name="alert-circle-outline" size={24} color="#e74c3c" />
              <Text style={styles.summaryValue}>
                {zoneData.plants.filter((p) => p.status === "critical").length}
              </Text>
              <Text style={styles.summaryLabel}>Critical</Text>
            </View>
          </View>
        </View>

        {/* Zone Hardware Info */}
        {zoneData.zoneInfo && (
          <View style={styles.hardwareCard}>
            <Text style={styles.hardwareTitle}>Zone Hardware</Text>
            <View style={styles.hardwareSection}>
              <Text style={styles.hardwareSubtitle}>Actuators</Text>
              <Text style={styles.hardwareItem}>
                💧 Water: {zoneData.zoneInfo.actuators.waterActuator}
              </Text>
              <Text style={styles.hardwareItem}>
                💡 Light: {zoneData.zoneInfo.actuators.lightActuator}
              </Text>
              <Text style={styles.hardwareItem}>
                🌪️ Fan: {zoneData.zoneInfo.actuators.fanActuator}
              </Text>
            </View>

            <View style={styles.hardwareSection}>
              <Text style={styles.hardwareSubtitle}>Sensors</Text>
              <Text style={styles.hardwareItem}>
                ☀️ Light: {zoneData.zoneInfo.sensors.lightSensor}
              </Text>
              <Text style={styles.hardwareItem}>
                🌡️ Temperature: {zoneData.zoneInfo.sensors.tempSensor}
              </Text>
              <Text style={styles.hardwareItem}>
                💧 Humidity: {zoneData.zoneInfo.sensors.humiditySensor}
              </Text>
              <Text style={styles.hardwareItem}>
                🌬️ Air Quality: {zoneData.zoneInfo.sensors.gasSensor}
              </Text>
            </View>

            <TouchableOpacity
              style={styles.actuatorButton}
              onPress={handleActuatorPress}
            >
              <Ionicons name="settings-outline" size={20} color="#fff" />
              <Text style={styles.actuatorButtonText}>Control Actuators</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Plants Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Plants ({zoneData.plantCount})
          </Text>
          <View style={styles.plantsGrid}>
            {zoneData.plants.length === 0 ? (
              <Text style={styles.noPlantsText}>
                No plants found in this zone
              </Text>
            ) : (
              zoneData.plants.map((plant) => (
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
                            plant.status === "optimal"
                              ? "#4CAF50"
                              : plant.status === "warning"
                              ? "#FF9800"
                              : "#FF5252",
                        },
                      ]}
                    >
                      <Text style={styles.statusText}>
                        {plant.status.charAt(0).toUpperCase() +
                          plant.status.slice(1)}
                      </Text>
                    </View>
                  </View>
                  <Text style={styles.plantType}>{plant.type}</Text>
                  <Text style={styles.plantDescription} numberOfLines={2}>
                    {plant.description}
                  </Text>
                  <View style={styles.plantFooter}>
                    <Text style={styles.plantPin}>
                      Pin: {plant.moisturePin}
                    </Text>
                    <Text style={styles.plantDate}>
                      {new Date(plant.createdAt).toLocaleDateString()}
                    </Text>
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
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
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
  hardwareCard: {
    backgroundColor: "#fff",
    margin: 16,
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  hardwareTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#174d3c",
    marginBottom: 16,
    textAlign: "center",
  },
  hardwareSection: {
    marginBottom: 16,
  },
  hardwareSubtitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  hardwareItem: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
    fontFamily: "monospace",
  },
  actuatorButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#174d3c",
    borderRadius: 12,
    padding: 12,
    marginTop: 8,
  },
  actuatorButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
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
    marginBottom: 8,
    textTransform: "capitalize",
  },
  plantDescription: {
    fontSize: 12,
    color: "#666",
    marginBottom: 8,
    lineHeight: 16,
  },
  plantFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  plantPin: {
    fontSize: 12,
    color: "#174d3c",
    fontWeight: "500",
  },
  plantDate: {
    fontSize: 12,
    color: "#999",
  },
  noPlantsText: {
    fontSize: 14,
    color: "#999",
    fontStyle: "italic",
    textAlign: "center",
    paddingVertical: 20,
    width: "100%",
  },
});
