import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, Text } from '@ui-kitten/components';
import { useNavigation, useRoute } from '@react-navigation/native';

// Simple emoji icons
const HomeIcon = () => <Text style={{fontSize: 16}}>🏠</Text>;
const ListIcon = () => <Text style={{fontSize: 16}}>📋</Text>;
const SettingsIcon = () => <Text style={{fontSize: 16}}>⚙️</Text>;
const PersonIcon = () => <Text style={{fontSize: 16}}>👤</Text>;

export default function BottomNavigation() {
  const navigation = useNavigation();
  const route = useRoute();
  
  // Get current route name to highlight active tab
  const currentRoute = route.name;

  const navigateToScreen = (screenName) => {
    navigation.navigate(screenName);
  };

  return (
    <View style={styles.bottomNavigation}>
      <Button 
        appearance='ghost' 
        accessoryLeft={HomeIcon} 
        style={styles.navButton}
        onPress={() => navigateToScreen('Home')}
      >
        <Text style={[
          styles.navText,
          currentRoute === 'Home' && styles.activeNavText
        ]}>
          Home
        </Text>
      </Button>
      
      <Button 
        appearance='ghost' 
        accessoryLeft={ListIcon} 
        style={styles.navButton}
        onPress={() => navigateToScreen('About')}
      >
        <Text style={[
          styles.navText,
          currentRoute === 'About' && styles.activeNavText
        ]}>
          My Plants
        </Text>
      </Button>
      
      <Button 
        appearance='ghost' 
        accessoryLeft={SettingsIcon} 
        style={styles.navButton}
        onPress={() => navigateToScreen('Contact')}
      >
        <Text style={[
          styles.navText,
          currentRoute === 'Contact' && styles.activeNavText
        ]}>
          Settings
        </Text>
      </Button>
      
      <Button 
        appearance='ghost' 
        accessoryLeft={PersonIcon} 
        style={styles.navButton}
        onPress={() => navigateToScreen('Profile')}
      >
        <Text style={[
          styles.navText,
          currentRoute === 'Profile' && styles.activeNavText
        ]}>
          Profile
        </Text>
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  bottomNavigation: {
    flexDirection: 'row',
    backgroundColor: 'white',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    // Add shadow
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 5,
  },
  navButton: {
    flex: 1,
    flexDirection: 'column',
    height: 60,
  },
  navText: {
    color: '#666',
    fontSize: 10,
    marginTop: 4,
  },
  activeNavText: {
    color: '#4CAF50',
    fontWeight: '600',
  },
});