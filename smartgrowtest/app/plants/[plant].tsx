// app/plants/[plant].tsx - Updated PlantProfile component
import React, { useState, useEffect, act } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { apiRequest } from "@/services/api";
import Header from "../../components/Header";

// Import new components
import { PlantProfileCard } from "../../components/features/plants/PlantProfileCard";
import { PlantThresholds } from "../../components/features/plants/PlantThresholds";
import { PlantInfoCards } from "../../components/features/plants/PlantInfoCards";
import { PlantReadings } from "../../components/features/plants/PlantReadings";
import { EmptyState } from "../../components/ui/EmptyState";
import { LoadingSpinner } from "../../components/LoadingSpinner";

// Import data
import { getPlantDetails } from "../../data/plantDetails";
import { PlantDetail } from "@/types/Plant";

type Plant = {
  plantId: string;
  name: string;
  status: "Optimal" | "Critical";
  waterLevel: number;
  lightLevel: number;
};

const plantsTempIdFromFirestore: Record<string, Plant> = {
  "plant_iKjnBJcBaGTx6LyCXUy2" : {
      plantId: "plant_iKjnBJcBaGTx6LyCXUy2",
      name: "",
      status: "Optimal",
      waterLevel: 80,
      lightLevel: 70,
  },
  "plant_hG7bPH7Np9WXtDe1zBVE" : {
      plantId: "plant_hG7bPH7Np9WXtDe1zBVE",
      name: "",
      status: "Optimal",
      waterLevel: 80,
      lightLevel: 70,
  },
  "plant_ZTMJl94GubdbY8T6U4i9" : {
      plantId: "plant_ZTMJl94GubdbY8T6U4i9",
      name: "",
      status: "Optimal",
      waterLevel: 80,
      lightLevel: 70,
  },
  "plant_SJQugVvNBWXmlz9uCq5X" : {
      plantId: "plant_SJQugVvNBWXmlz9uCq5X",
      name: "",
      status: "Critical",
      waterLevel: 80,
      lightLevel: 70,
  },
  "plant_O51I3DvK6R0qygm5k5R9" : {
      plantId: "plant_O51I3DvK6R0qygm5k5R9",
      name: "",
      status: "Optimal",
      waterLevel: 80,
      lightLevel: 70,
  },
  "plant_JU4Rj78DEHUM2lNYHzd3" : {
      plantId: "plant_JU4Rj78DEHUM2lNYHzd3",
      name: "",
      status: "Optimal",
      waterLevel: 80,
      lightLevel: 70,
  },
  "plant_CyhF06FW5a1KTmCvM0zf" : {
      plantId: "plant_CyhF06FW5a1KTmCvM0zf",
      name: "",
      status: "Critical",
      waterLevel: 80,
      lightLevel: 70,
  },
}

export default function PlantProfile() {
  const { plant } = useLocalSearchParams();
  console.log('Curretn Plant Id: ', plant)
  const router = useRouter();
  const [plantDetails, setPlantDetails] = useState<PlantDetail>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  const fetchPlant = async () => {
    try {
      setLoading(true);
      if (!plant) return; // ensure plant ID is available
      const plantData = await apiRequest(`/plants/${plant}`);
      console.log('Fetched Plant Data: ', plantData)
      setPlantDetails(plantData); // since apiRequest already returns parsed data
    } catch (error) {
      console.error('Error fetching plant:', error);
    } finally {
      setLoading(false);
    }
  };

  fetchPlant();
}, [plant]);

  const plantKey = typeof plant === "string" ? plant.trim() : "";
  console.log(plantDetails)
  const data = plantDetails;

  // Handle actuator override - navigate to actuator override page
  const handleActuatorPress = () => {
    if (plantDetails) {
      // Pass both zone and plant information to the actuator override page
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

  // Loading state (you could add actual loading logic here)
  const isLoading = false;

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Header title="Plant Profile" showBackButton={true} />
        <LoadingSpinner text="Loading plant data..." />
      </View>
    );
  }

  if (!plantDetails) {
    return (
      <View style={styles.container}>
        <Header title="Plant Not Found" showBackButton={true} />
        <View style={styles.content}>
          <EmptyState
            icon="leaf-outline"
            title="Plant not found"
            subtitle={`The plant with ID "${plantKey}" doesn't exist or may have been removed.`}
          />
        </View>
      </View>
    );
  }

  // Custom breadcrumbs for details page
  const customBreadcrumbs = [
    { label: "Home", route: "/" },
    { label: 'A', route: `/plants/zone/A` },
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

      {/* Main Content in ScrollView */}
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Plant Card & Thresholds Section */}
        <View style={styles.topSection}>
          <PlantProfileCard name={plantDetails.name} image={"🌶️"} size="medium" />
          <View style={styles.thresholdsContainer}>
            <PlantThresholds
              thresholds={
                [
                  {
                    label: "Light Threshold is",
                    value: "Optimal",
                    color: "#222",
                    bg: "#f5f5f5",
                    icon: "☀️",
                  },
                  {
                    label: "Water Threshold is",
                    value: "Critical",
                    color: "red",
                    bg: "#fff",
                    icon: "💧",
                  },
                ]
              }
              actuatorText={"Override Actuator"}
              onActuatorPress={handleActuatorPress}
            />
          </View>
        </View>

        <PlantInfoCards 
          plantInfo={{
            datePlanted: new Date(plantDetails.createdAt).toLocaleDateString('en-GB'),
            optimalMoisture: plantDetails.thresholds.moisture.min+' - '+plantDetails.thresholds.moisture.max+' %',
            optimalLight: plantDetails.thresholds.light.min+' - '+plantDetails.thresholds.light.max+' %',
            optimalTemp: plantDetails.thresholds.temperature.min+' - '+plantDetails.thresholds.temperature.max+' C',
            type: plantDetails.type,
            growthTime: plantDetails.growthTime,
            notes: plantDetails.description || "",
          }}
        />

        {/* Sensor Readings */}
        {/* <PlantReadings readings={data.readings} /> */}
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
});
