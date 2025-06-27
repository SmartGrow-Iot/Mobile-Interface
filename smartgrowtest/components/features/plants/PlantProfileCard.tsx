// components/features/plants/PlantProfileCard.tsx - Simplified for API data
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Card } from "../../ui/Card";

type PlantProfileCardProps = {
  name: string;
  icon: string;
  size?: "small" | "medium" | "large";
};

export function PlantProfileCard({
  name,
  icon,
  size = "medium",
}: PlantProfileCardProps) {
  const cardStyle = {
    small: styles.smallCard,
    medium: styles.mediumCard,
    large: styles.largeCard,
  };

  const iconSize = {
    small: 40,
    medium: 60,
    large: 80,
  };

  const nameSize = {
    small: styles.smallName,
    medium: styles.mediumName,
    large: styles.largeName,
  };

  return (
    <View style={cardStyle[size]}>
      <Card variant="elevated" style={styles.cardContainer}>
        <View style={styles.content}>
          {/* Plant icon */}
          <View style={styles.iconContainer}>
            <Text style={[styles.plantIcon, { fontSize: iconSize[size] }]}>
              {icon}
            </Text>
          </View>

          {/* Plant name */}
          <View style={styles.nameContainer}>
            <Text style={[styles.plantName, nameSize[size]]}>{name}</Text>
          </View>
        </View>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  smallCard: {
    width: 120,
    height: 140,
  },
  mediumCard: {
    width: 160,
    height: 180,
  },
  largeCard: {
    width: 200,
    height: 220,
  },
  cardContainer: {
    height: "100%",
    justifyContent: "center",
  },
  content: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    paddingVertical: 16,
    paddingHorizontal: 12,
  },
  iconContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  plantIcon: {
    // Size is set dynamically above
  },
  nameContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 4,
  },
  plantName: {
    fontWeight: "bold",
    textAlign: "center",
    color: "#333",
    flexShrink: 1,
  },
  smallName: {
    fontSize: 12,
    lineHeight: 16,
  },
  mediumName: {
    fontSize: 14,
    lineHeight: 18,
  },
  largeName: {
    fontSize: 16,
    lineHeight: 20,
  },
});
