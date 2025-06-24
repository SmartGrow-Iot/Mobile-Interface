// types/Notification.ts
export interface Notification {
  id: string;
  type: "environmental" | "moisture";
  severity: "critical" | "warning" | "info";
  title: string;
  message: string;
  sensor: string;
  value: number;
  threshold: { min: number; max: number };
  zone?: string;
  plantId?: string;
  plantName?: string;
  pin?: number;
  timestamp: Date;
  isRead: boolean;
}

export interface SystemThresholds {
  light: { min: number; max: number };
  temperature: { min: number; max: number };
  airQuality: { min: number; max: number };
}

export interface PlantData {
  plantId: string;
  name: string;
  zone: string;
  moisturePin: number;
  thresholds: {
    light: { min: number; max: number };
    temperature: { min: number; max: number };
    moisture: { min: number; max: number };
    airQuality: { min: number; max: number };
  };
}

export interface EnvironmentalData {
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
}

export interface NotificationStats {
  total: number;
  critical: number;
  warning: number;
  unread: number;
}

export interface SensorInfo {
  name: string;
  unit: string;
}

// Helper functions for notification types
export const NotificationHelpers = {
  getSensorInfo: (sensor: string): SensorInfo => {
    const sensorMap: Record<string, SensorInfo> = {
      light: { name: "Light", unit: "%" },
      temperature: { name: "Temperature", unit: "°C" },
      humidity: { name: "Humidity", unit: "%" },
      airQuality: { name: "Air Quality", unit: " ppm" },
      soilMoisture: { name: "Soil Moisture", unit: "%" },
      environmental: { name: "Environmental", unit: "" },
    };
    return sensorMap[sensor] || { name: sensor, unit: "" };
  },

  getZoneDisplayName: (zoneId: string): string => {
    const zoneMap: Record<string, string> = {
      zone1: "Zone 1",
      zone2: "Zone 2",
      zone3: "Zone 3",
      zone4: "Zone 4",
    };
    return zoneMap[zoneId] || zoneId;
  },

  getSeverityIcon: (severity: string): string => {
    switch (severity) {
      case "critical":
        return "alert-circle";
      case "warning":
        return "warning";
      default:
        return "information-circle";
    }
  },

  getSensorIcon: (sensor: string): string => {
    switch (sensor) {
      case "light":
        return "sunny";
      case "temperature":
        return "thermometer";
      case "humidity":
        return "water";
      case "airQuality":
        return "cloud";
      case "soilMoisture":
        return "leaf";
      case "environmental":
        return "hardware-chip";
      default:
        return "hardware-chip";
    }
  },

  removeDuplicateNotifications: (
    notifications: Notification[]
  ): Notification[] => {
    const seen = new Set<string>();
    return notifications.filter((notification) => {
      const key = `${notification.plantId}-${notification.sensor}-${notification.severity}`;
      if (seen.has(key)) {
        return false;
      }
      seen.add(key);
      return true;
    });
  },
};
