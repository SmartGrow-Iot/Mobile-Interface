// app/(tabs)/index.tsx - Updated with System Thresholds component
import React from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import Header from "../../components/Header";

// Import components
import { ZoneGrid } from "../../components/features/zones/ZoneGrid";
import { SystemThresholds } from "../../components/features/thresholds/SystemThresholds";

// Import data
import { mockZonesDirect } from "../../data/zones";
import { Zone } from "../../types/Zone";

export default function HomePage() {
  const router = useRouter();

  // Use direct zones data (4 zones without categories)
  const zones = mockZonesDirect;

  // Handle zone press
  const handleZonePress = (zone: Zone) => {
    router.push(`/plants/zone/${zone.id}`);
  };

  return (
    <View style={styles.container}>
      <Header title="My Plants" showSearch={true} showProfile={true} />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* System Thresholds Component */}
        <SystemThresholds />

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
    paddingTop: 8,
  },
});
