// services/plantService.js
import { apiRequest } from "./api";

export const plantService = {
  // Create a new plant
  createPlant: async (plantData) => {
    try {
      console.log("Creating plant with data:", plantData);

      // Validate required fields before sending
      if (!plantData.name || !plantData.zone || !plantData.moisturePin) {
        throw new Error("Missing required fields: name, zone, or moisturePin");
      }

      // Ensure thresholds are properly formatted
      if (
        !plantData.thresholds?.moisture?.min ||
        !plantData.thresholds?.moisture?.max
      ) {
        throw new Error("Moisture thresholds are required");
      }

      const response = await apiRequest("/plants", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(plantData),
      });

      console.log("Plant created successfully:", response);
      return response;
    } catch (error) {
      console.error("Error in plantService.createPlant:", error);
      throw error;
    }
  },

  // Get plant by ID
  getPlant: async (plantId) => {
    try {
      return await apiRequest(`/plants/${plantId}`);
    } catch (error) {
      console.error("Error fetching plant:", error);
      throw error;
    }
  },

  // Get plants by zone
  getPlantsByZone: async (zoneId) => {
    try {
      return await apiRequest(`/zones/${zoneId}/plants`);
    } catch (error) {
      console.error("Error fetching plants by zone:", error);
      throw error;
    }
  },

  // Update plant
  updatePlant: async (plantId, updateData) => {
    try {
      return await apiRequest(`/plants/${plantId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateData),
      });
    } catch (error) {
      console.error("Error updating plant:", error);
      throw error;
    }
  },

  // Delete plant
  deletePlant: async (plantId) => {
    try {
      return await apiRequest(`/plants/${plantId}`, {
        method: "DELETE",
      });
    } catch (error) {
      console.error("Error deleting plant:", error);
      throw error;
    }
  },

  // Get all plants for current user
  getUserPlants: async () => {
    try {
      return await apiRequest("/plants");
    } catch (error) {
      console.error("Error fetching user plants:", error);
      throw error;
    }
  },

  // Validate plant data before submission
  validatePlantData: (plantData) => {
    const errors = [];

    // Name validation
    if (!plantData.name || plantData.name.trim().length < 2) {
      errors.push("Plant name must be at least 2 characters long");
    }
    if (plantData.name && plantData.name.trim().length > 50) {
      errors.push("Plant name must be less than 50 characters");
    }

    // Zone validation
    if (!["zone1", "zone2", "zone3", "zone4"].includes(plantData.zone)) {
      errors.push("Invalid zone selected");
    }

    // Moisture pin validation
    if (![34, 35, 36, 39].includes(parseInt(plantData.moisturePin))) {
      errors.push("Invalid moisture pin selected");
    }

    // Description validation
    if (!plantData.description || plantData.description.trim().length < 10) {
      errors.push("Description must be at least 10 characters long");
    }
    if (plantData.description && plantData.description.trim().length > 500) {
      errors.push("Description must be less than 500 characters");
    }

    // Threshold validation
    if (plantData.thresholds?.moisture) {
      const { min, max } = plantData.thresholds.moisture;
      if (isNaN(min) || isNaN(max)) {
        errors.push("Moisture thresholds must be valid numbers");
      } else {
        if (min < 0 || max > 100) {
          errors.push("Moisture thresholds must be between 0 and 100");
        }
        if (min >= max) {
          errors.push("Minimum threshold must be less than maximum threshold");
        }
      }
    }

    // Image URL validation (optional)
    if (plantData.image && plantData.image.trim()) {
      try {
        new URL(plantData.image);
      } catch {
        errors.push("Invalid image URL format");
      }
    }

    return {
      isValid: errors.length === 0,
      errors: errors,
    };
  },

  // Format plant data for API submission
  formatPlantData: (formData) => {
    return {
      name: formData.name.trim(),
      userId: formData.userId,
      zone: formData.zone,
      moisturePin: parseInt(formData.moisturePin),
      thresholds: {
        moisture: {
          min: parseFloat(formData.moistureMinThreshold),
          max: parseFloat(formData.moistureMaxThreshold),
        },
      },
      type: "vegetable", // Default as per API
      description: formData.description.trim(),
      image:
        formData.imageUrl.trim() ||
        "https://via.placeholder.com/150/4CAF50/FFFFFF?text=Plant",
      growthTime: 30, // Default 30 days
    };
  },
};
