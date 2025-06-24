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

// Define interfaces at the top level
interface DropdownOption {
  label: string;
  value: string;
}

interface CustomDropdownProps {
  placeholder: string;
  value: string;
  options: DropdownOption[];
  onSelect: (value: string) => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  zIndex?: number;
}

export default function ProfileScreen() {
  const { logout, user } = useAuth();
  const router = useRouter();
  const { unreadCount } = useNotifications();
  const [showAddPlant, setShowAddPlant] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);

  // Plant form states - simplified
  const [plantName, setPlantName] = useState("");
  const [group, setGroup] = useState(user?.groupNumber || "Group 10");
  const [plantType, setPlantType] = useState("");
  const [zone, setZone] = useState("");
  const [moisturePin, setMoisturePin] = useState("");

  // Dropdown states - ADD THE MISSING STATE
  const [showPlantTypeDropdown, setShowPlantTypeDropdown] = useState(false);
  const [showZoneDropdown, setShowZoneDropdown] = useState(false);
  const [showPinDropdown, setShowPinDropdown] = useState(false);

  // Profile data states
  const [profileData, setProfileData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");

  // Dropdown options with proper typing
  const zoneOptions: DropdownOption[] = [
    { label: "Zone 1", value: "zone1" },
    { label: "Zone 2", value: "zone2" },
    { label: "Zone 3", value: "zone3" },
    { label: "Zone 4", value: "zone4" },
  ];

  const pinOptions: DropdownOption[] = [
    { label: "Pin 34", value: "34" },
    { label: "Pin 35", value: "35" },
    { label: "Pin 36", value: "36" },
    { label: "Pin 39", value: "39" },
  ];

  const plantTypeOptions: DropdownOption[] = [
    { label: "Chilli", value: "chilli" },
    { label: "Eggplant", value: "eggplant" },
  ];

  // Custom Dropdown Component - MOVE BEFORE USAGE
  const CustomDropdown: React.FC<CustomDropdownProps> = ({
    placeholder,
    value,
    options,
    onSelect,
    isOpen,
    setIsOpen,
    zIndex = 1000,
  }) => {
    const selectedOption: DropdownOption | undefined = options.find(
      (option: DropdownOption) => option.value === value
    );

    return (
      <View style={[styles.dropdownContainer, { zIndex: isOpen ? zIndex : 1 }]}>
        <TouchableOpacity
          style={styles.dropdownButton}
          onPress={() => {
            // Close other dropdowns first
            if (!isOpen) {
              setShowPlantTypeDropdown(false);
              setShowZoneDropdown(false);
              setShowPinDropdown(false);
            }
            setIsOpen(!isOpen);
          }}
        >
          <Text
            style={[
              styles.dropdownText,
              !selectedOption && styles.placeholderText,
            ]}
          >
            {selectedOption ? selectedOption.label : placeholder}
          </Text>
          <Ionicons
            name={isOpen ? "chevron-up" : "chevron-down"}
            size={20}
            color="#999"
          />
        </TouchableOpacity>

        {isOpen && (
          <View style={styles.dropdownMenu}>
            {options.map((option: DropdownOption) => (
              <TouchableOpacity
                key={option.value}
                style={styles.dropdownItem}
                onPress={() => {
                  onSelect(option.value);
                  setIsOpen(false);
                }}
              >
                <Text style={styles.dropdownItemText}>{option.label}</Text>
                {value === option.value && (
                  <Ionicons name="checkmark" size={20} color="#174d3c" />
                )}
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>
    );
  };

  // Fetch user profile data from API
  const fetchProfile = async () => {
    try {
      setLoading(true);
      const data = await userService.getCurrentUser();
      setProfileData(data);
      setEditName(data?.display_name || "");
      setEditEmail(data?.email || "");
    } catch (error) {
      console.error("Error fetching profile:", error);
      Alert.alert("Error", "Failed to fetch profile data");
      // Set default values on error
      setProfileData({
        display_name: user?.name || "User",
        email: user?.email || "",
      });
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

  // Submit plant form - simplified
  const handleSubmitPlant = () => {
    // Validate required fields
    if (!plantName.trim()) {
      Alert.alert("Error", "Please enter plant name");
      return;
    }
    if (!zone.trim()) {
      Alert.alert("Error", "Please select a zone");
      return;
    }
    if (!moisturePin.trim()) {
      Alert.alert("Error", "Please select a moisture pin");
      return;
    }

    // Prepare simplified plant data
    const plantData = {
      name: plantName.trim(),
      userId: user?.id || "demo-user",
      zone: zone.trim(),
      moisturePin: parseInt(moisturePin),
      type: plantType.trim() || "vegetable",
      species: plantType.trim() || "Unknown",
      thresholds: {
        moisture: { min: 30, max: 70 },
        temperature: { min: 20, max: 30 },
        humidity: { min: 40, max: 70 },
        light: { min: 50, max: 80 },
      },
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
          setMoisturePin("");
          setShowPlantTypeDropdown(false);
          setShowZoneDropdown(false);
          setShowPinDropdown(false);
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
    // Initialize profileData to prevent undefined errors
    if (!profileData && user) {
      setProfileData({
        display_name: user.name || "User",
        email: user.email || "",
      });
    }
    fetchProfile();
  }, [user]);

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

  // Edit Profile View (unchanged)
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

  // Add Plant View - Updated with dropdowns
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
          <Text style={[styles.subHeader, styles.plantInfoHeader]}>
            Plant Information
          </Text>
          <View style={styles.addPlantCardContainer}>
            <Text style={styles.inputLabel}>Plant Name</Text>
            <TextInput
              style={styles.inputModern}
              placeholder="Enter Plant Name"
              value={plantName}
              onChangeText={setPlantName}
              placeholderTextColor="#aaa"
            />

            <Text style={styles.inputLabel}>Plant Type</Text>
            <CustomDropdown
              placeholder="Select Plant Type"
              value={plantType}
              options={plantTypeOptions}
              onSelect={setPlantType}
              isOpen={showPlantTypeDropdown}
              setIsOpen={setShowPlantTypeDropdown}
              zIndex={3000}
            />

            <Text style={styles.inputLabel}>Zone</Text>
            <CustomDropdown
              placeholder="Select Zone"
              value={zone}
              options={zoneOptions}
              onSelect={setZone}
              isOpen={showZoneDropdown}
              setIsOpen={setShowZoneDropdown}
              zIndex={2000}
            />

            <Text style={styles.inputLabel}>Moisture Pin</Text>
            <CustomDropdown
              placeholder="Select Moisture Pin"
              value={moisturePin}
              options={pinOptions}
              onSelect={setMoisturePin}
              isOpen={showPinDropdown}
              setIsOpen={setShowPinDropdown}
              zIndex={1000}
            />

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

  // Notification-specific styles
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
  plantInfoHeader: {
    paddingTop: 24,
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

  // Custom Dropdown Styles
  dropdownContainer: {
    width: "100%",
    marginBottom: 16,
    position: "relative",
  },
  dropdownButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    height: 50,
    borderRadius: 12,
    backgroundColor: "#f8f8f8",
    borderWidth: 1,
    borderColor: "#e0e0e0",
    paddingHorizontal: 16,
  },
  dropdownText: {
    fontSize: 16,
    color: "#333",
  },
  placeholderText: {
    color: "#aaa",
  },
  dropdownMenu: {
    position: "absolute",
    top: 52,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 10,
    maxHeight: 200,
  },
  dropdownItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  dropdownItemText: {
    fontSize: 16,
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
