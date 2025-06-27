// components/features/thresholds/SystemThresholds.tsx - Optimized version with custom hook
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Modal,
  ScrollView,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Card } from "../../ui/Card";
import { useThresholds } from "../../../hooks/useThresholds";
import {
  ThresholdFormData,
  ThresholdConfig,
  ThresholdValidation,
} from "../../../types/Thresholds";

export function SystemThresholds() {
  const {
    thresholds,
    lastUpdated,
    loading,
    error,
    refreshThresholds,
    updateThresholds,
    updating,
  } = useThresholds();

  const [modalVisible, setModalVisible] = useState(false);

  // Form data for editing thresholds
  const [formData, setFormData] = useState<ThresholdFormData>({
    light: { min: "", max: "" },
    temperature: { min: "", max: "" },
    airQuality: { min: "", max: "" },
  });

  const openEditModal = () => {
    if (thresholds) {
      // Pre-populate form with current values
      setFormData({
        light: {
          min: thresholds.light.min.toString(),
          max: thresholds.light.max.toString(),
        },
        temperature: {
          min: thresholds.temperature.min.toString(),
          max: thresholds.temperature.max.toString(),
        },
        airQuality: {
          min: thresholds.airQuality.min.toString(),
          max: thresholds.airQuality.max.toString(),
        },
      });
      setModalVisible(true);
    }
  };

  const handleSaveThresholds = async () => {
    try {
      // Convert form data to numbers and validate
      const numericData = {
        light: {
          min: parseFloat(formData.light.min),
          max: parseFloat(formData.light.max),
        },
        temperature: {
          min: parseFloat(formData.temperature.min),
          max: parseFloat(formData.temperature.max),
        },
        airQuality: {
          min: parseFloat(formData.airQuality.min),
          max: parseFloat(formData.airQuality.max),
        },
      };

      // Validate each threshold
      const lightErrors = ThresholdValidation.validateLight(numericData.light);
      const tempErrors = ThresholdValidation.validateTemperature(
        numericData.temperature
      );
      const airErrors = ThresholdValidation.validateAirQuality(
        numericData.airQuality
      );

      const allErrors = [...lightErrors, ...tempErrors, ...airErrors];

      if (allErrors.length > 0) {
        Alert.alert("Validation Error", allErrors.join("\n"));
        return;
      }

      // Update thresholds using the hook
      const success = await updateThresholds(numericData);

      if (success) {
        Alert.alert("Success", "System thresholds updated successfully!");
        setModalVisible(false);
      }
    } catch (error) {
      console.error("Error in handleSaveThresholds:", error);
      Alert.alert("Error", "An unexpected error occurred");
    }
  };

  const updateFormData = (
    type: keyof ThresholdFormData,
    field: "min" | "max",
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      [type]: {
        ...prev[type],
        [field]: value,
      },
    }));
  };

  const formatLastUpdated = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleString();
    } catch {
      return "Unknown";
    }
  };

  // Loading state
  if (loading) {
    return (
      <Card style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#174d3c" />
          <Text style={styles.loadingText}>Loading thresholds...</Text>
        </View>
      </Card>
    );
  }

  // Error state
  if (error || !thresholds) {
    return (
      <Card style={styles.container}>
        <View style={styles.errorContainer}>
          <Ionicons name="warning-outline" size={48} color="#e74c3c" />
          <Text style={styles.errorText}>
            {error || "Failed to load thresholds"}
          </Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={refreshThresholds}
          >
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </Card>
    );
  }

  return (
    <>
      <Card style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Ionicons name="settings-outline" size={24} color="#174d3c" />
            <Text style={styles.title}>System Thresholds</Text>
          </View>
          <TouchableOpacity
            style={styles.editButton}
            onPress={openEditModal}
            disabled={updating}
          >
            {updating ? (
              <ActivityIndicator size="small" color="#174d3c" />
            ) : (
              <Ionicons name="create-outline" size={20} color="#174d3c" />
            )}
          </TouchableOpacity>
        </View>

        {/* Thresholds Display */}
        <View style={styles.thresholdsContainer}>
          {/* Light Thresholds */}
          <View style={styles.thresholdItem}>
            <View style={styles.thresholdHeader}>
              <Text style={styles.thresholdIcon}>
                {ThresholdConfig.light.icon}
              </Text>
              <Text style={styles.thresholdLabel}>
                {ThresholdConfig.light.label}
              </Text>
            </View>
            <Text style={styles.thresholdValue}>
              {thresholds.light.min} - {thresholds.light.max}
              {ThresholdConfig.light.unit}
            </Text>
          </View>

          {/* Temperature Thresholds */}
          <View style={styles.thresholdItem}>
            <View style={styles.thresholdHeader}>
              <Text style={styles.thresholdIcon}>
                {ThresholdConfig.temperature.icon}
              </Text>
              <Text style={styles.thresholdLabel}>
                {ThresholdConfig.temperature.label}
              </Text>
            </View>
            <Text style={styles.thresholdValue}>
              {thresholds.temperature.min}
              {ThresholdConfig.temperature.unit} - {thresholds.temperature.max}
              {ThresholdConfig.temperature.unit}
            </Text>
          </View>

          {/* Air Quality Thresholds */}
          <View style={styles.thresholdItem}>
            <View style={styles.thresholdHeader}>
              <Text style={styles.thresholdIcon}>
                {ThresholdConfig.airQuality.icon}
              </Text>
              <Text style={styles.thresholdLabel}>
                {ThresholdConfig.airQuality.label}
              </Text>
            </View>
            <Text style={styles.thresholdValue}>
              {thresholds.airQuality.min} - {thresholds.airQuality.max}{" "}
              {ThresholdConfig.airQuality.unit}
            </Text>
          </View>
        </View>

        {/* Last Updated */}
        <Text style={styles.lastUpdated}>
          Last updated: {formatLastUpdated(lastUpdated)}
        </Text>
      </Card>

      {/* Edit Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        presentationStyle="overFullScreen"
        onRequestClose={() => !updating && setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <KeyboardAvoidingView
            style={styles.keyboardAvoidingView}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
          >
            <View style={styles.modalContainer}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Edit Plant Thresholds</Text>
                <TouchableOpacity
                  onPress={() => setModalVisible(false)}
                  disabled={updating}
                >
                  <Ionicons name="close" size={24} color="#666" />
                </TouchableOpacity>
              </View>

              <ScrollView
                style={styles.modalContent}
                showsVerticalScrollIndicator={false}
              >
                {updating && (
                  <View style={styles.savingOverlay}>
                    <ActivityIndicator size="large" color="#174d3c" />
                    <Text style={styles.savingText}>Saving changes...</Text>
                  </View>
                )}

                {/* Light Thresholds */}
                <View style={styles.formSection}>
                  <Text style={styles.formSectionTitle}>
                    {ThresholdConfig.light.icon} {ThresholdConfig.light.label}{" "}
                    Thresholds
                  </Text>
                  <Text style={styles.formSectionDescription}>
                    {ThresholdConfig.light.description}
                  </Text>
                  <View style={styles.rangeInputContainer}>
                    <View style={styles.inputGroup}>
                      <Text style={styles.inputLabel}>Minimum</Text>
                      <TextInput
                        style={styles.input}
                        value={formData.light.min}
                        onChangeText={(value) =>
                          updateFormData("light", "min", value)
                        }
                        placeholder="0"
                        keyboardType="numeric"
                        editable={!updating}
                        selectTextOnFocus={true}
                        returnKeyType="next"
                      />
                    </View>
                    <View style={styles.inputGroup}>
                      <Text style={styles.inputLabel}>Maximum</Text>
                      <TextInput
                        style={styles.input}
                        value={formData.light.max}
                        onChangeText={(value) =>
                          updateFormData("light", "max", value)
                        }
                        placeholder="200"
                        keyboardType="numeric"
                        editable={!updating}
                        selectTextOnFocus={true}
                        returnKeyType="next"
                      />
                    </View>
                  </View>
                </View>

                {/* Temperature Thresholds */}
                <View style={styles.formSection}>
                  <Text style={styles.formSectionTitle}>
                    {ThresholdConfig.temperature.icon}{" "}
                    {ThresholdConfig.temperature.label} Thresholds (
                    {ThresholdConfig.temperature.unit})
                  </Text>
                  <Text style={styles.formSectionDescription}>
                    {ThresholdConfig.temperature.description}
                  </Text>
                  <View style={styles.rangeInputContainer}>
                    <View style={styles.inputGroup}>
                      <Text style={styles.inputLabel}>Minimum</Text>
                      <TextInput
                        style={styles.input}
                        value={formData.temperature.min}
                        onChangeText={(value) =>
                          updateFormData("temperature", "min", value)
                        }
                        placeholder="20"
                        keyboardType="numeric"
                        editable={!updating}
                        selectTextOnFocus={true}
                        returnKeyType="next"
                      />
                    </View>
                    <View style={styles.inputGroup}>
                      <Text style={styles.inputLabel}>Maximum</Text>
                      <TextInput
                        style={styles.input}
                        value={formData.temperature.max}
                        onChangeText={(value) =>
                          updateFormData("temperature", "max", value)
                        }
                        placeholder="30"
                        keyboardType="numeric"
                        editable={!updating}
                        selectTextOnFocus={true}
                        returnKeyType="next"
                      />
                    </View>
                  </View>
                </View>

                {/* Air Quality Thresholds */}
                <View style={styles.formSection}>
                  <Text style={styles.formSectionTitle}>
                    {ThresholdConfig.airQuality.icon}{" "}
                    {ThresholdConfig.airQuality.label} Thresholds (
                    {ThresholdConfig.airQuality.unit})
                  </Text>
                  <Text style={styles.formSectionDescription}>
                    {ThresholdConfig.airQuality.description}
                  </Text>
                  <View style={styles.rangeInputContainer}>
                    <View style={styles.inputGroup}>
                      <Text style={styles.inputLabel}>Minimum</Text>
                      <TextInput
                        style={styles.input}
                        value={formData.airQuality.min}
                        onChangeText={(value) =>
                          updateFormData("airQuality", "min", value)
                        }
                        placeholder="0"
                        keyboardType="numeric"
                        editable={!updating}
                        selectTextOnFocus={true}
                        returnKeyType="next"
                      />
                    </View>
                    <View style={styles.inputGroup}>
                      <Text style={styles.inputLabel}>Maximum</Text>
                      <TextInput
                        style={styles.input}
                        value={formData.airQuality.max}
                        onChangeText={(value) =>
                          updateFormData("airQuality", "max", value)
                        }
                        placeholder="100"
                        keyboardType="numeric"
                        editable={!updating}
                        selectTextOnFocus={true}
                        returnKeyType="done"
                      />
                    </View>
                  </View>
                </View>

                {/* Info Box */}
                <View style={styles.infoBox}>
                  <Ionicons
                    name="information-circle-outline"
                    size={16}
                    color="#666"
                  />
                  <Text style={styles.infoText}>
                    These thresholds apply system-wide to all monitoring and
                    automation. Changes will take effect immediately.
                  </Text>
                </View>
              </ScrollView>

              {/* Modal Actions */}
              <View style={styles.modalActions}>
                <TouchableOpacity
                  style={[styles.actionButton, styles.cancelButton]}
                  onPress={() => setModalVisible(false)}
                  disabled={updating}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.actionButton,
                    styles.saveButton,
                    updating && styles.buttonDisabled,
                  ]}
                  onPress={handleSaveThresholds}
                  disabled={updating}
                >
                  <Text style={styles.saveButtonText}>
                    {updating ? "Saving..." : "Save Changes"}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </KeyboardAvoidingView>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginBottom: 20,
  },
  loadingContainer: {
    alignItems: "center",
    paddingVertical: 40,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: "#666",
  },
  errorContainer: {
    alignItems: "center",
    paddingVertical: 40,
  },
  errorText: {
    fontSize: 16,
    color: "#e74c3c",
    marginTop: 12,
    marginBottom: 16,
    textAlign: "center",
  },
  retryButton: {
    backgroundColor: "#174d3c",
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  retryButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#174d3c",
    marginLeft: 8,
  },
  editButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: "#f0f0f0",
    minWidth: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  thresholdsContainer: {
    marginBottom: 16,
  },
  thresholdItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  thresholdHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  thresholdIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  thresholdLabel: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
  },
  thresholdValue: {
    fontSize: 14,
    color: "#666",
    fontWeight: "600",
  },
  lastUpdated: {
    fontSize: 12,
    color: "#999",
    textAlign: "center",
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  keyboardAvoidingView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  modalContainer: {
    backgroundColor: "#fff",
    borderRadius: 20,
    width: "95%",
    height: "70%",
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 10,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  savingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
  },
  savingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#666",
  },
  formSection: {
    marginBottom: 20,
  },
  formSectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  formSectionDescription: {
    fontSize: 11,
    color: "#666",
    marginBottom: 8,
    lineHeight: 14,
  },
  rangeInputContainer: {
    flexDirection: "row",
    gap: 12,
  },
  inputGroup: {
    flex: 1,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: "500",
    color: "#666",
    marginBottom: 4,
  },
  input: {
    backgroundColor: "#f8f8f8",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 15,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    textAlign: "center",
  },
  infoBox: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "#f0f8ff",
    padding: 10,
    borderRadius: 6,
    marginTop: 8,
  },
  infoText: {
    fontSize: 11,
    color: "#666",
    marginLeft: 6,
    flex: 1,
    lineHeight: 14,
  },
  modalActions: {
    flexDirection: "row",
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
    gap: 10,
  },
  actionButton: {
    flex: 1,
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "#f0f0f0",
  },
  cancelButtonText: {
    color: "#666",
    fontSize: 15,
    fontWeight: "600",
  },
  saveButton: {
    backgroundColor: "#174d3c",
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "600",
  },
  buttonDisabled: {
    opacity: 0.7,
  },
});
