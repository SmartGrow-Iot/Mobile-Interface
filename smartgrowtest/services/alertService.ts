// services/alertService.ts - Fixed with graceful 404 handling
import { apiRequest } from "./api";
import { Alert } from "../types/Alert";

export interface ActuatorResponse {
  actuatorId: string;
  actuatorModel: string;
  description: string;
  type: "watering" | "light" | "fan";
  zone: string;
  createdAt: string;
}

export interface ZoneActuatorsResponse {
  count: number;
  actuators: ActuatorResponse[];
}

export interface SensorLogResponse {
  logId: string;
  sensorId: string;
  plantId: string;
  value: number;
  timestamp: string;
}

class AlertService {
  private alerts: Alert[] = [];
  private listeners: ((alerts: Alert[]) => void)[] = [];
  private isDataAvailable = false; // Track if API is ready

  // Subscribe to alert updates
  subscribe(callback: (alerts: Alert[]) => void) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(
        (listener) => listener !== callback
      );
    };
  }

  // Notify all listeners
  private notify() {
    this.listeners.forEach((listener) => listener(this.alerts));
  }

  // Get all alerts
  getAlerts(): Alert[] {
    return this.alerts.sort(
      (a, b) => b.timestamp!.getTime() - a.timestamp!.getTime()
    );
  }

  // Clear all alerts
  clearAlerts() {
    this.alerts = [];
    this.notify();
  }

  // Dismiss specific alert
  dismissAlert(alertId: string) {
    this.alerts = this.alerts.filter((alert) => alert.id !== alertId);
    this.notify();
  }

  // Add new alert
  private addAlert(alertData: Omit<Alert, "id" | "timestamp">) {
    const alert: Alert = {
      ...alertData,
      id: `alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
    };

    this.alerts.unshift(alert);

    // Keep only last 50 alerts
    if (this.alerts.length > 50) {
      this.alerts = this.alerts.slice(0, 50);
    }

    this.notify();
    return alert;
  }

  // Safe API request wrapper that handles 404s gracefully
  private async safeApiRequest<T>(endpoint: string): Promise<T | null> {
    try {
      const result = await apiRequest(endpoint);
      this.isDataAvailable = true; // Mark that API is working
      return result;
    } catch (error: any) {
      // Handle 404s silently - this means data isn't uploaded yet
      if (error.message?.includes("404") || error.status === 404) {
        console.log(`📡 API endpoint not ready: ${endpoint}`);
        return null;
      }

      // Handle other HTTP errors silently in development
      if (__DEV__ && (error.message?.includes("HTTP error") || error.status)) {
        console.log(
          `📡 API not ready for ${endpoint}:`,
          error.status || error.message
        );
        return null;
      }

      // Only log unexpected errors
      console.error(`API Error for ${endpoint}:`, error);
      return null;
    }
  }

  // Fetch actuator data and generate alerts - with graceful fallback
  async fetchActuatorAlerts() {
    const zones = ["zone1", "zone2", "zone3", "zone4"];
    const actuatorTypes = ["watering", "light", "fan"];

    try {
      console.log("🔍 Checking actuator data...");
      let hasAnyData = false;

      for (const zone of zones) {
        for (const type of actuatorTypes) {
          const response = await this.safeApiRequest<ZoneActuatorsResponse>(
            `/actuators/zone/${zone}?type=${type}`
          );

          if (response === null) {
            // API returned 404 or error - skip this zone/type
            continue;
          }

          hasAnyData = true;
          console.log(`✅ Zone ${zone} ${type} actuators:`, response.count);

          // Check for missing actuators (critical alert)
          if (response.count === 0) {
            this.addAlert({
              text: `No ${type} actuators found in ${this.formatZoneName(
                zone
              )}!`,
              color: "#FF5252",
              icon: this.getActuatorIcon(type),
              type: this.mapActuatorTypeToAlertType(type),
              severity: "critical",
              zoneId: zone,
            });
          }

          // Check for insufficient actuators (warning)
          else if (
            response.count < 2 &&
            (type === "watering" || type === "light")
          ) {
            this.addAlert({
              text: `Only ${
                response.count
              } ${type} actuator(s) in ${this.formatZoneName(zone)}`,
              color: "#FF9800",
              icon: this.getActuatorIcon(type),
              type: this.mapActuatorTypeToAlertType(type),
              severity: "medium",
              zoneId: zone,
            });
          }

          // Check for old actuators (maintenance alert)
          const oldActuators = response.actuators.filter((actuator) => {
            const createdDate = new Date(actuator.createdAt);
            const monthsAgo = new Date(
              Date.now() - 6 * 30 * 24 * 60 * 60 * 1000
            );
            return createdDate < monthsAgo;
          });

          if (oldActuators.length > 0) {
            this.addAlert({
              text: `${
                oldActuators.length
              } ${type} actuator(s) in ${this.formatZoneName(
                zone
              )} need maintenance`,
              color: "#2196F3",
              icon: this.getActuatorIcon(type),
              type: this.mapActuatorTypeToAlertType(type),
              severity: "low",
              zoneId: zone,
            });
          }
        }
      }

      // Only show "no data" alert if we're in development and want to see it
      if (!hasAnyData && __DEV__) {
        console.log(
          "📡 No actuator data available yet - API endpoints not ready"
        );
      }
    } catch (error) {
      console.error("Unexpected error in actuator alerts:", error);
      // Only add error alert for truly unexpected errors
      if (!__DEV__) {
        this.addAlert({
          text: "Actuator system temporarily unavailable",
          color: "#FF9800",
          icon: "general",
          type: "general",
          severity: "low",
        });
      }
    }
  }

  // Fetch sensor data and generate threshold alerts - with graceful fallback
  async fetchSensorAlerts() {
    const zones = ["zone1", "zone2", "zone3", "zone4"];

    try {
      console.log("🔍 Checking sensor data...");
      let hasAnyData = false;

      for (const zone of zones) {
        // Get recent sensor logs for this zone
        const endDate = new Date().toISOString();
        const startDate = new Date(
          Date.now() - 2 * 60 * 60 * 1000
        ).toISOString(); // Last 2 hours

        const sensorLogs = await this.safeApiRequest<SensorLogResponse[]>(
          `/logs/sensor-data?zoneId=${zone}&startDate=${startDate}&endDate=${endDate}&limit=100`
        );

        if (sensorLogs === null) {
          // API returned 404 or error - skip this zone
          continue;
        }

        hasAnyData = true;
        console.log(`✅ Zone ${zone} sensor logs:`, sensorLogs.length);

        // Process sensor logs to find threshold violations
        this.processSensorLogs(sensorLogs, zone);
      }

      // Only show "no data" message in development
      if (!hasAnyData && __DEV__) {
        console.log(
          "📡 No sensor data available yet - API endpoints not ready"
        );
      }
    } catch (error) {
      console.error("Unexpected error in sensor alerts:", error);
      // Only add error alert for truly unexpected errors
      if (!__DEV__) {
        this.addAlert({
          text: "Sensor system temporarily unavailable",
          color: "#FF9800",
          icon: "general",
          type: "general",
          severity: "low",
        });
      }
    }
  }

  // Process sensor logs and create alerts for threshold violations
  private processSensorLogs(logs: SensorLogResponse[], zone: string) {
    // Define thresholds for different sensor types
    const thresholds = {
      temperature: { min: 18, max: 32, critical: 35 },
      humidity: { min: 40, max: 80, critical: 90 },
      light: { min: 30, max: 90, critical: 10 },
      soilMoisture: { min: 30, max: 80, critical: 20 },
    };

    // Group logs by sensor type (you might need to fetch sensor info to determine type)
    const recentLogs = logs.filter((log) => {
      const logTime = new Date(log.timestamp);
      const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000);
      return logTime > thirtyMinutesAgo;
    });

    // For demonstration, create some threshold alerts based on values
    recentLogs.forEach((log) => {
      const value = log.value;

      // Example: Check if value seems like temperature (15-40 range)
      if (value >= 15 && value <= 40) {
        if (value > thresholds.temperature.critical) {
          this.addAlert({
            text: `Critical temperature ${value}°C in ${this.formatZoneName(
              zone
            )}!`,
            color: "#FF5252",
            icon: "temperature",
            type: "temperature",
            severity: "critical",
            zoneId: zone,
            plantId: log.plantId,
          });
        } else if (value > thresholds.temperature.max) {
          this.addAlert({
            text: `High temperature ${value}°C in ${this.formatZoneName(zone)}`,
            color: "#FF9800",
            icon: "temperature",
            type: "temperature",
            severity: "medium",
            zoneId: zone,
            plantId: log.plantId,
          });
        }
      }

      // Example: Check if value seems like humidity/moisture percentage (0-100 range)
      if (value >= 0 && value <= 100) {
        if (value < thresholds.soilMoisture.critical) {
          this.addAlert({
            text: `Critical low moisture ${value}% in ${this.formatZoneName(
              zone
            )}!`,
            color: "#FF5252",
            icon: "water",
            type: "water",
            severity: "critical",
            zoneId: zone,
            plantId: log.plantId,
          });
        } else if (value < thresholds.soilMoisture.min) {
          this.addAlert({
            text: `Low moisture level ${value}% in ${this.formatZoneName(
              zone
            )}`,
            color: "#FF9800",
            icon: "water",
            type: "water",
            severity: "medium",
            zoneId: zone,
            plantId: log.plantId,
          });
        }
      }
    });
  }

  // Helper methods
  private formatZoneName(zoneId: string): string {
    const zoneMap: Record<string, string> = {
      zone1: "Zone 1",
      zone2: "Zone 2",
      zone3: "Zone 3",
      zone4: "Zone 4",
    };
    return zoneMap[zoneId] || zoneId;
  }

  private getActuatorIcon(type: string): string {
    switch (type) {
      case "watering":
        return "water";
      case "light":
        return "light";
      case "fan":
        return "general";
      default:
        return "general";
    }
  }

  private mapActuatorTypeToAlertType(type: string): Alert["type"] {
    switch (type) {
      case "watering":
        return "water";
      case "light":
        return "light";
      case "fan":
        return "general";
      default:
        return "general";
    }
  }

  // Initialize and fetch all alerts - with graceful handling
  async initialize() {
    try {
      console.log("🚀 Initializing alert service...");

      // Clear existing alerts
      this.clearAlerts();

      // Test connectivity first
      const isConnected = await this.testConnectivity();

      if (!isConnected && __DEV__) {
        console.log(
          "📡 API not ready yet - will retry when data becomes available"
        );
        // Add a friendly development-only message
        this.addAlert({
          text: "🔧 Development mode: API endpoints not ready yet",
          color: "#2196F3",
          icon: "general",
          type: "general",
          severity: "low",
        });
        return;
      }

      // Fetch data from APIs (will handle 404s gracefully)
      await Promise.all([this.fetchActuatorAlerts(), this.fetchSensorAlerts()]);

      console.log(
        `✅ Alert service initialized with ${this.alerts.length} alerts`
      );
    } catch (error) {
      console.error("Error initializing alert service:", error);

      // Only show error in production
      if (!__DEV__) {
        this.addAlert({
          text: "Monitoring system temporarily unavailable",
          color: "#FF9800",
          icon: "general",
          type: "general",
          severity: "low",
        });
      }
    }
  }

  // Refresh alerts
  async refresh() {
    await this.initialize();
  }

  // Test API connectivity - returns true if API is ready
  async testConnectivity() {
    try {
      const testZone = "zone1";
      const testResponse = await this.safeApiRequest<ZoneActuatorsResponse>(
        `/actuators/zone/${testZone}?type=watering`
      );

      if (testResponse !== null) {
        console.log("✅ API connectivity test passed");
        return true;
      } else {
        console.log("📡 API not ready yet");
        return false;
      }
    } catch (error) {
      console.log("📡 API connectivity test: not ready");
      return false;
    }
  }

  // Add method to simulate some alerts for development
  generateMockAlerts() {
    if (__DEV__) {
      this.addAlert({
        text: "🌱 Welcome to your plant monitoring system!",
        color: "#4CAF50",
        icon: "general",
        type: "general",
        severity: "low",
      });

      this.addAlert({
        text: "💡 Tip: Add sensors and actuators to start monitoring",
        color: "#2196F3",
        icon: "light",
        type: "general",
        severity: "low",
      });
    }
  }
}

export const alertService = new AlertService();

// For debugging
if (__DEV__) {
  (global as any).alertService = alertService;
}
