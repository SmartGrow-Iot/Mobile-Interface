import { Actuator } from "./Zone";

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

export type PlantDetail = {
  plantId: string;
  name: string;
  image: string;
  zone: string;
  datePlanted: string;
  optimalMoisture: string;
  optimalLight: string;
  optimalTemp: string;
  type: string;
  growthTime: string;
  notes: string;
  description: string;
  thresholds: PlantThreshold[];
  actuator: Actuator;
  readings: PlantReading[];
  // Add the missing properties that your zone screen is using
  status: PlantStatus;
  waterLevel: number;
  lightLevel: number;
};

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
