// services/thresholdsService.js
import { apiRequest } from "./api";

export const thresholdsService = {
  // Get system thresholds
  getSystemThresholds: async () => {
    try {
      console.log("Fetching system thresholds...");
      const response = await apiRequest("/system/thresholds");
      console.log("System thresholds fetched:", response);
      return response;
    } catch (error) {
      console.error("Error fetching system thresholds:", error);
      throw error;
    }
  },

  // Update system thresholds
  updateSystemThresholds: async (thresholdData) => {
    try {
      console.log("Updating system thresholds with data:", thresholdData);

      // Validate threshold data before sending
      const validation = thresholdsService.validateThresholds(thresholdData);
      if (!validation.isValid) {
        throw new Error(`Validation error: ${validation.errors.join(", ")}`);
      }

      const response = await apiRequest("/system/thresholds", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(thresholdData),
      });

      console.log("System thresholds updated successfully:", response);
      return response;
    } catch (error) {
      console.error("Error updating system thresholds:", error);
      throw error;
    }
  },

  // Validate threshold data
  validateThresholds: (thresholdData) => {
    const errors = [];

    // Validate light thresholds
    if (thresholdData.light) {
      const { min, max } = thresholdData.light;
      if (typeof min !== "number" || typeof max !== "number") {
        errors.push("Light thresholds must be valid numbers");
      } else if (min < 0 || max < 0) {
        errors.push("Light thresholds cannot be negative");
      } else if (min >= max) {
        errors.push("Light minimum must be less than maximum");
      }
    }

    // Validate temperature thresholds
    if (thresholdData.temperature) {
      const { min, max } = thresholdData.temperature;
      if (typeof min !== "number" || typeof max !== "number") {
        errors.push("Temperature thresholds must be valid numbers");
      } else if (min < -50 || max > 100) {
        errors.push("Temperature thresholds must be between -50°C and 100°C");
      } else if (min >= max) {
        errors.push("Temperature minimum must be less than maximum");
      }
    }

    // Validate air quality thresholds
    if (thresholdData.airQuality) {
      const { min, max } = thresholdData.airQuality;
      if (typeof min !== "number" || typeof max !== "number") {
        errors.push("Air quality thresholds must be valid numbers");
      } else if (min < 0 || max < 0) {
        errors.push("Air quality thresholds cannot be negative");
      } else if (min >= max) {
        errors.push("Air quality minimum must be less than maximum");
      }
    }

    return {
      isValid: errors.length === 0,
      errors: errors,
    };
  },

  // Format threshold data for API submission
  formatThresholdData: (formData) => {
    const thresholds = {};

    if (formData.light) {
      thresholds.light = {
        min: parseFloat(formData.light.min),
        max: parseFloat(formData.light.max),
      };
    }

    if (formData.temperature) {
      thresholds.temperature = {
        min: parseFloat(formData.temperature.min),
        max: parseFloat(formData.temperature.max),
      };
    }

    if (formData.airQuality) {
      thresholds.airQuality = {
        min: parseFloat(formData.airQuality.min),
        max: parseFloat(formData.airQuality.max),
      };
    }

    return thresholds;
  },

  // Get default threshold values
  getDefaultThresholds: () => ({
    light: { min: 0, max: 200 },
    temperature: { min: 20, max: 30 },
    airQuality: { min: 0, max: 100 },
  }),
};
