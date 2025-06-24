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
import { apiRequest } from "../../services/api";
import { plantService } from "../../services/plantService";
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
  const [showAddPlant, setShowAddPlant] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);

  // Plant form states - enhanced with new fields
  const [plantName, setPlantName] = useState("");
  const [group, setGroup] = useState(user?.groupNumber || "Group 10");
  const [plantType, setPlantType] = useState("");
  const [zone, setZone] = useState("");
  const [moisturePin, setMoisturePin] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [moistureMinThreshold, setMoistureMinThreshold] = useState("30");
  const [moistureMaxThreshold, setMoistureMaxThreshold] = useState("70");

  // Dropdown states
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

  // Custom Dropdown Component
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

  // Reset plant form
  const resetPlantForm = () => {
    setPlantName("");
    setPlantType("");
    setZone("");
    setMoisturePin("");
    setDescription("");
    setImageUrl("");
    setMoistureMinThreshold("30");
    setMoistureMaxThreshold("70");
    setShowPlantTypeDropdown(false);
    setShowZoneDropdown(false);
    setShowPinDropdown(false);
  };

  // Submit plant form - enhanced with API integration and validation
  const handleSubmitPlant = async () => {
    // Prepare form data for validation
    const formData = {
      name: plantName,
      zone: zone,
      moisturePin: moisturePin,
      description: description,
      imageUrl: imageUrl,
      moistureMinThreshold: moistureMinThreshold,
      moistureMaxThreshold: moistureMaxThreshold,
      userId: user?.id || "demo-user",
    };

    // Use plant service validation
    const validation = plantService.validatePlantData({
      ...formData,
      thresholds: {
        moisture: {
          min: parseFloat(moistureMinThreshold),
          max: parseFloat(moistureMaxThreshold),
        },
      },
    });

    if (!validation.isValid) {
      Alert.alert("Validation Error", validation.errors.join("\n"));
      return;
    }

    // Format data for API submission
    const plantData = plantService.formatPlantData(formData);

    try {
      setLoading(true);
      console.log("Creating plant with validated data:", plantData);

      // Use plant service to create the plant
      const response = await plantService.createPlant(plantData);

      console.log("Plant created successfully:", response);

      Alert.alert("Success", "Plant added successfully!", [
        {
          text: "OK",
          onPress: () => {
            resetPlantForm();
            setShowAddPlant(false);
          },
        },
      ]);
    } catch (error) {
      console.error("Error creating plant:", error);
      Alert.alert(
        "Error",
        error instanceof Error
          ? error.message
          : "Failed to add plant. Please try again."
      );
    } finally {
      setLoading(false);
    }
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

  // Add Plant View - Enhanced with new fields
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

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <Text style={[styles.subHeader, styles.plantInfoHeader]}>
            Plant Information
          </Text>
          <View style={styles.addPlantCardContainer}>
            {loading && (
              <View style={styles.loadingOverlay}>
                <ActivityIndicator size="large" color="#174d3c" />
                <Text style={styles.loadingText}>Creating plant...</Text>
              </View>
            )}

            <Text style={styles.inputLabel}>Plant Name *</Text>
            <TextInput
              style={[styles.inputModern, loading && styles.inputDisabled]}
              placeholder="Enter Plant Name"
              value={plantName}
              onChangeText={setPlantName}
              placeholderTextColor="#aaa"
              editable={!loading}
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

            <Text style={styles.inputLabel}>Zone *</Text>
            <CustomDropdown
              placeholder="Select Zone"
              value={zone}
              options={zoneOptions}
              onSelect={setZone}
              isOpen={showZoneDropdown}
              setIsOpen={setShowZoneDropdown}
              zIndex={2000}
            />

            <Text style={styles.inputLabel}>Moisture Pin *</Text>
            <CustomDropdown
              placeholder="Select Moisture Pin"
              value={moisturePin}
              options={pinOptions}
              onSelect={setMoisturePin}
              isOpen={showPinDropdown}
              setIsOpen={setShowPinDropdown}
              zIndex={1000}
            />

            <Text style={styles.inputLabel}>Description *</Text>
            <TextInput
              style={[
                styles.inputModern,
                styles.textAreaInput,
                loading && styles.inputDisabled,
              ]}
              placeholder="Enter plant description (care instructions, notes, etc.)"
              value={description}
              onChangeText={setDescription}
              placeholderTextColor="#aaa"
              multiline
              numberOfLines={3}
              editable={!loading}
            />

            <Text style={styles.inputLabel}>Image URL (Optional)</Text>
            <TextInput
              style={[styles.inputModern, loading && styles.inputDisabled]}
              placeholder="Enter image URL (e.g., https://example.com/plant.jpg)"
              value={imageUrl}
              onChangeText={setImageUrl}
              placeholderTextColor="#aaa"
              editable={!loading}
              autoCapitalize="none"
            />

            <Text style={styles.sectionTitle}>Moisture Thresholds</Text>
            <Text style={styles.sectionSubtitle}>
              Set optimal moisture levels for automatic watering
            </Text>

            <View style={styles.thresholdContainer}>
              <View style={styles.thresholdInputContainer}>
                <Text style={styles.inputLabel}>Minimum Moisture (%)</Text>
                <TextInput
                  style={[
                    styles.inputModern,
                    styles.thresholdInput,
                    loading && styles.inputDisabled,
                  ]}
                  placeholder="30"
                  value={moistureMinThreshold}
                  onChangeText={setMoistureMinThreshold}
                  placeholderTextColor="#aaa"
                  keyboardType="numeric"
                  editable={!loading}
                />
              </View>

              <View style={styles.thresholdInputContainer}>
                <Text style={styles.inputLabel}>Maximum Moisture (%)</Text>
                <TextInput
                  style={[
                    styles.inputModern,
                    styles.thresholdInput,
                    loading && styles.inputDisabled,
                  ]}
                  placeholder="70"
                  value={moistureMaxThreshold}
                  onChangeText={setMoistureMaxThreshold}
                  placeholderTextColor="#aaa"
                  keyboardType="numeric"
                  editable={!loading}
                />
              </View>
            </View>

            <View style={styles.thresholdInfo}>
              <Ionicons
                name="information-circle-outline"
                size={16}
                color="#666"
              />
              <Text style={styles.thresholdInfoText}>
                When moisture drops below minimum, automatic watering will
                trigger. Values should be between 0-100%.
              </Text>
            </View>

            <TouchableOpacity
              style={[styles.submitBtnModern, loading && styles.buttonDisabled]}
              onPress={handleSubmitPlant}
              disabled={loading}
            >
              <Text style={styles.submitBtnTextModern}>
                {loading ? "CREATING PLANT..." : "CREATE PLANT"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.cancelButton, loading && styles.buttonDisabled]}
              onPress={() => setShowAddPlant(false)}
              disabled={loading}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    );
  }

  // Main Profile View
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
    position: "relative",
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
  inputDisabled: {
    opacity: 0.6,
    backgroundColor: "#f0f0f0",
  },
  textAreaInput: {
    height: 80,
    textAlignVertical: "top",
    paddingTop: 12,
  },

  // Enhanced threshold styles
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#174d3c",
    marginTop: 20,
    marginBottom: 8,
    textAlign: "center",
  },
  sectionSubtitle: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginBottom: 20,
  },
  thresholdContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
    marginBottom: 12,
  },
  thresholdInputContainer: {
    flex: 1,
  },
  thresholdInput: {
    marginBottom: 0,
  },
  thresholdInfo: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "#f0f8ff",
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
  },
  thresholdInfoText: {
    fontSize: 12,
    color: "#666",
    marginLeft: 8,
    flex: 1,
    lineHeight: 16,
  },

  // Loading overlay for add plant
  loadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
    borderRadius: 20,
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
