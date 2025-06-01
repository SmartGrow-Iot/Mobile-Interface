import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

type PlantData = {
  name: string;
  image: string;
  datePlanted: string;
  optimalMoisture: string;
  optimalLight: string;
  optimalTemp: string;
  type: string;
  growthTime: string;
  notes: string;
  thresholds: {
    label: string;
    value: string;
    color: string;
    bg: string;
    icon: string;
  }[];
  actuator: string;
  readings: {
    label: string;
    value: string;
  }[];
};

const plantData: Record<string, PlantData> = {
  'CP-1': {
    name: 'Chili Plant 1',
    image: '🌶️',
    datePlanted: '23/5/2024',
    optimalMoisture: '50% - 70%',
    optimalLight: '70% - 80%',
    optimalTemp: '25°C - 30°C',
    type: 'Warm-season fruiting vegetable',
    growthTime: '60-90 days to maturity',
    notes: 'Prefers well-drained soil and benefits from regular feeding during flowering and fruiting stages.',
    thresholds: [
      { label: 'Light Threshold is', value: 'Optimal', color: '#222', bg: '#f5f5f5', icon: '☀️' },
      { label: 'Water Threshold is', value: 'Critical', color: 'red', bg: '#fff', icon: '💧' },
    ],
    actuator: 'Override Actuator',
    readings: [
      { label: 'Temp', value: '28°C' },
      { label: 'Humidity', value: '60%' },
      { label: 'Moisture', value: '40%' },
      { label: 'Light', value: '70%' },
      { label: 'Wind', value: '5 m/s' },
    ],
  },
  // Placeholders for all other plants
  'CP-2': {
    name: 'Chili Plant 2', image: '🌶️', datePlanted: '24/5/2024', optimalMoisture: '50% - 70%', optimalLight: '70% - 80%', optimalTemp: '25°C - 30°C', type: 'Warm-season fruiting vegetable', growthTime: '60-90 days', notes: 'Placeholder data for CP-2.', thresholds: [{ label: 'Light Threshold is', value: 'Optimal', color: '#222', bg: '#f5f5f5', icon: '☀️' }, { label: 'Water Threshold is', value: 'Optimal', color: '#222', bg: '#fff', icon: '💧' }], actuator: 'Override Actuator', readings: [{ label: 'Temp', value: '27°C' }, { label: 'Humidity', value: '62%' }, { label: 'Moisture', value: '55%' }, { label: 'Light', value: '75%' }, { label: 'Wind', value: '4 m/s' }] },
  'CP-3': {
    name: 'Chili Plant 3', image: '🌶️', datePlanted: '25/5/2024', optimalMoisture: '50% - 70%', optimalLight: '70% - 80%', optimalTemp: '25°C - 30°C', type: 'Warm-season fruiting vegetable', growthTime: '60-90 days', notes: 'Placeholder data for CP-3.', thresholds: [{ label: 'Light Threshold is', value: 'Critical', color: 'red', bg: '#f5f5f5', icon: '☀️' }, { label: 'Water Threshold is', value: 'Optimal', color: '#222', bg: '#fff', icon: '💧' }], actuator: 'Override Actuator', readings: [{ label: 'Temp', value: '29°C' }, { label: 'Humidity', value: '58%' }, { label: 'Moisture', value: '45%' }, { label: 'Light', value: '80%' }, { label: 'Wind', value: '6 m/s' }] },
  'CP-4': {
    name: 'Chili Plant 4', image: '🌶️', datePlanted: '26/5/2024', optimalMoisture: '50% - 70%', optimalLight: '70% - 80%', optimalTemp: '25°C - 30°C', type: 'Warm-season fruiting vegetable', growthTime: '60-90 days', notes: 'Placeholder data for CP-4.', thresholds: [{ label: 'Light Threshold is', value: 'Optimal', color: '#222', bg: '#f5f5f5', icon: '☀️' }, { label: 'Water Threshold is', value: 'Critical', color: 'red', bg: '#fff', icon: '💧' }], actuator: 'Override Actuator', readings: [{ label: 'Temp', value: '28°C' }, { label: 'Humidity', value: '60%' }, { label: 'Moisture', value: '50%' }, { label: 'Light', value: '70%' }, { label: 'Wind', value: '5 m/s' }] },
  'CP-5': {
    name: 'Chili Plant 5', image: '🌶️', datePlanted: '27/5/2024', optimalMoisture: '50% - 70%', optimalLight: '70% - 80%', optimalTemp: '25°C - 30°C', type: 'Warm-season fruiting vegetable', growthTime: '60-90 days', notes: 'Placeholder data for CP-5.', thresholds: [{ label: 'Light Threshold is', value: 'Critical', color: 'red', bg: '#f5f5f5', icon: '☀️' }, { label: 'Water Threshold is', value: 'Critical', color: 'red', bg: '#fff', icon: '💧' }], actuator: 'Override Actuator', readings: [{ label: 'Temp', value: '30°C' }, { label: 'Humidity', value: '55%' }, { label: 'Moisture', value: '35%' }, { label: 'Light', value: '85%' }, { label: 'Wind', value: '7 m/s' }] },
  'CP-6': {
    name: 'Chili Plant 6', image: '🌶️', datePlanted: '28/5/2024', optimalMoisture: '50% - 70%', optimalLight: '70% - 80%', optimalTemp: '25°C - 30°C', type: 'Warm-season fruiting vegetable', growthTime: '60-90 days', notes: 'Placeholder data for CP-6.', thresholds: [{ label: 'Light Threshold is', value: 'Optimal', color: '#222', bg: '#f5f5f5', icon: '☀️' }, { label: 'Water Threshold is', value: 'Optimal', color: '#222', bg: '#fff', icon: '💧' }], actuator: 'Override Actuator', readings: [{ label: 'Temp', value: '27°C' }, { label: 'Humidity', value: '63%' }, { label: 'Moisture', value: '60%' }, { label: 'Light', value: '72%' }, { label: 'Wind', value: '4 m/s' }] },
  'CP-7': {
    name: 'Chili Plant 7', image: '🌶️', datePlanted: '29/5/2024', optimalMoisture: '50% - 70%', optimalLight: '70% - 80%', optimalTemp: '25°C - 30°C', type: 'Warm-season fruiting vegetable', growthTime: '60-90 days', notes: 'Placeholder data for CP-7.', thresholds: [{ label: 'Light Threshold is', value: 'Optimal', color: '#222', bg: '#f5f5f5', icon: '☀️' }, { label: 'Water Threshold is', value: 'Critical', color: 'red', bg: '#fff', icon: '💧' }], actuator: 'Override Actuator', readings: [{ label: 'Temp', value: '28°C' }, { label: 'Humidity', value: '60%' }, { label: 'Moisture', value: '55%' }, { label: 'Light', value: '70%' }, { label: 'Wind', value: '5 m/s' }] },
  'CP-8': {
    name: 'Chili Plant 8', image: '🌶️', datePlanted: '30/5/2024', optimalMoisture: '50% - 70%', optimalLight: '70% - 80%', optimalTemp: '25°C - 30°C', type: 'Warm-season fruiting vegetable', growthTime: '60-90 days', notes: 'Placeholder data for CP-8.', thresholds: [{ label: 'Light Threshold is', value: 'Optimal', color: '#222', bg: '#f5f5f5', icon: '☀️' }, { label: 'Water Threshold is', value: 'Optimal', color: '#222', bg: '#fff', icon: '💧' }], actuator: 'Override Actuator', readings: [{ label: 'Temp', value: '27°C' }, { label: 'Humidity', value: '62%' }, { label: 'Moisture', value: '60%' }, { label: 'Light', value: '75%' }, { label: 'Wind', value: '4 m/s' }] },
  'EP-1': {
    name: 'Eggplant 1', image: '🍆', datePlanted: '23/5/2024', optimalMoisture: '60% - 80%', optimalLight: '60% - 75%', optimalTemp: '22°C - 28°C', type: 'Warm-season fruiting vegetable', growthTime: '70-100 days', notes: 'Placeholder data for EP-1.', thresholds: [{ label: 'Light Threshold is', value: 'Optimal', color: '#222', bg: '#f5f5f5', icon: '☀️' }, { label: 'Water Threshold is', value: 'Optimal', color: '#222', bg: '#fff', icon: '💧' }], actuator: 'Override Actuator', readings: [{ label: 'Temp', value: '25°C' }, { label: 'Humidity', value: '65%' }, { label: 'Moisture', value: '70%' }, { label: 'Light', value: '65%' }, { label: 'Wind', value: '3 m/s' }] },
  'EP-2': {
    name: 'Eggplant 2', image: '🍆', datePlanted: '24/5/2024', optimalMoisture: '60% - 80%', optimalLight: '60% - 75%', optimalTemp: '22°C - 28°C', type: 'Warm-season fruiting vegetable', growthTime: '70-100 days', notes: 'Placeholder data for EP-2.', thresholds: [{ label: 'Light Threshold is', value: 'Optimal', color: '#222', bg: '#f5f5f5', icon: '☀️' }, { label: 'Water Threshold is', value: 'Optimal', color: '#222', bg: '#fff', icon: '💧' }], actuator: 'Override Actuator', readings: [{ label: 'Temp', value: '24°C' }, { label: 'Humidity', value: '68%' }, { label: 'Moisture', value: '75%' }, { label: 'Light', value: '70%' }, { label: 'Wind', value: '3 m/s' }] },
  'EP-3': {
    name: 'Eggplant 3', image: '🍆', datePlanted: '25/5/2024', optimalMoisture: '60% - 80%', optimalLight: '60% - 75%', optimalTemp: '22°C - 28°C', type: 'Warm-season fruiting vegetable', growthTime: '70-100 days', notes: 'Placeholder data for EP-3.', thresholds: [{ label: 'Light Threshold is', value: 'Critical', color: 'red', bg: '#f5f5f5', icon: '☀️' }, { label: 'Water Threshold is', value: 'Optimal', color: '#222', bg: '#fff', icon: '💧' }], actuator: 'Override Actuator', readings: [{ label: 'Temp', value: '26°C' }, { label: 'Humidity', value: '60%' }, { label: 'Moisture', value: '65%' }, { label: 'Light', value: '60%' }, { label: 'Wind', value: '4 m/s' }] },
  'EP-4': {
    name: 'Eggplant 4', image: '🍆', datePlanted: '26/5/2024', optimalMoisture: '60% - 80%', optimalLight: '60% - 75%', optimalTemp: '22°C - 28°C', type: 'Warm-season fruiting vegetable', growthTime: '70-100 days', notes: 'Placeholder data for EP-4.', thresholds: [{ label: 'Light Threshold is', value: 'Optimal', color: '#222', bg: '#f5f5f5', icon: '☀️' }, { label: 'Water Threshold is', value: 'Critical', color: 'red', bg: '#fff', icon: '💧' }], actuator: 'Override Actuator', readings: [{ label: 'Temp', value: '25°C' }, { label: 'Humidity', value: '67%' }, { label: 'Moisture', value: '70%' }, { label: 'Light', value: '65%' }, { label: 'Wind', value: '3 m/s' }] },
  'EP-5': {
    name: 'Eggplant 5', image: '🍆', datePlanted: '27/5/2024', optimalMoisture: '60% - 80%', optimalLight: '60% - 75%', optimalTemp: '22°C - 28°C', type: 'Warm-season fruiting vegetable', growthTime: '70-100 days', notes: 'Placeholder data for EP-5.', thresholds: [{ label: 'Light Threshold is', value: 'Optimal', color: '#222', bg: '#f5f5f5', icon: '☀️' }, { label: 'Water Threshold is', value: 'Optimal', color: '#222', bg: '#fff', icon: '💧' }], actuator: 'Override Actuator', readings: [{ label: 'Temp', value: '24°C' }, { label: 'Humidity', value: '68%' }, { label: 'Moisture', value: '75%' }, { label: 'Light', value: '70%' }, { label: 'Wind', value: '3 m/s' }] },
  'EP-6': {
    name: 'Eggplant 6', image: '🍆', datePlanted: '28/5/2024', optimalMoisture: '60% - 80%', optimalLight: '60% - 75%', optimalTemp: '22°C - 28°C', type: 'Warm-season fruiting vegetable', growthTime: '70-100 days', notes: 'Placeholder data for EP-6.', thresholds: [{ label: 'Light Threshold is', value: 'Optimal', color: '#222', bg: '#f5f5f5', icon: '☀️' }, { label: 'Water Threshold is', value: 'Optimal', color: '#222', bg: '#fff', icon: '💧' }], actuator: 'Override Actuator', readings: [{ label: 'Temp', value: '25°C' }, { label: 'Humidity', value: '65%' }, { label: 'Moisture', value: '70%' }, { label: 'Light', value: '65%' }, { label: 'Wind', value: '3 m/s' }] },
  'EP-7': {
    name: 'Eggplant 7', image: '🍆', datePlanted: '29/5/2024', optimalMoisture: '60% - 80%', optimalLight: '60% - 75%', optimalTemp: '22°C - 28°C', type: 'Warm-season fruiting vegetable', growthTime: '70-100 days', notes: 'Placeholder data for EP-7.', thresholds: [{ label: 'Light Threshold is', value: 'Optimal', color: '#222', bg: '#f5f5f5', icon: '☀️' }, { label: 'Water Threshold is', value: 'Critical', color: 'red', bg: '#fff', icon: '💧' }], actuator: 'Override Actuator', readings: [{ label: 'Temp', value: '25°C' }, { label: 'Humidity', value: '67%' }, { label: 'Moisture', value: '70%' }, { label: 'Light', value: '65%' }, { label: 'Wind', value: '3 m/s' }] },
  'EP-8': {
    name: 'Eggplant 8', image: '🍆', datePlanted: '30/5/2024', optimalMoisture: '60% - 80%', optimalLight: '60% - 75%', optimalTemp: '22°C - 28°C', type: 'Warm-season fruiting vegetable', growthTime: '70-100 days', notes: 'Placeholder data for EP-8.', thresholds: [{ label: 'Light Threshold is', value: 'Optimal', color: '#222', bg: '#f5f5f5', icon: '☀️' }, { label: 'Water Threshold is', value: 'Optimal', color: '#222', bg: '#fff', icon: '💧' }], actuator: 'Override Actuator', readings: [{ label: 'Temp', value: '24°C' }, { label: 'Humidity', value: '68%' }, { label: 'Moisture', value: '75%' }, { label: 'Light', value: '70%' }, { label: 'Wind', value: '3 m/s' }] },
};

