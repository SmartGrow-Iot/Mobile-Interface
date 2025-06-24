// app/(tabs)/index.tsx - Updated to fetch zones from API
import React, { useState, useEffect } from "react";
import { View, StyleSheet, ScrollView, RefreshControl } from "react-native";
import { useRouter } from "expo-router";
import Header from "../../components/Header";
import { ZoneGrid } from "../../components/features/zones/ZoneGrid";
import { SystemThresholds } from "../../components/features/thresholds/SystemThresholds";
import {
  Zone,
  ZonePlant,
  ZoneHelpers,
  AVAILABLE_ZONES,
} from "../../types/Zone";
import { apiRequest } from "../../services/api";

export default function HomePage() {
  const router = useRouter();
  const [zones, setZones] = useState<Zone[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Fetch zones data from API
  const fetchZonesData = async () => {
    try {
      const zonePromises = AVAILABLE_ZONES.map(async (zoneId) => {
        try {
          // Fetch plants for each zone
          const plantsResponse = await apiRequest(`/zones/${zoneId}/plants`);
          const plants: ZonePlant[] = plantsResponse?.plants || [];

          // Create zone object
          const zone: Zone = {
            id: zoneId,
            name: ZoneHelpers.getZoneDisplayName(zoneId),
            status: ZoneHelpers.getZoneStatus(plants),
            plantCount: plants.length,
            plants: plants,
          };

          return zone;
        } catch (error) {
          console.error(`Error fetching data for ${zoneId}:`, error);
          // Return empty zone if API fails for this zone
          return {
            id: zoneId,
            name: ZoneHelpers.getZoneDisplayName(zoneId),
            status: "optimal" as const,
            plantCount: 0,
            plants: [],
          };
        }
      });

      const zonesData = await Promise.all(zonePromises);
      setZones(zonesData);
    } catch (error) {
      console.error("Error fetching zones data:", error);
      // Set default empty zones if everything fails
      const defaultZones: Zone[] = AVAILABLE_ZONES.map((zoneId) => ({
        id: zoneId,
        name: ZoneHelpers.getZoneDisplayName(zoneId),
        status: "optimal" as const,
        plantCount: 0,
        plants: [],
      }));
      setZones(defaultZones);
    }
  };

  // Initial data fetch
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        await fetchZonesData();
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Handle refresh
  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await fetchZonesData();
    } finally {
      setRefreshing(false);
    }
  };

  // Handle zone press
  const handleZonePress = (zone: Zone) => {
    router.push(`/plants/zone/${zone.id}`);
  };

  return (
    <View style={styles.container}>
      <Header title="My Plants" showSearch={true} showProfile={true} />

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={["#174d3c"]}
            tintColor="#174d3c"
          />
        }
      >
        {/* System Thresholds Component */}
        <SystemThresholds />

        {/* Zones Grid - Display all 4 zones */}
        <ZoneGrid
          zones={zones}
          onZonePress={handleZonePress}
          numColumns={2}
          cardSize="medium"
          title="All Zones"
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  content: {
    flex: 1,
    paddingTop: 8,
  },
});
