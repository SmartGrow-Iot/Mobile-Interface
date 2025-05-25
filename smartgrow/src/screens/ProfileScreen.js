import React from 'react';
import {StyleSheet, ScrollView, View} from 'react-native';
import {
  Layout,
  Text,
  Card,
  Button,
  TopNavigation,
  TopNavigationAction,
  Avatar,
  Divider,
} from '@ui-kitten/components';
import BottomNavigation from '../components/BottomNavigation';

// Simple emoji icons
const EditIcon = () => <Text style={{fontSize: 16}}>✏️</Text>;
const SettingsIcon = () => <Text style={{fontSize: 16}}>⚙️</Text>;
const NotificationIcon = () => <Text style={{fontSize: 16}}>🔔</Text>;
const HelpIcon = () => <Text style={{fontSize: 16}}>❓</Text>;
const LogoutIcon = () => <Text style={{fontSize: 16}}>🚪</Text>;

export default function ProfileScreen({navigation}) {
  // Profile menu items
  const menuItems = [
    {
      id: 1,
      title: 'Account Settings',
      icon: <SettingsIcon />,
      subtitle: 'Manage your account',
    },
    {
      id: 2,
      title: 'Notifications',
      icon: <NotificationIcon />,
      subtitle: 'Push notifications, alerts',
    },
    {
      id: 3,
      title: 'Help & Support',
      icon: <HelpIcon />,
      subtitle: 'FAQ, contact us',
    },
    {
      id: 4,
      title: 'Sign Out',
      icon: <LogoutIcon />,
      subtitle: 'Logout from your account',
      isLogout: true,
    },
  ];

  // Render menu item
  const renderMenuItem = item => (
    <Card key={item.id} style={styles.menuCard}>
      <View style={styles.menuContent}>
        <View style={styles.menuLeft}>
          <View style={styles.menuIcon}>{item.icon}</View>
          <View style={styles.menuText}>
            <Text
              style={[styles.menuTitle, item.isLogout && styles.logoutText]}>
              {item.title}
            </Text>
            <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
          </View>
        </View>
        <Text style={styles.chevron}>›</Text>
      </View>
    </Card>
  );

  return (
    <Layout style={styles.container}>
      {/* Header */}
      <TopNavigation
        title="Profile"
        accessoryRight={() => <TopNavigationAction icon={EditIcon} />}
        style={styles.topNavigation}
      />

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <Avatar
            style={styles.avatar}
            source={{uri: 'https://via.placeholder.com/100'}}
          />
          <Text category="h5" style={styles.userName}>
            John Gardner
          </Text>
          <Text style={styles.userEmail}>john.gardner@email.com</Text>

          {/* Stats Row */}
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text category="h6" style={styles.statNumber}>
                12
              </Text>
              <Text style={styles.statLabel}>Plants</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text category="h6" style={styles.statNumber}>
                8
              </Text>
              <Text style={styles.statLabel}>Active Sensors</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text category="h6" style={styles.statNumber}>
                45
              </Text>
              <Text style={styles.statLabel}>Days Active</Text>
            </View>
          </View>
        </View>

        {/* Profile Actions */}
        <View style={styles.section}>
          <Button
            style={styles.editProfileButton}
            appearance="outline"
            accessoryLeft={EditIcon}>
            Edit Profile
          </Button>
        </View>

        {/* Menu Items */}
        <View style={styles.section}>
          <Text category="h6" style={styles.sectionTitle}>
            Settings
          </Text>
          {menuItems.map(item => renderMenuItem(item))}
        </View>

        {/* App Info */}
        <View style={styles.appInfo}>
          <Text style={styles.appInfoText}>SmartGrow v1.0.0</Text>
          <Text style={styles.appInfoText}>Made with 🌱 for plant lovers</Text>
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
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
  },
  profileHeader: {
    alignItems: 'center',
    paddingVertical: 30,
    paddingHorizontal: 20,
    backgroundColor: 'white',
    marginBottom: 20,
  },
  avatar: {
    width: 80,
    height: 80,
    marginBottom: 15,
  },
  userName: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  userEmail: {
    color: '#666',
    marginBottom: 20,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    color: '#4CAF50',
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: '#e0e0e0',
    marginHorizontal: 15,
  },
  section: {
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  sectionTitle: {
    fontWeight: 'bold',
    marginBottom: 15,
    paddingLeft: 5,
  },
  editProfileButton: {
    borderRadius: 25,
  },
  menuCard: {
    marginBottom: 10,
    borderRadius: 12,
    // Shadow
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  menuContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
  },
  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  menuText: {
    flex: 1,
  },
  menuTitle: {
    fontWeight: '500',
    marginBottom: 2,
  },
  menuSubtitle: {
    fontSize: 12,
    color: '#666',
  },
  logoutText: {
    color: '#FF6B6B',
  },
  chevron: {
    fontSize: 18,
    color: '#ccc',
    fontWeight: 'bold',
  },
  appInfo: {
    alignItems: 'center',
    paddingVertical: 20,
    paddingBottom: 30,
  },
  appInfoText: {
    fontSize: 12,
    color: '#999',
    marginBottom: 2,
  },
});
