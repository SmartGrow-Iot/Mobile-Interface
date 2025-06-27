// services/moistureThresholdService.ts
import { apiRequest } from "./api";

export interface MoistureThresholdRange {
  min: number;
  max: number;
}

export interface MoistureThresholdUpdate {
  moisture: MoistureThresholdRange;
}

export interface MoistureThresholdValidation {
  isValid: boolean;
  errors: string[];
}

export const moistureThresholdService = {
  // Update plant moisture thresholds
  updatePlantMoistureThresholds: async (
    plantId: string,
    thresholdData: MoistureThresholdUpdate
  ) => {
    try {
      console.log("Updating moisture thresholds for plant:", plantId);
      console.log("Threshold data:", thresholdData);

      // Validate threshold data before sending
      const validation = moistureThresholdService.validateMoistureThresholds(
        thresholdData.moisture
      );
      if (!validation.isValid) {
        throw new Error(`Validation error: ${validation.errors.join(", ")}`);
      }

      const response = await apiRequest(`/plants/${plantId}/thresholds`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(thresholdData),
      });

      console.log("Moisture thresholds updated successfully:", response);
      return response;
    } catch (error) {
      console.error("Error updating moisture thresholds:", error);
      throw error;
    }
  },

  // Validate moisture threshold data
  validateMoistureThresholds: (
    range: MoistureThresholdRange
  ): MoistureThresholdValidation => {
    const errors: string[] = [];

    // Check if values are valid numbers
    if (typeof range.min !== "number" || typeof range.max !== "number") {
      errors.push("Both minimum and maximum values must be valid numbers");
    } else {
      // Check range constraints
      if (range.min < 0 || range.max > 100) {
        errors.push("Moisture values must be between 0% and 100%");
      }

      // Check logical relationship
      if (range.min >= range.max) {
        errors.push("Minimum value must be less than maximum value");
      }

      // Check reasonable ranges
      if (range.max - range.min < 5) {
        errors.push("The difference between min and max should be at least 5%");
      }
    }

    return {
      isValid: errors.length === 0,
      errors: errors,
    };
  },

  // Validate form input strings before conversion
  validateFormInput: (
    minStr: string,
    maxStr: string
  ): MoistureThresholdValidation => {
    const errors: string[] = [];

    // Check if inputs are not empty
    if (!minStr.trim() || !maxStr.trim()) {
      errors.push("Please enter both minimum and maximum values");
      return { isValid: false, errors };
    }

    // Try to parse numbers
    const minValue = parseFloat(minStr);
    const maxValue = parseFloat(maxStr);

    if (isNaN(minValue) || isNaN(maxValue)) {
      errors.push(
        "Please enter valid numbers for both minimum and maximum values"
      );
      return { isValid: false, errors };
    }

    // Use the main validation function
    return moistureThresholdService.validateMoistureThresholds({
      min: minValue,
      max: maxValue,
    });
  },

  // Format form data for API submission
  formatMoistureThresholdData: (
    minStr: string,
    maxStr: string
  ): MoistureThresholdUpdate => {
    return {
      moisture: {
        min: parseFloat(minStr),
        max: parseFloat(maxStr),
      },
    };
  },

  // Get default moisture threshold values
  getDefaultMoistureThresholds: (): MoistureThresholdRange => ({
    min: 30,
    max: 70,
  }),

  // Check if threshold values are within recommended ranges
  getThresholdRecommendation: (
    range: MoistureThresholdRange
  ): string | null => {
    if (range.min < 20) {
      return "Warning: Minimum threshold below 20% may cause plant stress";
    }
    if (range.max > 80) {
      return "Warning: Maximum threshold above 80% may cause root rot";
    }
    if (range.max - range.min > 50) {
      return "Info: Large threshold range may reduce watering efficiency";
    }
    return null;
  },
};
