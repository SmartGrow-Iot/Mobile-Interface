// types/Sensor.ts
export interface EnvironmentalDataResponse {
  recordId: string;
  zoneId: string;
  timestamp: string;
  zoneSensors: {
    humidity: number;
    temp: number;
    light: number;
    airQuality: number;
  };
  soilMoistureByPin: Array<{
    pin: number;
    soilMoisture: number;
  }>;
  userId: string;
}

export interface PlantData {
  plantId: string;
  name: string;
  zone: string;
  moisturePin: number;
  description: string;
  type: string;
  image: string;
  status: string;
  thresholds: {
    moisture: { min: number; max: number };
  };
  createdAt: string;
}

export interface SoilMoistureData {
  plantId: string;
  plantName: string;
  zone: string;
  pin: number;
  moisture: number;
  critical: boolean;
  timestamp: Date;
  icon: string;
  thresholds: { min: number; max: number };
}

export interface SensorConfig {
  name: string;
  icon: string;
  description: string;
  unit: string;
  thresholds: { min: number; max: number; critical: number };
}

export type SensorType =
  | "temperature"
  | "humidity"
  | "light"
  | "airquality"
  | "soil";

export const sensorConfigs: Record<SensorType, SensorConfig> = {
  temperature: {
    name: "Temperature Sensor",
    icon: "🌡️",
    description: "Monitor ambient temperature for optimal plant growth",
    unit: "°C",
    thresholds: { min: 18, max: 32, critical: 35 },
  },
  humidity: {
    name: "Humidity Sensor",
    icon: "💧",
    description: "Track relative humidity levels in growing environment",
    unit: "%",
    thresholds: { min: 40, max: 80, critical: 20 },
  },
  light: {
    name: "Light Sensor",
    icon: "☀️",
    description: "Monitor light intensity for photosynthesis optimization",
    unit: "%",
    thresholds: { min: 30, max: 90, critical: 20 },
  },
  airquality: {
    name: "Air Quality Sensor",
    icon: "🌬️",
    description: "Monitor air quality and environmental conditions",
    unit: "ppm",
    thresholds: { min: 300, max: 600, critical: 1000 },
  },
  soil: {
    name: "Soil Moisture Sensor",
    icon: "🟫",
    description: "Monitor soil moisture levels for optimal plant hydration",
    unit: "%",
    thresholds: { min: 30, max: 70, critical: 20 },
  },
};
