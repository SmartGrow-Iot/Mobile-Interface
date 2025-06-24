// app/(tabs)/index.tsx - Updated to show 4 zones directly
import React, { useState, useEffect } from "react";
import { View, StyleSheet, ScrollView, RefreshControl } from "react-native";
import { useRouter } from "expo-router";
import Header from "../../components/Header";

// Import components
import { AlertsList } from "../../components/features/alerts/AlertsList";
import { ZoneGrid } from "../../components/features/zones/ZoneGrid";

// Import data and services
import { mockZonesDirect } from "../../data/zones";
import { alertService } from "../../services/alertService";
import { Alert } from "../../types/Alert";
import { Zone } from "../../types/Zone";

export default function HomePage() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // Use direct zones data (4 zones without categories)
  const zones = mockZonesDirect;

  // Initialize and subscribe to alerts - only runs once on mount
  useEffect(() => {
    let unsubscribe: (() => void) | null = null;

    const initializeAlerts = async () => {
      try {
        setIsLoading(true);

        // Subscribe to alert updates first to get immediate updates
        unsubscribe = alertService.subscribe((newAlerts) => {
          setAlerts(newAlerts);
          setIsLoading(false); // Set loading to false when we get data
        });

        // Initialize alert service (will use cache if available)
        await alertService.initialize();
      } catch (error) {
        console.error("Error initializing alerts:", error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAlerts();

    // Cleanup subscription on unmount
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []); // Empty dependency array - only run once on mount

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

  // ✨ Handle refresh with force cache clear
  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      console.log("🔄 Force refreshing alerts...");

      // Force clear cache before refresh
      alertService.forceClearCache();

      // Now refresh which will fetch fresh data
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
            title={
              isRefreshing ? "Force refreshing alerts..." : "Pull to refresh"
            }
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

        {/* Zones Grid - Direct display of 4 zones */}
        <ZoneGrid
          zones={zones}
          onZonePress={handleZonePress}
          numColumns={2}
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