export default function PlantProfile() {
  const { plant } = useLocalSearchParams();
  const router = useRouter();
  console.log('Plant param:', plant);
  const plantKey = typeof plant === 'string' ? plant.trim().toUpperCase() : '';
  const data = plantData[plantKey];

  if (!data) {
    return (
      <View style={styles.container}>
        <Text>Plant not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={28} color="#174d3c" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Plant Profile</Text>
        <View style={{ width: 28 }} />
      </View>

      {/* Plant Card & Thresholds */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: 20 }}>
        <View style={styles.plantCard}>
          <Text style={{ fontSize: 48 }}>{data.image}</Text>
          <Text style={styles.plantName}>{data.name}</Text>
        </View>
        <View style={{ flex: 1, marginLeft: 12 }}>
          {data.thresholds.map((t, idx) => (
            <View key={idx} style={[styles.thresholdBox, { backgroundColor: t.bg }]}>
              <Text style={{ fontWeight: 'bold', color: t.color }}>{t.label} <Text style={{ color: t.color }}>{t.value}</Text></Text>
              {t.icon === '☀️' && <Ionicons name="sunny" size={22} color="#f7b731" style={{ position: 'absolute', right: 8, top: 8 }} />}
              {t.icon === '💧' && <Ionicons name="water" size={22} color="#45aaf2" style={{ position: 'absolute', right: 8, bottom: 8 }} />}
            </View>
          ))}
          <TouchableOpacity style={styles.actuatorBtn}>
            <Text style={styles.actuatorText}>{data.actuator}</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Info Cards */}
      <View style={styles.infoCardsContainer}>
        <View style={styles.infoCard}>
          <Text style={styles.infoLabel}>Date Planted</Text>
          <Text style={styles.infoValue}>{data.datePlanted}</Text>
          <Text style={styles.infoLabel}>Optimal Moisture</Text>
          <Text style={styles.infoValue}>{data.optimalMoisture}</Text>
          <Text style={styles.infoLabel}>Optimal Light Level</Text>
          <Text style={styles.infoValue}>{data.optimalLight}</Text>
          <Text style={styles.infoLabel}>Optimal Temp.</Text>
          <Text style={styles.infoValue}>{data.optimalTemp}</Text>
        </View>
        <View style={styles.infoCard}>
          <Text style={styles.infoLabel}>Plant Info</Text>
          <Text style={styles.infoValue}>Type</Text>
          <Text style={styles.infoValue}>{data.type}</Text>
          <Text style={styles.infoValue}>Growth Time</Text>
          <Text style={styles.infoValue}>{data.growthTime}</Text>
          <Text style={styles.infoValue}>Notes:</Text>
          <Text style={styles.infoValue}>{data.notes}</Text>
        </View>
      </View>

      {/* Sensor Readings */}
      <View style={styles.readingsRow}>
        {data.readings.map((r, idx) => (
          <View key={idx} style={styles.readingBox}>
            <Text style={styles.readingLabel}>{r.label}</Text>
            <Text style={styles.readingValue}>{r.value}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
    paddingTop: 32,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  backBtn: {
    padding: 8,
    borderRadius: 12,
    backgroundColor: '#fff',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#174d3c',
  },
  plantCard: {
    width: 130,
    height: 170,
    backgroundColor: '#fff',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.07,
    shadowRadius: 6,
    elevation: 3,
  },
  plantName: {
    fontWeight: 'bold',
    fontSize: 18,
    marginTop: 8,
  },
  thresholdBox: {
    position: 'relative',
    borderRadius: 12,
    padding: 10,
    marginBottom: 10,
    minWidth: 140,
    alignItems: 'flex-start',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
  },
  actuatorBtn: {
    backgroundColor: '#27ae60',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 6,
  },
  actuatorText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  infoCardsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginTop: 20,
  },
  infoCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 14,
    marginHorizontal: 6,
    shadowColor: '#000',
    shadowOpacity: 0.07,
    shadowRadius: 6,
    elevation: 2,
  },
  infoLabel: {
    fontWeight: 'bold',
    fontSize: 13,
    color: '#444',
    marginTop: 2,
  },
  infoValue: {
    fontSize: 13,
    color: '#222',
    marginBottom: 2,
  },
  readingsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    borderRadius: 16,
    margin: 20,
    padding: 12,
    shadowColor: '#000',
    shadowOpacity: 0.07,
    shadowRadius: 6,
    elevation: 2,
  },
  readingBox: {
    alignItems: 'center',
    flex: 1,
  },
  readingLabel: {
    fontWeight: 'bold',
    fontSize: 13,
    color: '#888',
  },
  readingValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#222',
    marginTop: 2,
  },
}); 