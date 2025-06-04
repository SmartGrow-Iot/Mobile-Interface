// components/features/plants/PlantProfileCard.tsx
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Card } from "../../ui/Card";

type PlantProfileCardProps = {
  name: string;
  image: string;
  size?: "small" | "medium" | "large";
};

export function PlantProfileCard({
  name,
  image,
  size = "medium",
}: PlantProfileCardProps) {
  const cardStyle = {
    small: styles.smallCard,
    medium: styles.mediumCard,
    large: styles.largeCard,
  };

  return (
    <View style={cardStyle[size]}>
      <Card variant="elevated">
        <View style={styles.content}>
          <Text style={[styles.plantEmoji, styles[`${size}Emoji`]]}>
            {image}
          </Text>
          <Text style={[styles.plantName, styles[`${size}Name`]]}>{name}</Text>
        </View>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  smallCard: {
    width: 100,
    height: 120,
  },
  mediumCard: {
    width: 130,
    height: 170,
  },
  largeCard: {
    width: 160,
    height: 200,
  },
  content: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  plantEmoji: {
    textAlign: "center",
  },
  smallEmoji: {
    fontSize: 32,
  },
  mediumEmoji: {
    fontSize: 48,
  },
  largeEmoji: {
    fontSize: 56,
  },
  plantName: {
    fontWeight: "bold",
    textAlign: "center",
    color: "#333",
    marginTop: 8,
  },
  smallName: {
    fontSize: 12,
  },
  mediumName: {
    fontSize: 16,
  },
  largeName: {
    fontSize: 18,
  },
});
