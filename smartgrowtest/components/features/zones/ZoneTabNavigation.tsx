// components/features/zones/ZoneTabNavigation.tsx
import React from "react";
import { View, StyleSheet } from "react-native";
import { ZoneCategory } from "../../../types/Zone";
import { TabButton } from "../../ui/TabButton";

type ZoneTabNavigationProps = {
  categories: ZoneCategory[];
  activeCategory: string;
  onCategoryChange: (categoryId: string) => void;
};

export function ZoneTabNavigation({
  categories,
  activeCategory,
  onCategoryChange,
}: ZoneTabNavigationProps) {
  return (
    <View style={styles.container}>
      {categories.map((category) => (
        <TabButton
          key={category.id}
          title={category.name}
          isActive={activeCategory === category.id}
          onPress={() => onCategoryChange(category.id)}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    paddingHorizontal: 20,
    marginBottom: 20,
  },
});
