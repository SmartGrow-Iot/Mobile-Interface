// types/Zone.ts - Updated with actual API data structure
export type ZoneStatus = "optimal" | "warning" | "critical";

export type ActuatorType = "watering" | "light" | "fan";

// API Plant structure from zone plants endpoint
export interface ZonePlant {
  plantId: string;
  name: string;
  description: string;
  type: "vegetable";
  growthTime: number;
  zone: string;
  moisturePin: number;
  image: string;
  userId: string;
  status: ZoneStatus;
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

// API Zone structure from zone info endpoint
export interface ZoneInfo {
  zone: string;
  sensors: {
    lightSensor: string;
    tempSensor: string;
    humiditySensor: string;
    gasSensor: string;
    moistureSensor: {
      [pin: string]: string;
    };
  };
  actuators: {
    fanActuator: string;
    lightActuator: string;
    waterActuator: string;
  };
  availablePins: number[];
  plantIds: string[];
}

// Simplified Zone for UI display
export interface Zone {
  id: string; // zone1, zone2, zone3, zone4
  name: string; // Zone 1, Zone 2, etc.
  status: ZoneStatus;
  plantCount: number;
  plants: ZonePlant[];
  zoneInfo?: ZoneInfo;
}

// Helper functions for zone data
export const ZoneHelpers = {
  getZoneDisplayName: (zoneId: string): string => {
    const zoneMap: Record<string, string> = {
      zone1: "Zone 1",
      zone2: "Zone 2",
      zone3: "Zone 3",
      zone4: "Zone 4",
    };
    return zoneMap[zoneId] || zoneId;
  },

  getZoneStatus: (plants: ZonePlant[]): ZoneStatus => {
    if (plants.length === 0) return "optimal";

    const criticalCount = plants.filter((p) => p.status === "critical").length;
    const warningCount = plants.filter((p) => p.status === "warning").length;

    if (criticalCount > 0) return "critical";
    if (warningCount > plants.length / 2) return "warning";
    return "optimal";
  },

  getPlantTypeIcon: (plants: ZonePlant[]): string => {
    // Since all plants from API are type "vegetable", we'll use a default plant icon
    return "🌱";
  },
};

export const AVAILABLE_ZONES = ["zone1", "zone2", "zone3", "zone4"] as const;
export type ZoneId = (typeof AVAILABLE_ZONES)[number];
