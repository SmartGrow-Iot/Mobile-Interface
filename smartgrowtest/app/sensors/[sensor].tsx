import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const sensorIcons: Record<string, string> = {
  light: '☀️',
  soil: '🟫',
  airquality: '🌬️',
  temperature: '🌡️',
  humidity: '💧',
};
const sensorNames: Record<string, string> = {
  light: 'Light Sensor',
  soil: 'Soil Sensor',
  airquality: 'Air Quality Sensor',
  temperature: 'Temperature Sensor',
  humidity: 'Humidity Sensor',
};
const groupData = [
  { group: 'Group 1', icon: '🍆', value: '80% moisture', critical: false },
  { group: 'Group 2', icon: '🌶️', value: '74% moisture', critical: false },
  { group: 'GROUP 3', icon: '🍆', value: '85% moisture', critical: false },
  { group: 'GROUP 4', icon: '🍆', value: '66% moisture', critical: true },
  { group: 'GROUP 5', icon: '🌶️', value: '80% moisture', critical: false },
  { group: 'GROUP 6', icon: '🌶️', value: '90% moisture', critical: false },
];

export default function SensorDetail() {
  const { sensor } = useLocalSearchParams();
  const router = useRouter();
  const icon = sensorIcons[sensor as string] || '❓';
  const name = sensorNames[sensor as string] || 'Sensor';

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={28} color="#222" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{name}</Text>
        <View style={{ width: 28 }} />
      </View>
      <View style={styles.sensorRow}>
        <Text style={{ fontSize: 44 }}>{icon}</Text>
        <Text style={styles.sensorName}>{name}</Text>
      </View>
      <ScrollView contentContainerStyle={{ paddingBottom: 32 }}>
        {groupData.map((g, idx) => (
          <View key={idx} style={styles.groupCard}>
            <Text style={{ fontSize: 28, marginRight: 12 }}>{g.icon}</Text>
            <Text style={styles.groupName}>{g.group}</Text>
            <Text style={[styles.groupValue, g.critical && { color: 'red', fontWeight: 'bold' }]}>{g.value}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f8f8', paddingTop: 18 },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 18, marginBottom: 8 },
  backBtn: { padding: 4, borderRadius: 8, backgroundColor: '#fff', elevation: 2 },
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: '#222', flex: 1, textAlign: 'center' },
  sensorRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginVertical: 18 },
  sensorName: { fontSize: 26, fontWeight: 'bold', marginLeft: 12, color: '#444' },
  groupCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 18, padding: 18, marginHorizontal: 18, marginBottom: 16, shadowColor: '#000', shadowOpacity: 0.07, shadowRadius: 6, elevation: 2 },
  groupName: { fontWeight: '600', fontSize: 18, flex: 1, color: '#222' },
  groupValue: { fontSize: 17, color: '#222' },
}); 