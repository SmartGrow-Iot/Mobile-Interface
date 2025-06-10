import React from 'react';
import { StyleSheet, ScrollView, View } from 'react-native';
import { 
  Layout, 
  Text, 
  Card, 
  Button, 
  TopNavigation, 
  TopNavigationAction,
} from '@ui-kitten/components';
import BottomNavigation from '../components/BottomNavigation';

const SearchIcon = () => <Text style={{fontSize: 20}}>🔍</Text>;
const PersonIcon = () => <Text style={{fontSize: 20}}>👤</Text>;
const SunIcon = () => <Text style={{fontSize: 16, color: 'white'}}>☀️</Text>;
const DropletIcon = () => <Text style={{fontSize: 16, color: 'white'}}>💧</Text>;
const ActivityIcon = () => <Text style={{fontSize: 16, color: 'white'}}>📊</Text>;
const GridIcon = () => <Text style={{fontSize: 16, color: 'white'}}>⚡</Text>;

export default function HomeScreen({ navigation }) {
  // State for selected plant category
  const [selectedCategory, setSelectedCategory] = React.useState('Chili Trees');
  // State for selected sensor
  const [selectedSensor, setSelectedSensor] = React.useState('Light');

  // Sample plant data with categories
  const plants = [
    { id: 1, name: 'Bethany', group: 'Group 1', status: 'good', category: 'Chili Trees', emoji: '🌶️' },
    { id: 2, name: 'Jamal', group: 'Group 1', status: 'good', category: 'Chili Trees', emoji: '🌶️' },
    { id: 3, name: 'Purple Beauty', group: 'Group 2', status: 'warning', category: 'Eggplant Trees', emoji: '🍆' },
    { id: 4, name: 'Royal Eggplant', group: 'Group 2', status: 'good', category: 'Eggplant Trees', emoji: '🍆' },
    { id: 5, name: 'Spicy Red', group: 'Group 3', status: 'good', category: 'Chili Trees', emoji: '🌶️' },
    { id: 6, name: 'Garden Purple', group: 'Group 3', status: 'good', category: 'Eggplant Trees', emoji: '🍆' },
  ];

  // Filter plants based on selected category
  const filteredPlants = plants.filter(plant => plant.category === selectedCategory);

  // Render plant card
  const renderPlantCard = (plant) => (
    <Card key={plant.id} style={styles.plantCard}>
      <View style={styles.plantImageContainer}>
        <Text style={styles.plantEmoji}>{plant.emoji}</Text>
      </View>
      <Text style={styles.plantName}>{plant.name}</Text>
      <Text style={styles.plantGroup}>{plant.group}</Text>
      <View style={styles.statusContainer}>
        <View style={[styles.statusDot, 
          plant.status === 'good' ? styles.statusGood : styles.statusWarning]} />
      </View>
    </Card>
  );

  // Render sensor card
  const renderSensorCard = (title, icon, color, onPress) => (
    <Card 
      style={[
        styles.sensorCard, 
        selectedSensor === title && styles.activeSensorCard
      ]}
      onPress={() => {
        setSelectedSensor(title);
        if (onPress) onPress();
      }}
    >
      <View style={styles.sensorContent}>
        <View style={[styles.iconContainer, { backgroundColor: color }]}>
          {icon}
        </View>
        <Text style={styles.sensorTitle}>{title}</Text>
      </View>
    </Card>
  );

  // Top Navigation Actions
  const SearchAction = () => (
    <TopNavigationAction icon={SearchIcon}/>
  );

  const ProfileAction = () => (
    <TopNavigationAction 
      icon={PersonIcon}
      onPress={() => navigation.navigate('Profile')}
    />
  );

  return (
    <Layout style={styles.container}>
      {/* Header */}
      <TopNavigation
        title='My Plants'
        accessoryLeft={SearchAction}
        accessoryRight={ProfileAction}
        style={styles.topNavigation}
      />

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Sensors Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text category='h6' style={styles.sectionTitle}>Sensors</Text>
            <Button appearance='ghost' size='small'>
              <Text style={styles.viewAllText}>View all</Text>
            </Button>
          </View>
          
          <View style={styles.sensorsGrid}>
            {renderSensorCard('All Data', <GridIcon/>, '#4CAF50')}
            {renderSensorCard('Light', <SunIcon/>, '#FF9800')}
            {renderSensorCard('Soil', <DropletIcon/>, '#8D6E63')}
            {renderSensorCard('Actuator Control', <ActivityIcon/>, '#9C27B0')}
          </View>
        </View>

        {/* Plant Categories - Segmented Control */}
        <View style={styles.section}>
          <View style={styles.segmentedControl}>
            <Button 
              style={[
                styles.segmentButton, 
                styles.segmentButtonLeft,
                selectedCategory === 'Chili Trees' && styles.segmentButtonActive
              ]}
              appearance={selectedCategory === 'Chili Trees' ? 'filled' : 'outline'}
              size='small'
              onPress={() => setSelectedCategory('Chili Trees')}
            >
              <Text style={[
                styles.segmentButtonText,
                selectedCategory === 'Chili Trees' && styles.segmentButtonTextActive
              ]}>
                🌶️ Chili Trees
              </Text>
            </Button>
            <Button 
              style={[
                styles.segmentButton, 
                styles.segmentButtonRight,
                selectedCategory === 'Eggplant Trees' && styles.segmentButtonActive
              ]}
              appearance={selectedCategory === 'Eggplant Trees' ? 'filled' : 'outline'}
              size='small'
              onPress={() => setSelectedCategory('Eggplant Trees')}
            >
              <Text style={[
                styles.segmentButtonText,
                selectedCategory === 'Eggplant Trees' && styles.segmentButtonTextActive
              ]}>
                🍆 Eggplant Trees
              </Text>
            </Button>
          </View>
        </View>

        {/* Plants Grid */}
        <View style={styles.plantsGrid}>
          {filteredPlants.map(plant => renderPlantCard(plant))}
        </View>
      </ScrollView>

      {/* Use the separate BottomNavigation component */}
      <BottomNavigation />
    </Layout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  topNavigation: {
    paddingHorizontal: 16,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 16,
  },
  section: {
    marginTop: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontWeight: 'bold',
  },
  viewAllText: {
    color: '#4CAF50',
    fontSize: 12,
  },
  sensorsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  sensorCard: {
    width: '48%',
    marginBottom: 10,
    borderRadius: 12,
    // Shadow for iOS
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    // Shadow for Android
    elevation: 3,
  },
  activeSensorCard: {
    borderColor: '#FF9800',
    borderWidth: 2,
    // Enhanced shadow for active state
    shadowColor: '#FF9800',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 6,
  },
  sensorContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  icon: {
    width: 16,
    height: 16,
  },
  sensorTitle: {
    fontSize: 12,
    fontWeight: '500',
  },
  categoriesRow: {
    flexDirection: 'row',
    gap: 10,
  },
  categoryButton: {
    borderRadius: 20,
    paddingHorizontal: 16,
  },
  // Segmented Control Styles
  segmentedControl: {
    flexDirection: 'row',
    backgroundColor: '#f0f0f0',
    borderRadius: 25,
    padding: 2,
  },
  segmentButton: {
    flex: 1,
    borderRadius: 23,
    marginHorizontal: 1,
    borderWidth: 0,
  },
  segmentButtonLeft: {
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
  },
  segmentButtonRight: {
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
  },
  segmentButtonActive: {
    backgroundColor: '#4CAF50',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  segmentButtonText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#666',
  },
  segmentButtonTextActive: {
    color: 'white',
    fontWeight: '600',
  },
  plantsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 20,
    paddingBottom: 20,
  },
  plantCard: {
    width: '48%',
    marginBottom: 16,
    borderRadius: 12,
    padding: 16,
    // Shadow for iOS
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    // Shadow for Android
    elevation: 4,
  },
  plantImageContainer: {
    alignItems: 'center',
    marginBottom: 12,
  },
  plantEmoji: {
    fontSize: 40,
  },
  plantName: {
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 4,
  },
  plantGroup: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginBottom: 8,
  },
  statusContainer: {
    alignItems: 'center',
  },
  statusDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: 'white',
  },
  statusGood: {
    backgroundColor: '#4CAF50',
  },
  statusWarning: {
    backgroundColor: '#FF9800',
  },
  activeNavText: {
    color: '#4CAF50',
    fontSize: 10,
    marginTop: 4,
  },
  navText: {
    color: '#666',
    fontSize: 10,
    marginTop: 4,
  },
});