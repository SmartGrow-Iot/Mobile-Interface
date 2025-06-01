import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';

const screens = [
  {
    title: 'Welcome to SmartGrow !',
    description: 'SmartGrow helps you monitor and automate plant care with real-time data.',
    image: null, // Add your image here
  },
  {
    title: 'Real-time Monitoring',
    description: 'View real-time moisture and light levels.\n\nSmart Automation: Automatically trigger watering, lighting or ventilation based on environmental thresholds.\n\nReliable Data Storage: Visualize historical data and track trends.',
    image: null, // Add your image here
  },
  {
    title: 'Teaser Video',
    description: '',
    image: null, // Add your video or placeholder here
  },
];

export default function GettingStartedScreen() {
  const [step, setStep] = useState(0);
  const router = useRouter();

  const handleNext = () => {
    if (step < screens.length - 1) {
      setStep(step + 1);
    } else {
      router.replace('/(tabs)');
    }
  };

  const handleSkip = () => {
    router.replace('/(tabs)');
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
          <View key={idx} style={[styles.dot, step === idx && styles.activeDot]} />
        ))}
      </View>
      <TouchableOpacity style={styles.button} onPress={handleNext}>
        <Text style={styles.buttonText}>Getting Started →</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5', justifyContent: 'center' },
  skip: { position: 'absolute', top: 40, right: 24, zIndex: 10 },
  skipText: { fontSize: 16, color: '#888' },
  content: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 24 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 24, textAlign: 'center' },
  description: { fontSize: 16, color: '#333', textAlign: 'center', marginBottom: 24 },
  dots: { flexDirection: 'row', justifyContent: 'center', marginBottom: 24 },
  dot: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#ccc', margin: 4 },
  activeDot: { backgroundColor: '#2e7d6b' },
  button: { backgroundColor: '#174d3c', padding: 16, borderRadius: 24, marginHorizontal: 24, marginBottom: 32 },
  buttonText: { color: '#fff', fontSize: 18, textAlign: 'center' },
}); 