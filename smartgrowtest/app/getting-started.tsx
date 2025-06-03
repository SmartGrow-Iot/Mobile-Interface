import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { useRouter } from "expo-router";

const screens = [
  {
    title: "Welcome to SmartGrow!",
    description:
      "SmartGrow helps you monitor and automate plant care with real-time data.",
    image: null,
  },
  {
    title: "Real-time Monitoring",
    description:
      "View real-time moisture and light levels.\n\nSmart Automation: Automatically trigger watering, lighting or ventilation based on environmental thresholds.\n\nReliable Data Storage: Visualize historical data and track trends.",
    image: null,
  },
  {
    title: "Get Started!",
    description:
      "You're all set! Start monitoring your plants and watch them grow with SmartGrow.",
    image: null,
  },
];

export default function GettingStartedPage() {
  const [step, setStep] = useState(0);
  const router = useRouter();

  const handleNext = () => {
    if (step < screens.length - 1) {
      setStep(step + 1);
    } else {
      // Navigate to main app after onboarding
      router.replace("/(tabs)");
    }
  };

  const handleSkip = () => {
    router.replace("/(tabs)");
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity style={styles.skip} onPress={handleSkip}>
        <Text style={styles.skipText}>Skip</Text>
      </TouchableOpacity>

      <View style={styles.content}>
        <Text style={styles.title}>{screens[step].title}</Text>
        {/* Add image or video here if needed */}
        <Text style={styles.description}>{screens[step].description}</Text>
      </View>

      <View style={styles.dots}>
        {screens.map((_, idx) => (
          <View
            key={idx}
            style={[styles.dot, step === idx && styles.activeDot]}
          />
        ))}
      </View>

      <TouchableOpacity style={styles.button} onPress={handleNext}>
        <Text style={styles.buttonText}>
          {step === screens.length - 1 ? "Get Started →" : "Next →"}
        </Text>
      </TouchableOpacity>
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
    top: 40,
    right: 24,
    zIndex: 10,
  },
  skipText: {
    fontSize: 16,
    color: "#888",
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
});
