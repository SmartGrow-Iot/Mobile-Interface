// app/plants/[plant].tsx - Updated to use only API data
import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  Text,
  TouchableOpacity,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { apiRequest } from "@/services/api";
import Header from "../../components/Header";

// Import updated components
import { PlantProfileCard } from "../../components/features/plants/PlantProfileCard";
import { PlantInfoSection } from "../../components/features/plants/PlantInfoSection";
import { PlantHardwareSection } from "../../components/features/plants/PlantHardwareSection";
import { EmptyState } from "../../components/ui/EmptyState";
import { LoadingSpinner } from "../../components/LoadingSpinner";

// Import updated moisture threshold components
import { MoistureThresholdModal } from "../../components/features/thresholds/MoistureThresholdModal";
import { MoistureThresholdRange } from "../../services/moistureThresholdService";

// Import updated types
import { PlantDetail, PlantHelpers } from "../../types/Plant";

export default function PlantProfile() {
  const { plant } = useLocalSearchParams();
  const router = useRouter();
  const [plantDetails, setPlantDetails] = useState<PlantDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Moisture threshold modal state
  const [moistureModalVisible, setMoistureModalVisible] = useState(false);

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
        const plantData: PlantDetail = await apiRequest(`/plants/${plant}`);
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

  // Handle actuator override
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

  // Open moisture threshold modal
  const handleMoistureThresholdPress = () => {
    setMoistureModalVisible(true);
  };

  // Close moisture threshold modal
  const handleMoistureModalClose = () => {
    setMoistureModalVisible(false);
  };

  // Handle moisture thresholds update
  const handleMoistureThresholdsUpdated = (
    newThresholds: MoistureThresholdRange
  ) => {
    if (plantDetails) {
      setPlantDetails((prev) =>
        prev
          ? {
              ...prev,
              thresholds: {
                ...prev.thresholds,
                moisture: newThresholds,
              },
            }
          : null
      );
    }
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

  // Custom breadcrumbs
  const customBreadcrumbs = [
    { label: "Home", route: "/" },
    {
      label: PlantHelpers.getZoneDisplayName(plantDetails.zone),
      route: `/plants/zone/${plantDetails.zone}`,
    },
    { label: plantDetails.name },
  ];

  return (
    <View style={styles.container}>
      {/* Header Component */}
      <Header
        title="Plant Details"
        showBackButton={true}
        customBreadcrumbs={customBreadcrumbs}
      />

      {/* Main Content */}
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Plant Profile Card */}
        <View style={styles.topSection}>
          <PlantProfileCard
            name={plantDetails.name}
            icon={PlantHelpers.getPlantIcon(plantDetails.zone)}
            size="large"
          />
        </View>

        {/* Plant Status and Actions */}
        <View style={styles.actionsSection}>
          {/* Status Card */}
          <View style={styles.statusCard}>
            <View style={styles.statusHeader}>
              <Ionicons
                name="pulse-outline"
                size={20}
                color={
                  plantDetails.status === "optimal"
                    ? "#27ae60"
                    : plantDetails.status === "warning"
                    ? "#f39c12"
                    : "#e74c3c"
                }
              />
              <Text style={styles.statusTitle}>Plant Status</Text>
            </View>
            <Text
              style={[
                styles.statusValue,
                {
                  color:
                    plantDetails.status === "optimal"
                      ? "#27ae60"
                      : plantDetails.status === "warning"
                      ? "#f39c12"
                      : "#e74c3c",
                },
              ]}
            >
              {plantDetails.status.charAt(0).toUpperCase() +
                plantDetails.status.slice(1)}
            </Text>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={handleActuatorPress}
            >
              <Ionicons name="settings-outline" size={16} color="#fff" />
              <Text style={styles.primaryButtonText}>Override Actuator</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={handleMoistureThresholdPress}
            >
              <Ionicons name="water-outline" size={16} color="#3498db" />
              <Text style={styles.secondaryButtonText}>Moisture Settings</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Plant Information */}
        <PlantInfoSection plant={plantDetails} />

        {/* Hardware Information */}
        <PlantHardwareSection plant={plantDetails} />
      </ScrollView>

      {/* Moisture Threshold Modal */}
      {plantDetails && (
        <MoistureThresholdModal
          visible={moistureModalVisible}
          onClose={handleMoistureModalClose}
          plantId={plantDetails.plantId}
          plantName={plantDetails.name}
          plantIcon={PlantHelpers.getPlantIcon(plantDetails.zone)}
          zone={plantDetails.zone}
          moisturePin={plantDetails.moisturePin}
          currentThresholds={plantDetails.thresholds.moisture}
          onThresholdsUpdated={handleMoistureThresholdsUpdated}
        />
      )}
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
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 20,
    marginBottom: 20,
  },
  actionsSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  statusCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  statusHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  statusTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginLeft: 8,
  },
  statusValue: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
  actionButtons: {
    flexDirection: "row",
    gap: 12,
  },
  primaryButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#27ae60",
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  primaryButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
    marginLeft: 6,
  },
  secondaryButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#3498db",
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  secondaryButtonText: {
    color: "#3498db",
    fontWeight: "bold",
    fontSize: 14,
    marginLeft: 6,
  },
});
