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

  // Size configurations - more compact for better balance
  const imageSize = {
    small: 50,
    medium: 70,
    large: 90,
  };

  return (
    <View style={cardStyle[size]}>
      <Card variant="elevated" style={styles.cardContainer}>
        <View style={styles.content}>
          {/* Local plant image */}
          <View style={styles.imageContainer}>
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
          </View>

          {/* Plant name */}
          <View style={styles.nameContainer}>
            <Text style={[styles.plantName, styles[`${size}Name`]]}>
              {name}
            </Text>
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
    width: 150,
    height: 180,
  },
  largeCard: {
    width: 180,
    height: 200,
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
  imageContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  plantImage: {
    // Image dimensions are set dynamically above
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
