// components/features/zones/ZoneGrid.tsx
import React from "react";
import { View, StyleSheet, FlatList } from "react-native";
import { Zone } from "../../../types/Zone";
import { ZoneCard } from "./ZoneCard";

type ZoneGridProps = {
  zones: Zone[];
  onZonePress?: (zone: Zone) => void;
  numColumns?: number;
  cardSize?: "small" | "medium" | "large";
  showStats?: boolean;
};

export function ZoneGrid({
  zones,
  onZonePress,
  numColumns = 2,
  cardSize = "medium",
  showStats = true,
}: ZoneGridProps) {
  return (
    <FlatList
      data={zones}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <ZoneCard
          zone={item}
          onPress={onZonePress}
          size={cardSize}
          showStats={showStats}
        />
      )}
      numColumns={numColumns}
      columnWrapperStyle={numColumns > 1 ? styles.row : undefined}
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
      scrollEnabled={false}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingBottom: 32,
  },
  row: {
    justifyContent: "space-between",
  },
});
