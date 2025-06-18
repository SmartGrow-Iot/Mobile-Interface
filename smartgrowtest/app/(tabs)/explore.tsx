// app/(tabs)/explore.tsx - Complete code with PDF opening functionality
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { Ionicons, MaterialIcons, FontAwesome5 } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Asset } from "expo-asset";
import * as Sharing from "expo-sharing";
import Header from "../../components/Header";

const getStarted = [
  {
    title: "Quick Start Guide",
    subtitle: "Quick start guide in HTML or PDF",
    icon: <Ionicons name="document" size={28} color="#fff" />,
    color: "#2ecc40",
  },
  {
    title: "Teaser Video",
    subtitle: "Short promotional video",
    icon: <MaterialIcons name="slow-motion-video" size={28} color="#fff" />,
    color: "#a259e6",
    action: "video",
  },
];

const onboarding = [
  {
    title: "User Manual",
    subtitle: "User manual in HTML or PDF",
    icon: <Ionicons name="document-text" size={28} color="#fff" />,
    color: "#ff3b30",
    action: "pdf",
    path: "QuickStartGuide.pdf",
  },
  {
    title: "Training Slides",
    subtitle: "Comprehensive training slideshow",
    icon: <FontAwesome5 name="slideshare" size={24} color="#fff" />,
    color: "#3498db",
  },
  {
    title: "Full Video Walkthrough",
    subtitle: "Step-by-step instructional video",
    icon: <Ionicons name="videocam" size={28} color="#fff" />,
    color: "#e056fd",
  },
];

function Card({
  icon,
  color,
  title,
  subtitle,
  action,
  path,
  onPress,
}: {
  icon: React.ReactNode;
  color: string;
  title: string;
  subtitle: string;
  action?: string;
  path?: string;
  onPress?: () => void;
}) {
  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.85}
      onPress={onPress}
    >
      <View style={[styles.iconCircle, { backgroundColor: color }]}>
        {icon}
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.cardTitle}>{title}</Text>
        <Text style={styles.cardSubtitle}>{subtitle}</Text>
      </View>
      <Ionicons name="chevron-forward" size={26} color="#222" />
    </TouchableOpacity>
  );
}

export default function ExploreScreen() {
  const router = useRouter();

  // Function to open PDF using expo-asset and Sharing
  const openPDFWithSharing = async () => {
    try {
      console.log("Attempting to open PDF with expo-asset...");

      // Load the PDF as an asset
      const asset = Asset.fromModule(
        require("../../assets/QuickStartGuide.pdf")
      );
      console.log("Asset created:", asset);

      // Download the asset to local storage
      await asset.downloadAsync();
      console.log("Asset downloaded successfully");
      console.log("Asset local URI:", asset.localUri);

      if (!asset.localUri) {
        Alert.alert(
          "Error",
          "Could not load PDF asset - no local URI available"
        );
        return;
      }

      // Check if sharing is available on this device
      const isAvailable = await Sharing.isAvailableAsync();
      if (!isAvailable) {
        Alert.alert(
          "Sharing Not Available",
          "Sharing is not available on this device"
        );
        return;
      }

      console.log("Sharing PDF from:", asset.localUri);

      // Share the PDF file (this will open it in the system PDF viewer)
      await Sharing.shareAsync(asset.localUri, {
        mimeType: "application/pdf",
        dialogTitle: "Open User Manual",
        UTI: "com.adobe.pdf",
      });

      console.log("PDF shared successfully");
    } catch (error) {
      console.error("Error opening PDF with expo-asset:", error);

    }
  };

  const handleCardPress = async (item: any) => {
    if (item.action === "pdf" && item.path) {
      await openPDFWithSharing();
    } else if (item.action === "video") {
      router.push("/teaser-video");
    } else {
      Alert.alert("Coming Soon", "This feature will be available soon!");
    }
  };

  return (
    <View style={styles.container}>
      <Header title="Explore" showSearch={true} showProfile={true} />

      <ScrollView style={styles.content}>
        <Text style={styles.header}>Get Started</Text>
        {getStarted.map((item, idx) => (
          <Card
            key={item.title}
            {...item}
            onPress={() => handleCardPress(item)}
          />
        ))}

        <Text style={styles.header}>Onboarding Guide</Text>
        {onboarding.map((item, idx) => (
          <Card
            key={item.title}
            {...item}
            onPress={() => handleCardPress(item)}
          />
        ))}
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
    padding: 18,
  },
  header: {
    fontSize: 28,
    fontWeight: "bold",
    marginTop: 8,
    marginBottom: 12,
    color: "#111",
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.07,
    shadowRadius: 6,
    elevation: 2,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 18,
  },
  cardTitle: {
    fontWeight: "bold",
    fontSize: 18,
    color: "#222",
  },
  cardSubtitle: {
    color: "#666",
    fontSize: 13,
    marginTop: 2,
  },
});
