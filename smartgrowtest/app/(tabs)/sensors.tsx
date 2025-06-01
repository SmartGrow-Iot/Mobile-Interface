import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const sensors = [
  { label: 'Light Sensor', icon: '☀️', route: 'light' },
  { label: 'Soil Sensor', icon: '🟫', route: 'soil' },
  { label: 'Air Quality Sensor', icon: '🌬️', route: 'airquality' },
  { label: 'Temperature Sensor', icon: '🌡️', route: 'temperature' },
  { label: 'Humidity Sensor', icon: '💧', route: 'humidity' },
];

export default function SensorsScreen() {
  const router = useRouter();
  return (
    <ScrollView contentContainerStyle={styles.container}>
      {sensors.map((sensor, idx) => (
        <TouchableOpacity key={idx} style={styles.sensorBtn} activeOpacity={0.8} onPress={() => router.push(`/sensors/${sensor.route}`)}>
          <Text style={styles.sensorIcon}>{sensor.icon}</Text>
          <Text style={styles.sensorLabel}>{sensor.label}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, alignItems: 'center', backgroundColor: '#f8f8f8', flexGrow: 1 },
  sensorBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 24,
    marginVertical: 10,
    width: '100%',
    maxWidth: 340,
    shadowColor: '#000',
    shadowOpacity: 0.07,
    shadowRadius: 6,
    elevation: 3,
  },
  sensorIcon: { fontSize: 36, marginRight: 18 },
  sensorLabel: { fontSize: 22, fontWeight: '600', color: '#222' },
}); 