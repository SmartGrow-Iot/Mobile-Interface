// app/(tabs)/profile.tsx - Updated with enhanced add plant form
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useAuth } from "../../contexts/AuthContext";
import { userService } from "../../services/userService";
import { useNotifications } from "../../hooks/useNotifications";
import Header from "../../components/Header";

export default function ProfileScreen() {
  const { logout, user } = useAuth();
  const router = useRouter();
  const { unreadCount } = useNotifications();
  const [showAddPlant, setShowAddPlant] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);

  // Plant form states
  const [plantName, setPlantName] = useState("");
  const [group, setGroup] = useState(user?.groupNumber || "Group 10");
  const [plantType, setPlantType] = useState("");
  const [zone, setZone] = useState("");
  const [esp32Id, setEsp32Id] = useState("");

  // Sensor selection and ID states
  const [selectedSensors, setSelectedSensors] = useState({
    light: false,
    soil: false,
    airquality: false,
    temperature: false,
    humidity: false,
  });
  const [sensorIds, setSensorIds] = useState({
    light: "",
    soil: "",
    airquality: "",
    temperature: "",
    humidity: "",
  });

  // Profile data states
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");

  // Fetch user profile data from API
  const fetchProfile = async () => {
    try {
      setLoading(true);
      const data = await userService.getCurrentUser();
      setProfileData(data);
      setEditName(data.display_name || "");
      setEditEmail(data.email || "");
    } catch (error) {
      console.error("Error fetching profile:", error);
      Alert.alert("Error", "Failed to fetch profile data");
    } finally {
      setLoading(false);
    }
  };

  // Update user profile
  const updateProfile = async () => {
    if (!editName.trim() || !editEmail.trim()) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    try {
      setLoading(true);
      await userService.updateProfile({
        display_name: editName.trim(),
        email: editEmail.trim(),
      });

      Alert.alert("Success", "Profile updated successfully!", [
        {
          text: "OK",
          onPress: () => {
            setShowEditProfile(false);
            fetchProfile(); // Refresh data
          },
        },
      ]);
    } catch (error) {
      console.error("Error updating profile:", error);
      Alert.alert("Error", "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  // Handle sensor selection
  const handleSensorPress = (sensorType) => {
    setSelectedSensors((prev) => ({
      ...prev,
      [sensorType]: !prev[sensorType],
    }));

    // Clear sensor ID if sensor is deselected
    if (selectedSensors[sensorType]) {
      setSensorIds((prev) => ({
        ...prev,
        [sensorType]: "",
      }));
    }
  };

  // Handle sensor ID input
  const handleSensorIdChange = (sensorType, value) => {
    setSensorIds((prev) => ({
      ...prev,
      [sensorType]: value,
    }));
  };

  // Submit plant form
  const handleSubmitPlant = () => {
    // Validate required fields
    if (!plantName.trim()) {
      Alert.alert("Error", "Please enter plant name");
      return;
    }
    if (!plantType.trim()) {
      Alert.alert("Error", "Please enter plant type");
      return;
    }
    if (!zone.trim()) {
      Alert.alert("Error", "Please enter zone");
      return;
    }
    if (!esp32Id.trim()) {
      Alert.alert("Error", "Please enter ESP32 ID");
      return;
    }

    // Check if at least one sensor is selected
    const hasSelectedSensor = Object.values(selectedSensors).some(
      (selected) => selected
    );
    if (!hasSelectedSensor) {
      Alert.alert("Error", "Please select at least one sensor");
      return;
    }

    // Validate sensor IDs for selected sensors
    for (const [sensorType, isSelected] of Object.entries(selectedSensors)) {
      if (isSelected && !sensorIds[sensorType].trim()) {
        Alert.alert("Error", `Please enter Sensor ID for ${sensorType} sensor`);
        return;
      }
    }

    // Prepare plant data
    const plantData = {
      name: plantName.trim(),
      group: group.trim(),
      type: plantType.trim(),
      zone: zone.trim(),
      esp32Id: esp32Id.trim(),
      sensors: Object.entries(selectedSensors)
        .filter(([_, isSelected]) => isSelected)
        .map(([sensorType, _]) => ({
          type: sensorType,
          id: sensorIds[sensorType].trim(),
        })),
    };

    console.log("Plant Data:", plantData);
    Alert.alert("Success", "Plant added successfully!", [
      {
        text: "OK",
        onPress: () => {
          // Reset form
          setPlantName("");
          setPlantType("");
          setZone("");
          setEsp32Id("");
          setSelectedSensors({
            light: false,
            soil: false,
            airquality: false,
            temperature: false,
            humidity: false,
          });
          setSensorIds({
            light: "",
            soil: "",
            airquality: "",
            temperature: "",
            humidity: "",
          });
          setShowAddPlant(false);
        },
      },
    ]);
  };

  // Navigate to notifications screen
  const handleNotificationsPress = () => {
    router.push("/notifications");
  };

  // Load profile data when component mounts
  useEffect(() => {
    fetchProfile();
  }, []);

  const handleLogout = async () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          try {
            logout();
            router.replace("/(auth)/signin");
          } catch (error) {
            Alert.alert("Error", "Failed to logout. Please try again.");
          }
        },
      },
    ]);
  };

  // Sensor configurations
  const sensorConfigs = {
    light: {
      icon: "sunny",
      color: "#f7b731",
      bgColor: "#fffbe6",
      label: "Light Sensor",
    },
    soil: {
      icon: "cube",
      color: "#a0522d",
      bgColor: "#f5eee6",
      label: "Soil Sensor",
    },
    airquality: {
      icon: "cloud-outline",
      color: "#45aaf2",
      bgColor: "#e6f7fb",
      label: "CO2 Sensor",
    },
    temperature: {
      icon: "thermometer-outline",
      color: "#eb4d4b",
      bgColor: "#fbeee6",
      label: "Temperature Sensor",
    },
    humidity: {
      icon: "water-outline",
      color: "#45aaf2",
      bgColor: "#e6f7fa",
      label: "Humidity Sensor",
    },
  };

  // Edit Profile View
  if (showEditProfile) {
    return (
      <View style={styles.container}>
        <Header
          title="Edit Profile"
          showBackButton={false}
          customBreadcrumbs={[
            { label: "Home", route: "/" },
            { label: "Profile", route: "/(tabs)/profile" },
            { label: "Edit Profile" },
          ]}
        />

        <ScrollView style={styles.content}>
          <View style={styles.editProfileContainer}>
            <Text style={styles.subHeader}>Update Your Information</Text>

            {loading && (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#174d3c" />
                <Text style={styles.loadingText}>Updating profile...</Text>
              </View>
            )}

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Display Name</Text>
              <TextInput
                style={styles.inputModern}
                placeholder="Enter your display name"
                value={editName}
                onChangeText={setEditName}
                placeholderTextColor="#aaa"
                editable={!loading}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Email Address</Text>
              <TextInput
                style={styles.inputModern}
                placeholder="Enter your email"
                value={editEmail}
                onChangeText={setEditEmail}
                placeholderTextColor="#aaa"
                keyboardType="email-address"
                autoCapitalize="none"
                editable={!loading}
              />
            </View>

            <TouchableOpacity
              style={[styles.submitBtnModern, loading && styles.buttonDisabled]}
              onPress={updateProfile}
              disabled={loading}
            >
              <Text style={styles.submitBtnTextModern}>
                {loading ? "Updating..." : "UPDATE PROFILE"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setShowEditProfile(false)}
              disabled={loading}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    );
  }

  // Add Plant View (Enhanced)
  if (showAddPlant) {
    return (
      <View style={styles.container}>
        <Header
          title="Add Plant"
          showBackButton={false}
          customBreadcrumbs={[
            { label: "Home", route: "/" },
            { label: "Profile", route: "/(tabs)/profile" },
            { label: "Add Plant" },
          ]}
        />

        <ScrollView style={styles.content}>
          <Text style={styles.subHeader}>Plant Information</Text>
          <View style={styles.addPlantCardContainer}>
            <TouchableOpacity style={styles.uploadArea}>
              <Ionicons name="cloud-upload-outline" size={44} color="#bbb" />
              <Text style={styles.uploadText}>Upload Image</Text>
            </TouchableOpacity>

            <TextInput
              style={styles.inputModern}
              placeholder="Enter Plant Name"
              value={plantName}
              onChangeText={setPlantName}
              placeholderTextColor="#aaa"
            />

            <TextInput
              style={styles.inputModern}
              placeholder="Group Number"
              value={group}
              onChangeText={setGroup}
              placeholderTextColor="#aaa"
            />

            <TextInput
              style={styles.inputModern}
              placeholder="Plant Type"
              value={plantType}
              onChangeText={setPlantType}
              placeholderTextColor="#aaa"
            />

            {/* New Zone Field */}
            <TextInput
              style={styles.inputModern}
              placeholder="Zone (e.g., Zone A, Zone B)"
              value={zone}
              onChangeText={setZone}
              placeholderTextColor="#aaa"
            />

            {/* New ESP32 ID Field */}
            <TextInput
              style={styles.inputModern}
              placeholder="ESP32 ID (e.g., ESP32_001)"
              value={esp32Id}
              onChangeText={setEsp32Id}
              placeholderTextColor="#aaa"
            />

            <Text style={styles.addSensorLabel}>Add Sensors</Text>
            <Text style={styles.sensorDescription}>
              Select sensors and enter their IDs
            </Text>

            <View style={styles.sensorsGrid}>
              {Object.entries(sensorConfigs).map(([sensorType, config]) => (
                <View key={sensorType} style={styles.sensorContainer}>
                  <TouchableOpacity
                    style={[
                      styles.sensorBtnModern,
                      { backgroundColor: config.bgColor },
                      selectedSensors[sensorType] && styles.sensorSelected,
                    ]}
                    onPress={() => handleSensorPress(sensorType)}
                  >
                    <Ionicons
                      name={config.icon}
                      size={22}
                      color={config.color}
                      style={styles.sensorIconModern}
                    />
                    <Text style={styles.sensorLabelModern}>{config.label}</Text>
                    {selectedSensors[sensorType] && (
                      <Ionicons
                        name="checkmark-circle"
                        size={20}
                        color="#174d3c"
                      />
                    )}
                  </TouchableOpacity>

                  {selectedSensors[sensorType] && (
                    <TextInput
                      style={styles.sensorIdInput}
                      placeholder={`${config.label} ID`}
                      value={sensorIds[sensorType]}
                      onChangeText={(value) =>
                        handleSensorIdChange(sensorType, value)
                      }
                      placeholderTextColor="#aaa"
                    />
                  )}
                </View>
              ))}
            </View>

            <TouchableOpacity
              style={styles.submitBtnModern}
              onPress={handleSubmitPlant}
            >
              <Text style={styles.submitBtnTextModern}>SUBMIT</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setShowAddPlant(false)}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    );
  }

  // Main Profile View (unchanged)
  return (
    <View style={styles.container}>
      <Header title="Profile" showSearch={true} />

      <ScrollView style={styles.content}>
        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#174d3c" />
            <Text style={styles.loadingText}>Loading profile...</Text>
          </View>
        )}

        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            <Ionicons name="person-circle" size={80} color="#174d3c" />
          </View>
          <Text style={styles.name}>
            {profileData?.display_name || user?.name || "Loading..."}
          </Text>
          <Text style={styles.email}>
            {profileData?.email || user?.email || "Loading..."}
          </Text>
          <Text style={styles.group}>Group {user?.groupNumber || "10"}</Text>
        </View>

        <View style={styles.menuSection}>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => setShowEditProfile(true)}
          >
            <View style={styles.menuItemLeft}>
              <View
                style={[
                  styles.menuIconContainer,
                  { backgroundColor: "#e3f2fd" },
                ]}
              >
                <Ionicons name="create-outline" size={24} color="#1976d2" />
              </View>
              <Text style={styles.menuText}>Edit Profile</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#666" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => setShowAddPlant(true)}
          >
            <View style={styles.menuItemLeft}>
              <View
                style={[
                  styles.menuIconContainer,
                  { backgroundColor: "#e8f5e8" },
                ]}
              >
                <Ionicons name="add-circle-outline" size={24} color="#174d3c" />
              </View>
              <Text style={styles.menuText}>Add Plant</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#666" />
          </TouchableOpacity>

          {/* Updated Notifications Menu Item */}
          <TouchableOpacity
            style={styles.menuItem}
            onPress={handleNotificationsPress}
          >
            <View style={styles.menuItemLeft}>
              <View
                style={[
                  styles.menuIconContainer,
                  { backgroundColor: "#fff3e0" },
                ]}
              >
                <View style={styles.notificationIconWrapper}>
                  <Ionicons
                    name="notifications-outline"
                    size={24}
                    color="#f57c00"
                  />
                  {unreadCount > 0 && (
                    <View style={styles.notificationBadge}>
                      <Text style={styles.notificationBadgeText}>
                        {unreadCount > 9 ? "9+" : unreadCount}
                      </Text>
                    </View>
                  )}
                </View>
              </View>
              <View style={styles.notificationTextContainer}>
                <Text style={styles.menuText}>Notifications</Text>
                {unreadCount > 0 && (
                  <Text style={styles.unreadText}>{unreadCount} unread</Text>
                )}
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#666" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} onPress={fetchProfile}>
            <View style={styles.menuItemLeft}>
              <View
                style={[
                  styles.menuIconContainer,
                  { backgroundColor: "#f3e5f5" },
                ]}
              >
                <Ionicons name="refresh-outline" size={24} color="#9c27b0" />
              </View>
              <Text style={styles.menuText}>Refresh Profile</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#666" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={24} color="#fff" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f8f8",
  },
  content: {
    flex: 1,
  },
  profileSection: {
    alignItems: "center",
    paddingVertical: 30,
    backgroundColor: "#fff",
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  avatarContainer: {
    marginBottom: 16,
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 6,
  },
  email: {
    fontSize: 16,
    color: "#666",
    marginBottom: 6,
  },
  group: {
    fontSize: 16,
    color: "#174d3c",
    fontWeight: "600",
    backgroundColor: "#e8f5e8",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 8,
  },

  menuSection: {
    backgroundColor: "#fff",
    marginHorizontal: 16,
    borderRadius: 16,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  menuItemLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  menuIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  menuText: {
    fontSize: 16,
    color: "#333",
    fontWeight: "500",
  },

  // New notification-specific styles
  notificationIconWrapper: {
    position: "relative",
  },
  notificationBadge: {
    position: "absolute",
    top: -4,
    right: -4,
    backgroundColor: "#ff4444",
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 4,
    borderWidth: 1,
    borderColor: "#fff",
  },
  notificationBadgeText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "bold",
  },
  notificationTextContainer: {
    flex: 1,
  },
  unreadText: {
    fontSize: 12,
    color: "#f57c00",
    fontWeight: "500",
    marginTop: 2,
  },

  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ff4444",
    marginHorizontal: 16,
    marginBottom: 32,
    padding: 16,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  logoutText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 8,
  },
  subHeader: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 24,
    textAlign: "center",
  },
  editProfileContainer: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 24,
    margin: 16,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 6,
  },
  addPlantCardContainer: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 24,
    margin: 16,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 6,
    alignItems: "center",
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  uploadArea: {
    borderWidth: 2,
    borderColor: "#e0e0e0",
    borderStyle: "dashed",
    borderRadius: 16,
    width: "100%",
    height: 120,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
    backgroundColor: "#fafafa",
  },
  uploadText: {
    color: "#888",
    fontSize: 16,
    marginTop: 8,
    fontWeight: "500",
  },
  inputModern: {
    width: "100%",
    height: 50,
    borderRadius: 12,
    backgroundColor: "#f8f8f8",
    borderWidth: 1,
    borderColor: "#e0e0e0",
    paddingHorizontal: 16,
    fontSize: 16,
    color: "#333",
    marginBottom: 16,
  },
  addSensorLabel: {
    fontWeight: "bold",
    fontSize: 18,
    alignSelf: "flex-start",
    marginTop: 8,
    marginBottom: 8,
    color: "#333",
  },
  sensorDescription: {
    fontSize: 14,
    color: "#666",
    alignSelf: "flex-start",
    marginBottom: 16,
  },
  sensorsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 24,
    gap: 10,
  },
  sensorContainer: {
    width: "47%",
    marginBottom: 16,
  },
  sensorBtnModern: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 8,
    shadowColor: "#000",
    shadowOpacity: 0.03,
    shadowRadius: 2,
    elevation: 1,
    borderWidth: 2,
    borderColor: "transparent",
  },
  sensorSelected: {
    borderColor: "#174d3c",
    backgroundColor: "#e8f5e8",
  },
  sensorIconModern: {
    marginRight: 8,
  },
  sensorLabelModern: {
    fontSize: 12,
    fontWeight: "500",
    color: "#333",
    flex: 1,
  },
  sensorIdInput: {
    height: 40,
    borderRadius: 8,
    backgroundColor: "#f0f0f0",
    borderWidth: 1,
    borderColor: "#ddd",
    paddingHorizontal: 12,
    fontSize: 14,
    color: "#333",
  },
  submitBtnModern: {
    backgroundColor: "#174d3c",
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 40,
    width: "100%",
    alignItems: "center",
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  submitBtnTextModern: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
    letterSpacing: 0.5,
  },
  cancelButton: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 40,
    width: "100%",
    alignItems: "center",
  },
  cancelButtonText: {
    color: "#666",
    fontWeight: "600",
    fontSize: 16,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  loadingContainer: {
    alignItems: "center",
    padding: 20,
  },
  loadingText: {
    marginTop: 8,
    fontSize: 16,
    color: "#666",
  },
});
