import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import Header from "../../../components/Header"; // Import Header component

type Plant = {
  id: string;
  name: string;
  status: "Optimal" | "Critical";
  waterLevel: number;
  lightLevel: number;
};

const plants: Record<string, Plant[]> = {
  "Zone A": [
    {
      id: "CP-1",
      name: "Chili Plant 1",
      status: "Optimal",
      waterLevel: 75,
      lightLevel: 65,
    },
    {
      id: "CP-2",
      name: "Chili Plant 2",
      status: "Optimal",
      waterLevel: 80,
      lightLevel: 70,
    },
    {
      id: "CP-3",
      name: "Chili Plant 3",
      status: "Critical",
      waterLevel: 45,
      lightLevel: 85,
    },
    {
      id: "CP-4",
      name: "Chili Plant 4",
      status: "Optimal",
      waterLevel: 78,
      lightLevel: 68,
    },
  ],
  "Zone B": [
    {
      id: "CP-5",
      name: "Chili Plant 5",
      status: "Critical",
      waterLevel: 40,
      lightLevel: 90,
    },
    {
      id: "CP-6",
      name: "Chili Plant 6",
      status: "Optimal",
      waterLevel: 82,
      lightLevel: 72,
    },
    {
      id: "CP-7",
      name: "Chili Plant 7",
      status: "Optimal",
      waterLevel: 76,
      lightLevel: 67,
    },
    {
      id: "CP-8",
      name: "Chili Plant 8",
      status: "Optimal",
      waterLevel: 79,
      lightLevel: 69,
    },
  ],
  "Zone C": [
    {
      id: "EP-1",
      name: "Eggplant 1",
      status: "Optimal",
      waterLevel: 77,
      lightLevel: 66,
    },
    {
      id: "EP-2",
      name: "Eggplant 2",
      status: "Optimal",
      waterLevel: 81,
      lightLevel: 71,
    },
    {
      id: "EP-3",
      name: "Eggplant 3",
      status: "Optimal",
      waterLevel: 74,
      lightLevel: 64,
    },
    {
      id: "EP-4",
      name: "Eggplant 4",
      status: "Optimal",
      waterLevel: 83,
      lightLevel: 73,
    },
  ],
  "Zone D": [
    {
      id: "EP-5",
      name: "Eggplant 5",
      status: "Optimal",
      waterLevel: 76,
      lightLevel: 65,
    },
    {
      id: "EP-6",
      name: "Eggplant 6",
      status: "Optimal",
      waterLevel: 79,
      lightLevel: 68,
    },
    {
      id: "EP-7",
      name: "Eggplant 7",
      status: "Optimal",
      waterLevel: 78,
      lightLevel: 67,
    },
    {
      id: "EP-8",
      name: "Eggplant 8",
      status: "Optimal",
      waterLevel: 80,
      lightLevel: 70,
    },
  ],
};

export default function ZoneScreen() {
  const { zone } = useLocalSearchParams();
  const router = useRouter();
  const zonePlants = plants[zone as string] || [];

  const handlePlantPress = (plantId: string) => {
    router.push(`/plants/${plantId}`);
  };

  // Custom breadcrumbs for zone page
  const customBreadcrumbs = [
    { label: "Home", route: "/" },
    { label: zone as string },
  ];

  return (
    <View style={styles.container}>
      {/* Header Component */}
      <Header
        title={zone as string}
        showBackButton={true}
        customBreadcrumbs={customBreadcrumbs}
      />

      {/* Plants Grid in ScrollView */}
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.plantsContainer}
      >
        {zonePlants.map((plant) => (
          <TouchableOpacity
            key={plant.id}
            style={styles.plantCard}
            onPress={() => handlePlantPress(plant.id)}
          >
            <View style={styles.plantHeader}>
              <Text style={styles.plantId}>{plant.id}</Text>
              <View
                style={[
                  styles.statusBadge,
                  {
                    backgroundColor:
                      plant.status === "Optimal" ? "#4CAF50" : "#FF5252",
                  },
                ]}
              >
                <Text style={styles.statusText}>{plant.status}</Text>
              </View>
            </View>
            <Text style={styles.plantName}>{plant.name}</Text>
            <View style={styles.plantStats}>
              <View style={styles.statItem}>
                <Ionicons name="water-outline" size={20} color="#45aaf2" />
                <Text style={styles.statValue}>{plant.waterLevel}%</Text>
              </View>
              <View style={styles.statItem}>
                <Ionicons name="sunny-outline" size={20} color="#f7b731" />
                <Text style={styles.statValue}>{plant.lightLevel}%</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
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
  plantsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 32,
  },
  plantCard: {
    width: "48%",
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  plantHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  plantId: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#174d3c",
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
  plantName: {
    fontSize: 16,
    color: "#333",
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
});
