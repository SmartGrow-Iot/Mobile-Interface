// app/plants/[plant].tsx - Updated to use API documentation 4.2 Get Plant Profile
import React, { useState, useEffect } from "react";
import { View, StyleSheet, ScrollView, Text } from "react-native"; // Added Text import
import { useLocalSearchParams, useRouter } from "expo-router";
import { apiRequest } from "@/services/api";
import Header from "../../components/Header";

// Import new components
import { PlantProfileCard } from "../../components/features/plants/PlantProfileCard";
import { PlantThresholds } from "../../components/features/plants/PlantThresholds";
import { PlantInfoCards } from "../../components/features/plants/PlantInfoCards";
import { EmptyState } from "../../components/ui/EmptyState";
import { LoadingSpinner } from "../../components/LoadingSpinner";

// Types based on API documentation 4.2 Get Plant Profile
interface PlantProfileResponse {
  plantId: string;
  name: string;
  species: string;
  zone: string;
  moisturePin: number;
  thresholds: {
    moisture: { min: number; max: number };
    temperature: { min: number; max: number };
    humidity: { min: number; max: number };
    light: { min: number; max: number };
  };
  zoneHardware: {
    sensors: {
      light: string;
      temperature: string;
      humidity: string;
      moisture: string;
      airQuality: string;
    };
    actuators: {
      pump: string;
      light: string;
      fan: string;
    };
  };
  status: "OPTIMAL" | "WARNING" | "CRITICAL";
  createdAt: string; // ISO8601 timestamp
}

