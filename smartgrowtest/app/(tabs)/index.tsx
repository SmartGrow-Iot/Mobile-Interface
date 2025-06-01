import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

type Alert = {
  text: string;
  color: string;
  icon: keyof typeof Ionicons.glyphMap;
};

type Zone = {
  name: string;
  icon: string;
  status: 'Optimal' | 'Critical';
};

type ZoneType = 'chili' | 'eggplant';

const alerts: Alert[] = [
  { text: 'Light threshold for Zone A is Critical!', color: '#FFD580', icon: 'sunny-outline' },
  { text: 'Water threshold for Zone B is Critical!', color: '#AEE2FF', icon: 'water-outline' },
];

const zones: Record<ZoneType, Zone[]> = {
  chili: [
    { name: 'Zone A', icon: '🌶️', status: 'Optimal' },
    { name: 'Zone B', icon: '🌶️', status: 'Critical' },
  ],
  eggplant: [
    { name: 'Zone C', icon: '🍆', status: 'Optimal' },
    { name: 'Zone D', icon: '🍆', status: 'Optimal' },
  ],
};

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<ZoneType>('chili');
  const router = useRouter();

  const handleZonePress = (zoneName: string) => {
    router.push(`/plants/zone/${zoneName}`);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerRow}>
        <Text style={styles.headerTitle}>SmartGrow</Text>
        <View style={styles.headerIcons}>
          <Ionicons name="search" size={22} color="#174d3c" style={{ marginRight: 12 }} />
          <Ionicons name="notifications-outline" size={26} color="#174d3c" />
        </View>
      </View>

      {/* Alerts Section */}
      <View style={styles.alertsSection}>
        <Text style={styles.sectionTitle}>Alerts</Text>
        {alerts.map((alert, idx) => (
          <View key={idx} style={[styles.alertBox, { backgroundColor: alert.color + '20' }]}>
            <View style={styles.alertContent}>
              <Ionicons name={alert.icon} size={24} color={alert.color} style={styles.alertIcon} />
              <Text style={styles.alertText}>{alert.text}</Text>
            </View>
            <TouchableOpacity style={styles.alertAction}>
              <Text style={styles.alertActionText}>View</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>

      {/* Zone Tabs */}
      <View style={styles.zoneTabs}>
        <TouchableOpacity
          style={[styles.zoneTab, activeTab === 'chili' && styles.activeZoneTab]}
          onPress={() => setActiveTab('chili')}
        >
          <Text style={[styles.zoneTabText, activeTab === 'chili' && styles.activeZoneTabText]}>Chili Trees</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.zoneTab, activeTab === 'eggplant' && styles.activeZoneTab]}
          onPress={() => setActiveTab('eggplant')}
        >
          <Text style={[styles.zoneTabText, activeTab === 'eggplant' && styles.activeZoneTabText]}>Eggplant Trees</Text>
        </TouchableOpacity>
      </View>

      {/* Zones Grid */}
      <ScrollView contentContainerStyle={styles.zonesContainer}>
        {zones[activeTab].map((zone: Zone, idx: number) => (
          <TouchableOpacity 
            key={idx} 
            style={styles.zoneCard}
            onPress={() => handleZonePress(zone.name)}
          >
            <View style={styles.zoneHeader}>
              <Text style={styles.zoneIcon}>{zone.icon}</Text>
              <View style={[styles.statusBadge, { backgroundColor: zone.status === 'Optimal' ? '#4CAF50' : '#FF5252' }]}>
                <Text style={styles.statusText}>{zone.status}</Text>
              </View>
            </View>
            <Text style={styles.zoneName}>{zone.name}</Text>
            <View style={styles.zoneStats}>
              <View style={styles.statItem}>
                <Ionicons name="water-outline" size={20} color="#45aaf2" />
                <Text style={styles.statValue}>75%</Text>
              </View>
              <View style={styles.statItem}>
                <Ionicons name="sunny-outline" size={20} color="#f7b731" />
                <Text style={styles.statValue}>65%</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
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
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#174d3c',
  },
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  alertsSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#174d3c',
    marginBottom: 12,
  },
  alertBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  alertContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  alertIcon: {
    marginRight: 12,
  },
  alertText: {
    fontSize: 15,
    color: '#333',
    fontWeight: '500',
    flex: 1,
  },
  alertAction: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  alertActionText: {
    color: '#174d3c',
    fontWeight: '600',
  },
  zoneTabs: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  zoneTab: {
    flex: 1,
    backgroundColor: '#fff',
    paddingVertical: 12,
    marginHorizontal: 6,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  activeZoneTab: {
    backgroundColor: '#174d3c',
  },
  zoneTabText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#174d3c',
  },
  activeZoneTabText: {
    color: '#fff',
  },
  zonesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 32,
  },
  zoneCard: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  zoneHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  zoneIcon: {
    fontSize: 32,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  zoneName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  zoneStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statValue: {
    marginLeft: 4,
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
});
