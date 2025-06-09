// app/(tabs)/index.tsx - Refactored HomePage
import React, { useState } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import Header from "../../components/Header";

// Import new components
import { AlertsList } from "../../components/features/alerts/AlertsList";
import { ZoneTabNavigation } from "../../components/features/zones/ZoneTabNavigation";
import { ZoneGrid } from "../../components/features/zones/ZoneGrid";

// Import data and types
import { mockAlerts } from "../../data/alerts";
import { mockZoneCategories } from "../../data/zones";
import { Alert } from "../../types/Alert";
import { Zone } from "../../types/Zone";

export default function HomePage() {
  const [activeCategory, setActiveCategory] = useState<string>("chili");
  const router = useRouter();

  // Get active zones based on selected category
  const activeZones =
    mockZoneCategories.find((category) => category.id === activeCategory)
      ?.zones || [];

  // Event handlers
  const handleAlertPress = (alert: Alert) => {
    // Navigate to specific alert or related zone/plant
    if (alert.zoneId) {
      router.push(`/plants/zone/${alert.zoneId}`);
    }
  };

  const handleAlertDismiss = (alert: Alert) => {
    // In a real app, this would remove the alert from state/database
    console.log("Dismissing alert:", alert.id);
  };

  const handleZonePress = (zone: Zone) => {
    router.push(`/plants/zone/${zone.id}`);
  };

  const handleCategoryChange = (categoryId: string) => {
    setActiveCategory(categoryId);
  };

  return (
    <View style={styles.container}>
      <Header title="My Plants" showSearch={true} showProfile={true} />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Alerts Section */}
        <AlertsList
          alerts={mockAlerts}
          onAlertPress={handleAlertPress}
          onAlertDismiss={handleAlertDismiss}
          maxItems={3} // Show max 3 alerts on home page
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
          numColumns={2}
          cardSize="medium"
          showStats={true}
        />
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
});