export default function PlantProfile() {
  const { plant } = useLocalSearchParams();
  const router = useRouter();
  const [plantDetails, setPlantDetails] = useState<PlantProfileResponse | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPlant = async () => {
      try {
        setLoading(true);
        setError(null);

        if (!plant) {
          setError("Plant ID is required");
          return;
        }

        console.log("Fetching plant data for ID:", plant);

        // Use API 4.2: GET /v1/plants/{plant_id}
        const plantData: PlantProfileResponse = await apiRequest(
          `/plants/${plant}`
        );
        console.log("Fetched Plant Data:", plantData);

        setPlantDetails(plantData);
      } catch (error) {
        console.error("Error fetching plant:", error);
        setError(
          error instanceof Error ? error.message : "Failed to fetch plant data"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchPlant();
  }, [plant]);

  // Handle actuator override - navigate to actuator override page
  const handleActuatorPress = () => {
    if (plantDetails) {
      router.push({
        pathname: "/actuator/override",
        params: {
          zone: plantDetails.zone,
          plant: plantDetails.name,
          plantId: plantDetails.plantId,
        },
      });
    }
  };

  // Format zone display name
  const getZoneDisplayName = (zone: string): string => {
    const zoneMap: Record<string, string> = {
      zone1: "Zone 1",
      zone2: "Zone 2",
      zone3: "Zone 3",
      zone4: "Zone 4",
    };
    return zoneMap[zone] || zone;
  };

  // Get plant icon based on species or zone
  const getPlantIcon = (species: string | undefined, zone: string): string => {
    const safeSpecies = species?.toLowerCase() || "";
    if (safeSpecies.includes("chili") || safeSpecies.includes("pepper")) {
      return "🌶️";
    }
    if (safeSpecies.includes("eggplant") || safeSpecies.includes("aubergine")) {
      return "🍆";
    }
    // Fallback based on zone
    if (zone === "zone1" || zone === "zone2") {
      return "🌶️";
    }
    if (zone === "zone3" || zone === "zone4") {
      return "🍆";
    }
    return "🌱"; // Default fallback
  };

  // Loading state
  if (loading) {
    return (
      <View style={styles.container}>
        <Header title="Plant Profile" showBackButton={true} />
        <LoadingSpinner text="Loading plant data..." />
      </View>
    );
  }

  // Error state
  if (error || !plantDetails) {
    return (
      <View style={styles.container}>
        <Header title="Plant Not Found" showBackButton={true} />
        <View style={styles.content}>
          <EmptyState
            icon="leaf-outline"
            title="Plant not found"
            subtitle={
              error ||
              `The plant with ID "${plant}" doesn't exist or may have been removed.`
            }
          />
        </View>
      </View>
    );
  }

  // Custom breadcrumbs for details page
  const customBreadcrumbs = [
    { label: "Home", route: "/" },
    {
      label: getZoneDisplayName(plantDetails.zone),
      route: `/plants/zone/${plantDetails.zone}`,
    },
    { label: plantDetails.name },
  ];

  // Prepare threshold data for display
  const thresholdData = [
    {
      label: "Moisture Level is",
      value:
        plantDetails.status === "OPTIMAL"
          ? "Optimal"
          : plantDetails.status === "WARNING"
          ? "Warning"
          : "Critical",
      color:
        plantDetails.status === "OPTIMAL"
          ? "#27ae60"
          : plantDetails.status === "WARNING"
          ? "#f39c12"
          : "#e74c3c",
      bg:
        plantDetails.status === "OPTIMAL"
          ? "#e8f5e8"
          : plantDetails.status === "WARNING"
          ? "#fdf6e3"
          : "#fdf2f2",
      icon: "💧",
    },
    {
      label: "Temperature is",
      value: "Optimal", // Default since we don't have real-time data
      color: "#27ae60",
      bg: "#e8f5e8",
      icon: "🌡️",
    },
  ];

  // Prepare plant info for display
  const plantInfo = {
    datePlanted: new Date(plantDetails.createdAt).toLocaleDateString("en-GB"),
    optimalMoisture: `${plantDetails.thresholds.moisture.min} - ${plantDetails.thresholds.moisture.max}%`,
    optimalLight: `${plantDetails.thresholds.light.min} - ${plantDetails.thresholds.light.max}%`,
    optimalTemp: `${plantDetails.thresholds.temperature.min} - ${plantDetails.thresholds.temperature.max}°C`,
    type: plantDetails.species,
    growthTime: "8-12 weeks", // Default value
    notes: `Planted in ${getZoneDisplayName(
      plantDetails.zone
    )} with moisture sensor on pin ${plantDetails.moisturePin}`,
  };

  return (
    <View style={styles.container}>
      {/* Header Component */}
      <Header
        title="Plant Details"
        showBackButton={true}
        customBreadcrumbs={customBreadcrumbs}
      />

      {/* Main Content in ScrollView */}
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Plant Card & Thresholds Section */}
        <View style={styles.topSection}>
          <PlantProfileCard
            name={plantDetails.name}
            image={getPlantIcon(plantDetails.species, plantDetails.zone)}
            size="medium"
          />
          <View style={styles.thresholdsContainer}>
            <PlantThresholds
              thresholds={thresholdData}
              actuatorText="Override Actuator"
              onActuatorPress={handleActuatorPress}
            />
          </View>
        </View>

        {/* Plant Information Cards */}
        <PlantInfoCards plantInfo={plantInfo} />

        {/* Hardware Information */}
        <View style={styles.hardwareSection}>
          <View style={styles.hardwareCard}>
            <View style={styles.hardwareHeader}>
              <Text style={styles.hardwareTitle}>Zone Hardware</Text>
              <Text style={styles.hardwareSubtitle}>
                {getZoneDisplayName(plantDetails.zone)}
              </Text>
            </View>

            <View style={styles.hardwareGrid}>
              <View style={styles.hardwareItem}>
                <Text style={styles.hardwareLabel}>Sensors</Text>
                <Text style={styles.hardwareValue}>
                  Light:{" "}
                  {plantDetails.zoneHardware.sensors.light?.slice(-4) || "N/A"}
                </Text>
                <Text style={styles.hardwareValue}>
                  Moisture:{" "}
                  {plantDetails.zoneHardware.sensors.moisture?.slice(-4) ||
                    "N/A"}
                </Text>
                <Text style={styles.hardwareValue}>
                  Temp:{" "}
                  {plantDetails.zoneHardware.sensors.temperature?.slice(-4) ||
                    "N/A"}
                </Text>
              </View>

              <View style={styles.hardwareItem}>
                <Text style={styles.hardwareLabel}>Actuators</Text>
                <Text style={styles.hardwareValue}>
                  Pump:{" "}
                  {plantDetails.zoneHardware.actuators.pump?.slice(-4) || "N/A"}
                </Text>
                <Text style={styles.hardwareValue}>
                  Light:{" "}
                  {plantDetails.zoneHardware.actuators.light?.slice(-4) ||
                    "N/A"}
                </Text>
                <Text style={styles.hardwareValue}>
                  Fan:{" "}
                  {plantDetails.zoneHardware.actuators.fan?.slice(-4) || "N/A"}
                </Text>
              </View>
            </View>
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
  topSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 20,
    marginBottom: 20,
  },
  thresholdsContainer: {
    flex: 1,
    marginLeft: 12,
  },
  hardwareSection: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
  hardwareCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  hardwareHeader: {
    marginBottom: 16,
  },
  hardwareTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#174d3c",
    marginBottom: 4,
  },
  hardwareSubtitle: {
    fontSize: 14,
    color: "#666",
  },
  hardwareGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  hardwareItem: {
    flex: 1,
    marginHorizontal: 8,
  },
  hardwareLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  hardwareValue: {
    fontSize: 12,
    color: "#666",
    marginBottom: 4,
    fontFamily: "monospace",
  },
});
