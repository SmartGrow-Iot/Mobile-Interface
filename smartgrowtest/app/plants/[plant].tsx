// app/plants/[plant].tsx - Correct PlantProfile component
import React from "react";
import { View, StyleSheet, ScrollView, Alert } from "react-native";
import { useLocalSearchParams } from "expo-router";
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

export default function PlantProfile() {
  const { plant } = useLocalSearchParams();
  const plantKey = typeof plant === "string" ? plant.trim().toUpperCase() : "";
  const data = getPlantDetails(plantKey);


  // Handle actuator override
  const handleActuatorPress = () => {
    Alert.alert(
      "Override Actuator",
      "This will manually override the automatic controls. Are you sure?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Override",
          style: "destructive",
          onPress: () => {
            // In a real app, this would trigger actuator override
            Alert.alert("Success", "Actuator override activated");
          },
        },
      ]
    );
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

  if (!data) {
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

  // Custom breadcrumbs for plant profile page
  const customBreadcrumbs = [
    { label: "Home", route: "/" },
    { label: data.zone, route: `/plants/zone/${data.zone}` },
    { label: data.name },
  ];

  return (
    <View style={styles.container}>
      {/* Header Component */}
      <Header
        title="Plant Profile"
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
          <PlantProfileCard name={data.name} image={data.image} size="medium" />
          <View style={styles.thresholdsContainer}>
            <PlantThresholds
              thresholds={data.thresholds}
              actuatorText={data.actuator}
              onActuatorPress={handleActuatorPress}
            />
          </View>
        </View>

        {/* Plant Information Cards */}
        <PlantInfoCards
          plantInfo={{
            datePlanted: data.datePlanted,
            optimalMoisture: data.optimalMoisture,
            optimalLight: data.optimalLight,
            optimalTemp: data.optimalTemp,
            type: data.type,
            growthTime: data.growthTime,
            notes: data.notes,
          }}
        />

        {/* Sensor Readings */}
        <PlantReadings readings={data.readings} />
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
