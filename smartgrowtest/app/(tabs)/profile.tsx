import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useAuth } from "../../contexts/AuthContext";

export default function ProfileScreen() {
  const { logout, user } = useAuth();
  const router = useRouter();
  const [showAddPlant, setShowAddPlant] = useState(false);
  const [plantName, setPlantName] = useState("");
  const [group, setGroup] = useState(user?.groupNumber || "Group 10");
  const [plantType, setPlantType] = useState("");

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
            // Navigate back to auth
            router.replace("/(auth)/signin");
          } catch (error) {
            Alert.alert("Error", "Failed to logout. Please try again.");
          }
        },
      },
    ]);
  };

  if (showAddPlant) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Profile</Text>
          <TouchableOpacity
            onPress={() => setShowAddPlant(false)}
            style={{ position: "absolute", right: 20, top: 0 }}
          >
            <Ionicons name="close" size={28} color="#174d3c" />
          </TouchableOpacity>
        </View>
        <Text style={styles.subHeader}>Plant</Text>
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
          <Text style={styles.addSensorLabel}>Add Sensor</Text>
          <View style={styles.sensorsGrid}>
            <TouchableOpacity
              style={[styles.sensorBtnModern, { backgroundColor: "#fffbe6" }]}
            >
              <Ionicons
                name="sunny"
                size={22}
                color="#f7b731"
                style={styles.sensorIconModern}
              />
              <Text style={styles.sensorLabelModern}>Light Sensor</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.sensorBtnModern, { backgroundColor: "#f5eee6" }]}
            >
              <Ionicons
                name="cube"
                size={22}
                color="#a0522d"
                style={styles.sensorIconModern}
              />
              <Text style={styles.sensorLabelModern}>Soil Sensor</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.sensorBtnModern, { backgroundColor: "#e6f7fb" }]}
            >
              <Ionicons
                name="cloud-outline"
                size={22}
                color="#45aaf2"
                style={styles.sensorIconModern}
              />
              <Text style={styles.sensorLabelModern}>CO2 Sensor</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.sensorBtnModern, { backgroundColor: "#fbeee6" }]}
            >
              <Ionicons
                name="thermometer-outline"
                size={22}
                color="#eb4d4b"
                style={styles.sensorIconModern}
              />
              <Text style={styles.sensorLabelModern}>Temperature Sensor</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.sensorBtnModern, { backgroundColor: "#e6f7fa" }]}
            >
              <Ionicons
                name="water-outline"
                size={22}
                color="#45aaf2"
                style={styles.sensorIconModern}
              />
              <Text style={styles.sensorLabelModern}>Humidity Sensor</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            style={styles.submitBtnModern}
            onPress={() => setShowAddPlant(false)}
          >
            <Text style={styles.submitBtnTextModern}>SUBMIT</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
      </View>

      <View style={styles.profileSection}>
        <Text style={styles.name}>{user?.name || "John Doe"}</Text>
        <Text style={styles.email}>
          {user?.email || "john.doe@example.com"}
        </Text>
        <Text style={styles.group}>Group {user?.groupNumber || "10"}</Text>
      </View>

      {/* Add Plant as a menu item */}
      <TouchableOpacity
        style={styles.menuItem}
        onPress={() => setShowAddPlant(true)}
      >
        <Ionicons name="add-circle-outline" size={24} color="#174d3c" />
        <Text style={styles.menuText}>Add Plant</Text>
        <Ionicons name="chevron-forward" size={24} color="#666" />
      </TouchableOpacity>

      <View style={styles.menuSection}>
        <TouchableOpacity style={styles.menuItem}>
          <Ionicons name="person-outline" size={24} color="#174d3c" />
          <Text style={styles.menuText}>Edit Profile</Text>
          <Ionicons name="chevron-forward" size={24} color="#666" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <Ionicons name="settings-outline" size={24} color="#174d3c" />
          <Text style={styles.menuText}>Settings</Text>
          <Ionicons name="chevron-forward" size={24} color="#666" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <Ionicons name="notifications-outline" size={24} color="#174d3c" />
          <Text style={styles.menuText}>Notifications</Text>
          <Ionicons name="chevron-forward" size={24} color="#666" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <Ionicons name="help-circle-outline" size={24} color="#174d3c" />
          <Text style={styles.menuText}>Help & Support</Text>
          <Ionicons name="chevron-forward" size={24} color="#666" />
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Ionicons name="log-out-outline" size={24} color="#fff" />
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f8f8",
    paddingTop: 32,
  },
  header: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#174d3c",
  },
  profileSection: {
    alignItems: "center",
    paddingVertical: 20,
    backgroundColor: "#fff",
    marginBottom: 20,
  },
  name: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  group: {
    fontSize: 14,
    color: "#174d3c",
    fontWeight: "600",
  },
  menuSection: {
    backgroundColor: "#fff",
    paddingVertical: 8,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  menuText: {
    flex: 1,
    fontSize: 16,
    color: "#333",
    marginLeft: 12,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ff4444",
    margin: 20,
    padding: 16,
    borderRadius: 12,
  },
  logoutText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 8,
  },
  subHeader: {
    fontSize: 16,
    fontWeight: "500",
    alignSelf: "flex-start",
    marginLeft: 24,
    marginBottom: 16,
  },
  addPlantCardContainer: {
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 24,
    margin: 18,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 6,
    alignItems: "center",
  },
  uploadArea: {
    borderWidth: 1.5,
    borderColor: "#e0e0e0",
    borderRadius: 16,
    width: 140,
    height: 120,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 18,
    backgroundColor: "#fafafa",
  },
  uploadText: {
    color: "#888",
    fontSize: 15,
    marginTop: 8,
    fontWeight: "500",
  },
  inputModern: {
    width: "100%",
    height: 48,
    borderRadius: 12,
    backgroundColor: "#f5f5f5",
    borderWidth: 1,
    borderColor: "#e0e0e0",
    paddingHorizontal: 16,
    fontSize: 16,
    marginBottom: 14,
  },
  addSensorLabel: {
    fontWeight: "bold",
    fontSize: 16,
    alignSelf: "flex-start",
    marginLeft: 0,
    marginTop: 8,
    marginBottom: 8,
  },
  sensorsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 18,
    gap: 10,
  },
  sensorBtnModern: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 10,
    minWidth: "47%",
    shadowColor: "#000",
    shadowOpacity: 0.03,
    shadowRadius: 2,
    elevation: 1,
  },
  sensorIconModern: {
    marginRight: 8,
  },
  sensorLabelModern: {
    fontSize: 15,
    fontWeight: "500",
    color: "#222",
  },
  submitBtnModern: {
    backgroundColor: "#174d3c",
    borderRadius: 22,
    paddingVertical: 16,
    paddingHorizontal: 40,
    marginTop: 10,
    width: "100%",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  submitBtnTextModern: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 17,
    letterSpacing: 1,
  },
});
