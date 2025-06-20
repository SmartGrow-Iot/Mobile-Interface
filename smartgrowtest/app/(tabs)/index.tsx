// app/(tabs)/index.tsx - Updated with real alert data
import React, { useState, useEffect } from "react";
import { View, StyleSheet, ScrollView, RefreshControl } from "react-native";
import { useRouter } from "expo-router";
import Header from "../../components/Header";

// Import components
import { AlertsList } from "../../components/features/alerts/AlertsList";
import { ZoneTabNavigation } from "../../components/features/zones/ZoneTabNavigation";
import { ZoneGrid } from "../../components/features/zones/ZoneGrid";

// Import data and services
import { mockZoneCategories } from "../../data/zones";
import { alertService } from "../../services/alertService";
import { Alert } from "../../types/Alert";
import { Zone } from "../../types/Zone";

export default function HomePage() {
  const [activeCategory, setActiveCategory] = useState<string>("chili");
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Get active zones based on selected category
  const activeZones =
    mockZoneCategories.find((category) => category.id === activeCategory)
      ?.zones || [];

  // Initialize and subscribe to alerts
  useEffect(() => {
    const initializeAlerts = async () => {
      try {
        setIsLoading(true);

        // Subscribe to alert updates
        const unsubscribe = alertService.subscribe((newAlerts) => {
          setAlerts(newAlerts);
        });

        // Initialize alert service
        await alertService.initialize();

        return unsubscribe;
      } catch (error) {
        console.error("Error initializing alerts:", error);
      } finally {
        setIsLoading(false);
      }
    };

    const unsubscribe = initializeAlerts();

    // Cleanup subscription on unmount
    return () => {
      unsubscribe?.then((cleanup) => cleanup?.());
    };
  }, []);

  // Handle alert press - navigate based on alert type
  const handleAlertPress = (alert: Alert) => {
    console.log("Alert pressed:", alert);

    // Navigate based on alert content
    if (alert.zoneId) {
      // Map zone IDs to display names for navigation
      const zoneRouteMap: Record<string, string> = {
        zone1: "zone1",
        zone2: "zone2",
        zone3: "zone3",
        zone4: "zone4",
      };

      const zoneRoute = zoneRouteMap[alert.zoneId];
      if (zoneRoute) {
        router.push(`/plants/zone/${zoneRoute}`);
        return;
      }
    }

    // Navigate to plant if plantId exists
    if (alert.plantId) {
      router.push(`/plants/${alert.plantId}`);
      return;
    }

    // Navigate to sensor page based on alert type
    switch (alert.type) {
      case "light":
        router.push("/sensors/light");
        break;
      case "water":
        router.push("/sensors/soil");
        break;
      case "temperature":
        router.push("/sensors/temperature");
        break;
      case "humidity":
        router.push("/sensors/humidity");
        break;
      default:
        // For general alerts, stay on current page or show more info
        console.log("General alert, no specific navigation");
        break;
    }
  };

  // Handle alert dismiss
  const handleAlertDismiss = (alert: Alert) => {
    alertService.dismissAlert(alert.id);
  };

  // Handle zone press
  const handleZonePress = (zone: Zone) => {
    router.push(`/plants/zone/${zone.id}`);
  };

  // Handle category change
  const handleCategoryChange = (categoryId: string) => {
    setActiveCategory(categoryId);
  };

  // Handle refresh
  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await alertService.refresh();
    } catch (error) {
      console.error("Error refreshing alerts:", error);
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <View style={styles.container}>
      <Header title="My Plants" showSearch={true} showProfile={true} />

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            colors={["#174d3c"]}
            tintColor="#174d3c"
          />
        }
      >
        {/* Alerts Section */}
        <AlertsList
          alerts={alerts}
          title={`Alerts (${alerts.length})`}
          onAlertPress={handleAlertPress}
          onAlertDismiss={handleAlertDismiss}
          maxItems={3}
          showEmpty={!isLoading}
        />

        {/* Zone Category Tabs */}
        <ZoneTabNavigation
          categories={mockZoneCategories}
          activeCategory={activeCategory}
          onCategoryChange={handleCategoryChange}
        />

        {/* Zones Grid */}
        <ZoneGrid
          zones={activeZones}
          onZonePress={handleZonePress}
          numColumns={1}
          cardSize="large"
          showStats={true}
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
    paddingHorizontal: 16,
    paddingTop: 8,
  },
});