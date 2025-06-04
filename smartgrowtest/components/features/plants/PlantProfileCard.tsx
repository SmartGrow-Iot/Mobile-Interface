// components/features/plants/PlantProfileCard.tsx
import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
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

  // Get local image source based on plant type
  const getImageSource = () => {
    if (image === "🌶️") {
      return require("../../../assets/logo/chili.png");
    }
    if (image === "🍆") {
      return require("../../../assets/logo/eggplant.png");
    }
    // Fallback to existing smartgrow logo if plant type unknown
    return require("../../../assets/logo/smartgrow.png");
  };

  // Size configurations - increased for better visibility
  const imageSize = {
    small: 48,
    medium: 80,
    large: 100,
  };

  console.log("PlantProfileCard - Using local asset for:", image);

  return (
    <View style={cardStyle[size]}>
      <Card variant="elevated">
        <View style={styles.content}>
          {/* Local plant image */}
          <Image
            source={getImageSource()}
            style={[
              styles.plantImage,
              {
                width: imageSize[size],
                height: imageSize[size],
              },
            ]}
            resizeMode="contain"
          />

          {/* Plant name */}
          <Text style={[styles.plantName, styles[`${size}Name`]]}>{name}</Text>
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
    height: 200,
  },
  largeCard: {
    width: 200,
    height: 240,
  },
  content: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    paddingVertical: 16,
    paddingHorizontal: 12,
  },
  plantImage: {
    marginBottom: 16,
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
    fontSize: 16,
    lineHeight: 20,
  },
  largeName: {
    fontSize: 18,
    lineHeight: 22,
  },
});
