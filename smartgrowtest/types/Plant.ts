// types/Plant.ts - Updated for API structure
export type PlantStatus = "optimal" | "warning" | "critical";

export type PlantThreshold = {
  label: string;
  value: string;
  color: string;
  bg: string;
  icon: string;
};

export type PlantReading = {
  label: string;
  value: string;
};

// API Plant structure (matching the API response)
export interface PlantDetail {
  plantId: string;
  name: string;
  description: string;
  type: "vegetable";
  growthTime: number;
  zone: string;
  moisturePin: number;
  image: string;
  userId: string;
  status: PlantStatus;
  thresholds: {
    light: { min: number; max: number };
    temperature: { min: number; max: number };
    moisture: { min: number; max: number };
    airQuality: { min: number; max: number };
  };
  zoneHardware: {
    actuators: {
      fanActuator: string;
      waterActuator: string;
      lightActuator: string;
    };
    sensors: {
      light: string;
      humidity: string;
      temperature: string;
      moisture: string;
      airQuality: string;
    };
  };
  createdAt: string;
  updatedAt: string;
}

// For UI display (simplified from API data)
export interface PlantInfo {
  datePlanted: string;
  optimalMoisture: string;
  optimalLight: string;
  optimalTemp: string;
  type: string;
  growthTime: string;
  notes: string;
}

// API Request/Response types for plant creation
export interface PlantCreationRequest {
  name: string;
  userId: string;
  zone: "zone1" | "zone2" | "zone3" | "zone4";
  moisturePin: 34 | 35 | 36 | 39;
  thresholds: {
    moisture: {
      min: number;
      max: number;
    };
  };
  type: "vegetable"; // Default value as per API
  description: string;
  image: string;
  growthTime: number; // Default 30 days
}

export interface PlantCreationResponse {
  plantId: string;
  message: string;
  success: boolean;
}

// Helper functions for plant data
export const PlantHelpers = {
  // Convert API plant data to UI format
  getPlantInfo: (plant: PlantDetail): PlantInfo => ({
    datePlanted: new Date(plant.createdAt).toLocaleDateString("en-GB"),
    optimalMoisture: `${plant.thresholds.moisture.min} - ${plant.thresholds.moisture.max}%`,
    optimalLight: `${plant.thresholds.light.min} - ${plant.thresholds.light.max}%`,
    optimalTemp: `${plant.thresholds.temperature.min} - ${plant.thresholds.temperature.max}°C`,
    type: plant.type,
    growthTime: `${plant.growthTime} days`,
    notes: plant.description || "No additional notes",
  }),

  // Get zone display name
  getZoneDisplayName: (zone: string): string => {
    const zoneMap: Record<string, string> = {
      zone1: "Zone 1",
      zone2: "Zone 2",
      zone3: "Zone 3",
      zone4: "Zone 4",
    };
    return zoneMap[zone] || zone;
  },

  // Get plant icon based on zone (since API doesn't specify plant species)
  getPlantIcon: (zone: string): string => {
    // You can customize this based on your preference
    switch (zone) {
      case "zone1":
      case "zone2":
        return "🌶️"; // Chili zones
      case "zone3":
      case "zone4":
        return "🍆"; // Eggplant zones
      default:
        return "🌱"; // Default plant
    }
  },

  // Generate thresholds for display
  getPlantThresholds: (plant: PlantDetail): PlantThreshold[] => [
    {
      label: "Moisture Level is",
      value:
        plant.status === "optimal"
          ? "Optimal"
          : plant.status === "warning"
          ? "Warning"
          : "Critical",
      color:
        plant.status === "optimal"
          ? "#27ae60"
          : plant.status === "warning"
          ? "#f39c12"
          : "#e74c3c",
      bg:
        plant.status === "optimal"
          ? "#e8f5e8"
          : plant.status === "warning"
          ? "#fdf6e3"
          : "#fdf2f2",
      icon: "💧",
    },
    {
      label: "Temperature is",
      value: "Optimal", // Could be enhanced with actual sensor data
      color: "#27ae60",
      bg: "#e8f5e8",
      icon: "🌡️",
    },
  ],
};

// Validation helpers for plant creation
export const PlantValidation = {
  validateMoistureThresholds: (min: number, max: number): boolean => {
    return min >= 0 && max <= 100 && min < max;
  },

  validateMoisturePin: (pin: number): boolean => {
    return [34, 35, 36, 39].includes(pin);
  },

  validateZone: (zone: string): boolean => {
    return ["zone1", "zone2", "zone3", "zone4"].includes(zone);
  },

  validatePlantName: (name: string): boolean => {
    return name.trim().length >= 2 && name.trim().length <= 50;
  },

  validateDescription: (description: string): boolean => {
    return description.trim().length >= 10 && description.trim().length <= 500;
  },

  validateImageUrl: (url: string): boolean => {
    if (!url.trim()) return true; // Optional field
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  },
};

// Default values for plant creation
export const PlantDefaults = {
  GROWTH_TIME: 30,
  TYPE: "vegetable" as const,
  DEFAULT_IMAGE: "https://via.placeholder.com/150/4CAF50/FFFFFF?text=Plant",
  MOISTURE_THRESHOLDS: {
    MIN: 30,
    MAX: 70,
  },
  AVAILABLE_PINS: [34, 35, 36, 39] as const,
  AVAILABLE_ZONES: ["zone1", "zone2", "zone3", "zone4"] as const,
} as const;
