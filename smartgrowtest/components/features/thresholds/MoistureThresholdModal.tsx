// components/features/plants/MoistureThresholdModal.tsx
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
  moistureThresholdService,
  MoistureThresholdRange,
} from "../../../services/moistureThresholdService";

interface MoistureThresholdModalProps {
  visible: boolean;
  onClose: () => void;
  plantId: string;
  plantName: string;
  plantIcon: string;
  zone: string;
  moisturePin: number;
  currentThresholds: MoistureThresholdRange;
  onThresholdsUpdated: (newThresholds: MoistureThresholdRange) => void;
}

export function MoistureThresholdModal({
  visible,
  onClose,
  plantId,
  plantName,
  plantIcon,
  zone,
  moisturePin,
  currentThresholds,
  onThresholdsUpdated,
}: MoistureThresholdModalProps) {
  const [formData, setFormData] = useState({
    min: "",
    max: "",
  });
  const [updating, setUpdating] = useState(false);
  const [recommendation, setRecommendation] = useState<string | null>(null);

  // Initialize form data when modal opens
  useEffect(() => {
    if (visible && currentThresholds) {
      setFormData({
        min: currentThresholds.min.toString(),
        max: currentThresholds.max.toString(),
      });
    }
  }, [visible, currentThresholds]);

  // Update recommendation when form data changes
  useEffect(() => {
    const minValue = parseFloat(formData.min);
    const maxValue = parseFloat(formData.max);

    if (!isNaN(minValue) && !isNaN(maxValue)) {
      const rec = moistureThresholdService.getThresholdRecommendation({
        min: minValue,
        max: maxValue,
      });
      setRecommendation(rec);
    } else {
      setRecommendation(null);
    }
  }, [formData]);

  const handleUpdateThresholds = async () => {
    try {
      // Validate form input
      const validation = moistureThresholdService.validateFormInput(
        formData.min,
        formData.max
      );

      if (!validation.isValid) {
        Alert.alert("Validation Error", validation.errors.join("\n"));
        return;
      }

      setUpdating(true);

      // Format and send data
      const updateData = moistureThresholdService.formatMoistureThresholdData(
        formData.min,
        formData.max
      );

      await moistureThresholdService.updatePlantMoistureThresholds(
        plantId,
        updateData
      );

      // Update parent component with new thresholds
      const newThresholds = {
        min: parseFloat(formData.min),
        max: parseFloat(formData.max),
      };
      onThresholdsUpdated(newThresholds);

      Alert.alert("Success", "Moisture thresholds updated successfully!", [
        {
          text: "OK",
          onPress: onClose,
        },
      ]);
    } catch (error) {
      console.error("Error updating moisture thresholds:", error);
      Alert.alert(
        "Error",
        error instanceof Error
          ? error.message
          : "Failed to update moisture thresholds"
      );
    } finally {
      setUpdating(false);
    }
  };

  const handleClose = () => {
    if (!updating) {
      onClose();
      // Reset form data
      setFormData({ min: "", max: "" });
      setRecommendation(null);
    }
  };

  const getZoneDisplayName = (zoneId: string): string => {
    const zoneMap: Record<string, string> = {
      zone1: "Zone 1",
      zone2: "Zone 2",
      zone3: "Zone 3",
      zone4: "Zone 4",
    };
    return zoneMap[zoneId] || zoneId;
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      presentationStyle="overFullScreen"
      onRequestClose={handleClose}
    >
      <View style={styles.modalOverlay}>
        <KeyboardAvoidingView
          style={styles.keyboardAvoidingView}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <View style={styles.modalContainer}>
            {/* Header */}
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Moisture Thresholds</Text>
              <TouchableOpacity onPress={handleClose} disabled={updating}>
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>

            <ScrollView
              style={styles.modalContent}
              showsVerticalScrollIndicator={false}
            >
              {/* Loading Overlay */}
              {updating && (
                <View style={styles.savingOverlay}>
                  <ActivityIndicator size="large" color="#3498db" />
                  <Text style={styles.savingText}>Updating thresholds...</Text>
                </View>
              )}

              {/* Plant Info Section */}
              <View style={styles.plantInfoSection}>
                <Text style={styles.plantInfoTitle}>
                  {plantIcon} {plantName}
                </Text>
                <Text style={styles.plantInfoSubtitle}>
                  {getZoneDisplayName(zone)} • Pin {moisturePin}
                </Text>
              </View>

              {/* Current Values Display */}
              <View style={styles.currentValuesSection}>
                <Text style={styles.currentValuesTitle}>
                  Current Thresholds
                </Text>
                <View style={styles.currentValuesContainer}>
                  <View style={styles.currentValueItem}>
                    <Text style={styles.currentValueLabel}>Minimum</Text>
                    <Text style={styles.currentValueText}>
                      {currentThresholds.min}%
                    </Text>
                  </View>
                  <View style={styles.currentValueItem}>
                    <Text style={styles.currentValueLabel}>Maximum</Text>
                    <Text style={styles.currentValueText}>
                      {currentThresholds.max}%
                    </Text>
                  </View>
                </View>
              </View>

              {/* Form Section */}
              <View style={styles.formSection}>
                <Text style={styles.formSectionTitle}>
                  💧 Update Moisture Thresholds
                </Text>
                <Text style={styles.formSectionDescription}>
                  Set the optimal moisture range for automatic watering. Values
                  should be between 0% and 100%.
                </Text>

                <View style={styles.rangeInputContainer}>
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Minimum (%)</Text>
                    <TextInput
                      style={styles.input}
                      value={formData.min}
                      onChangeText={(value) =>
                        setFormData((prev) => ({ ...prev, min: value }))
                      }
                      placeholder="30"
                      keyboardType="numeric"
                      editable={!updating}
                      selectTextOnFocus={true}
                      returnKeyType="next"
                    />
                  </View>
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Maximum (%)</Text>
                    <TextInput
                      style={styles.input}
                      value={formData.max}
                      onChangeText={(value) =>
                        setFormData((prev) => ({ ...prev, max: value }))
                      }
                      placeholder="70"
                      keyboardType="numeric"
                      editable={!updating}
                      selectTextOnFocus={true}
                      returnKeyType="done"
                    />
                  </View>
                </View>
              </View>

              {/* Recommendation */}
              {recommendation && (
                <View style={styles.recommendationBox}>
                  <Ionicons
                    name={
                      recommendation.startsWith("Warning")
                        ? "warning-outline"
                        : "information-circle-outline"
                    }
                    size={16}
                    color={
                      recommendation.startsWith("Warning")
                        ? "#f39c12"
                        : "#3498db"
                    }
                  />
                  <Text
                    style={[
                      styles.recommendationText,
                      recommendation.startsWith("Warning") &&
                        styles.warningText,
                    ]}
                  >
                    {recommendation}
                  </Text>
                </View>
              )}

              {/* Info Box */}
              <View style={styles.infoBox}>
                <Ionicons
                  name="information-circle-outline"
                  size={16}
                  color="#666"
                />
                <Text style={styles.infoText}>
                  When soil moisture drops below the minimum threshold,
                  automatic watering will be triggered. When it reaches the
                  maximum threshold, watering will stop.
                </Text>
              </View>
            </ScrollView>

            {/* Modal Actions */}
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.actionButton, styles.cancelButton]}
                onPress={handleClose}
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
                onPress={handleUpdateThresholds}
                disabled={updating}
              >
                <Text style={styles.saveButtonText}>
                  {updating ? "Updating..." : "Update Thresholds"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
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
    borderRadius: 20,
  },
  savingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#666",
  },
  plantInfoSection: {
    alignItems: "center",
    marginBottom: 20,
    padding: 16,
    backgroundColor: "#f8f9fa",
    borderRadius: 12,
  },
  plantInfoTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  plantInfoSubtitle: {
    fontSize: 14,
    color: "#666",
  },
  currentValuesSection: {
    marginBottom: 20,
  },
  currentValuesTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 12,
  },
  currentValuesContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#e3f2fd",
    borderRadius: 12,
    padding: 16,
  },
  currentValueItem: {
    alignItems: "center",
  },
  currentValueLabel: {
    fontSize: 12,
    color: "#666",
    marginBottom: 4,
  },
  currentValueText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1976d2",
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
    fontSize: 12,
    color: "#666",
    marginBottom: 12,
    lineHeight: 16,
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
  recommendationBox: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "#fff3cd",
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: "#f39c12",
  },
  recommendationText: {
    fontSize: 12,
    color: "#856404",
    marginLeft: 8,
    flex: 1,
    lineHeight: 16,
  },
  warningText: {
    color: "#721c24",
  },
  infoBox: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "#f0f8ff",
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  infoText: {
    fontSize: 12,
    color: "#666",
    marginLeft: 8,
    flex: 1,
    lineHeight: 16,
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
    backgroundColor: "#3498db",
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
