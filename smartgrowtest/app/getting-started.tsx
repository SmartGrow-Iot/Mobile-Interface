import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Image,
  PanResponder,
  Dimensions,
} from "react-native";
import { useRouter } from "expo-router";
import { Video, ResizeMode } from 'expo-av';

const screens = [
  {
    title: "Welcome to SmartGrow !",
    description: "SmartGrow helps you monitor and automate plant care with real-time data.",
    image: require("../GStartMats/WELCOME.png"),
    type: "welcome",
  },
  {
    title: "",
    description: "",
    type: "features",
    features: [
      {
        title: "Real-time Monitoring",
        description: "View real-time moisture and light levels",
        image: require("../GStartMats/RTMPLANT.png"),
      },
      {
        title: "Smart Automation", 
        description: "Automatically trigger watering, lighting or ventilation based on environmental thresholds",
        image: require("../GStartMats/SMARTAUTOMATION.png"),
      },
      {
        title: "Reliable Data Storage",
        description: "Visualize historical data and track trends", 
        image: require("../GStartMats/RELIABLEDATASTORAGE.png"),
      },
    ],
  },
  {
    title: "Teaser Video",
    description: "",
    type: "video",
    video: require("../GStartMats/TeaserVideo.mp4"),
  },
];

export default function GettingStartedPage() {
  const [step, setStep] = useState(0);
  const router = useRouter();
  const currentScreen = screens[step];
  const screenWidth = Dimensions.get('window').width;

  const handleNext = () => {
    if (step < screens.length - 1) {
      setStep(step + 1);
    } else {
      // Navigate to main app after onboarding
      router.replace("/(tabs)");
    }
  };

  const handlePrevious = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  const handleSkip = () => {
    router.replace("/(tabs)");
  };

  // Create pan responder for swipe gestures
  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: (evt, gestureState) => {
      return Math.abs(gestureState.dx) > 20 && Math.abs(gestureState.dy) < 100;
    },
    onPanResponderMove: (evt, gestureState) => {
      // Optional: Add visual feedback during swipe
    },
    onPanResponderRelease: (evt, gestureState) => {
      const swipeThreshold = screenWidth / 4;
      
      if (gestureState.dx > swipeThreshold) {
        // Swipe right - go to previous
        handlePrevious();
      } else if (gestureState.dx < -swipeThreshold) {
        // Swipe left - go to next
        handleNext();
      }
    },
  });

  const renderContent = () => {
    if (currentScreen.type === "welcome") {
      return (
        <View style={styles.welcomeContent}>
          <Text style={styles.title}>{currentScreen.title}</Text>
          <View style={styles.imageContainer}>
            <Image source={currentScreen.image} style={styles.welcomeImage} resizeMode="contain" />
          </View>
          <Text style={styles.description}>{currentScreen.description}</Text>
          <Text style={styles.swipeHint}>← Swipe to navigate →</Text>
        </View>
      );
    }

    if (currentScreen.type === "features") {
      return (
        <View style={styles.featuresContent}>
          {currentScreen.features?.map((feature, index) => {
            const isSmartAutomation = feature.title === "Smart Automation";
            return (
              <View key={index} style={isSmartAutomation ? styles.featureItemReverse : styles.featureItem}>
                <View style={styles.featureImageContainer}>
                  <Image source={feature.image} style={styles.featureImage} resizeMode="contain" />
                </View>
                <View style={styles.featureTextContainer}>
                  <Text style={styles.featureTitle}>{feature.title}</Text>
                  <Text style={styles.featureDescription}>{feature.description}</Text>
                </View>
              </View>
            );
          })}
          <Text style={styles.swipeHint}>← Swipe to navigate →</Text>
        </View>
      );
    }

    if (currentScreen.type === "video") {
      return (
        <View style={styles.videoContent}>
          <Text style={styles.title}>{currentScreen.title}</Text>
          <View style={styles.videoContainer}>
            <Video
              source={currentScreen.video}
              style={styles.video}
              useNativeControls
              resizeMode={ResizeMode.CONTAIN}
              isLooping
            />
            <View style={styles.videoBorderOverlay} />
          </View>
        </View>
      );
    }

    return null;
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity style={styles.skip} onPress={handleSkip}>
        <Text style={styles.skipText}>Skip</Text>
      </TouchableOpacity>

      <View style={styles.content} {...panResponder.panHandlers}>
        {renderContent()}
      </View>

      <View style={styles.dots}>
        {screens.map((_, idx) => (
          <View
            key={idx}
            style={[styles.dot, step === idx && styles.activeDot]}
          />
        ))}
      </View>

      {step === screens.length - 1 && (
        <TouchableOpacity style={styles.button} onPress={handleNext}>
          <Text style={styles.buttonText}>Get Started →</Text>
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    justifyContent: "center",
  },
  skip: {
    position: "absolute",
    top: 60,
    right: 24,
    zIndex: 10,
  },
  skipText: {
    fontSize: 16,
    color: "#2196F3",
    fontWeight: "600",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 24,
    textAlign: "center",
    color: "#333",
  },
  description: {
    fontSize: 16,
    color: "#333",
    textAlign: "center",
    marginBottom: 24,
    lineHeight: 24,
  },
  // Welcome screen styles
  welcomeContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  imageContainer: {
    width: 280,
    height: 280,
    backgroundColor: "#fff",
    borderRadius: 140,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 32,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  welcomeImage: {
    width: 240,
    height: 240,
  },
  // Features screen styles
  featuresContent: {
    flex: 1,
    justifyContent: "center",
    width: "100%",
    paddingVertical: 30,
    paddingHorizontal: 3,
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 40,
    paddingHorizontal: 8,
  },
  featureItemReverse: {
    flexDirection: "row-reverse",
    alignItems: "center",
    marginBottom: 40,
    paddingHorizontal: 8,
  },
  featureImageContainer: {
    width: 120,
    height: 120,
    backgroundColor: "#fff",
    borderRadius: 60,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  featureImage: {
    width: 75,
    height: 75,
  },
  featureTextContainer: {
    flex: 1,
    paddingHorizontal: 12,
  },
  featureTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 14,
  },
  featureDescription: {
    fontSize: 17,
    color: "#666",
    lineHeight: 26,
  },
  // Video screen styles
  videoContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  videoContainer: {
    width: "95%",
    height: 600,
    borderRadius: 12,
    overflow: "hidden",
    marginTop: 20,
    position: "relative",
  },
  videoBorderOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 12,
    borderWidth: 2,
    borderStyle: "dashed",
    borderColor: "#ccc",
    pointerEvents: "none",
    zIndex: 1,
  },
  video: {
    width: "100%",
    height: "100%",
    borderRadius: 10,
  },
  dots: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 24,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#ccc",
    margin: 4,
  },
  activeDot: {
    backgroundColor: "#16a085",
  },
  button: {
    backgroundColor: "#16a085",
    padding: 16,
    borderRadius: 24,
    marginHorizontal: 24,
    marginBottom: 32,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    textAlign: "center",
    fontWeight: "600",
  },
  tapHint: {
    fontSize: 14,
    color: "#999",
    textAlign: "center",
    marginTop: 20,
    fontStyle: "italic",
  },
  swipeHint: {
    fontSize: 14,
    color: "#999",
    textAlign: "center",
    marginTop: 20,
    fontStyle: "italic",
  },
});
