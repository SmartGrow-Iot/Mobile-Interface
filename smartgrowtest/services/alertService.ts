// services/alertService.ts - Complete implementation with force refresh
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
  private isDataAvailable = false;

  // Caching properties
  private lastFetchTime: number = 0;
  private cacheTimeout: number = 5 * 60 * 1000; // 5 minutes cache
  private isCurrentlyFetching: boolean = false;
  private initializationPromise: Promise<void> | null = null;
  private isInitialized: boolean = false;

  // Subscribe to alert updates
  subscribe(callback: (alerts: Alert[]) => void) {
    this.listeners.push(callback);

    // Immediately call with current data if available
    if (this.alerts.length > 0) {
      callback(this.alerts);
    }

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

  // Check if cache is still valid
  private isCacheValid(): boolean {
    const now = Date.now();
    return now - this.lastFetchTime < this.cacheTimeout && this.isInitialized;
  }

  // ✨ NEW: Force clear cache method
  forceClearCache() {
    console.log("🗑️ Forcing cache clear for alerts");
    this.lastFetchTime = 0;
    this.isInitialized = false;
    this.initializationPromise = null;
  }

  // Get all alerts (with caching)
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
      this.isDataAvailable = true;
      return result;
    } catch (error: any) {
      if (error.message?.includes("404") || error.status === 404) {
        console.log(`📡 API endpoint not ready: ${endpoint}`);
        return null;
      }

      if (__DEV__ && (error.message?.includes("HTTP error") || error.status)) {
        console.log(
          `📡 API not ready for ${endpoint}:`,
          error.status || error.message
        );
        return null;
      }

      console.error(`API Error for ${endpoint}:`, error);
      return null;
    }
  }

  // Fetch actuator data and generate alerts
  private async fetchActuatorAlerts() {
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

      if (!hasAnyData && __DEV__) {
        console.log(
          "📡 No actuator data available yet - API endpoints not ready"
        );
      }
    } catch (error) {
      console.error("Unexpected error in actuator alerts:", error);
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

  // Fetch sensor data and generate threshold alerts
  private async fetchSensorAlerts() {
    const zones = ["zone1", "zone2", "zone3", "zone4"];

    try {
      console.log("🔍 Checking sensor data...");
      let hasAnyData = false;

      for (const zone of zones) {
        const endDate = new Date().toISOString();
        const startDate = new Date(
          Date.now() - 2 * 60 * 60 * 1000
        ).toISOString();

        const sensorLogs = await this.safeApiRequest<SensorLogResponse[]>(
          `/logs/sensor-data?zoneId=${zone}&startDate=${startDate}&endDate=${endDate}&limit=100`
        );

        if (sensorLogs === null) {
          continue;
        }

        hasAnyData = true;
        console.log(`✅ Zone ${zone} sensor logs:`, sensorLogs.length);

        this.processSensorLogs(sensorLogs, zone);
      }

      if (!hasAnyData && __DEV__) {
        console.log(
          "📡 No sensor data available yet - API endpoints not ready"
        );
      }
    } catch (error) {
      console.error("Unexpected error in sensor alerts:", error);
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
    const thresholds = {
      temperature: { min: 18, max: 32, critical: 35 },
      humidity: { min: 40, max: 80, critical: 90 },
      light: { min: 30, max: 90, critical: 10 },
      soilMoisture: { min: 30, max: 80, critical: 20 },
    };

    const recentLogs = logs.filter((log) => {
      const logTime = new Date(log.timestamp);
      const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000);
      return logTime > thirtyMinutesAgo;
    });

    recentLogs.forEach((log) => {
      const value = log.value;

      // Temperature checks
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

      // Moisture checks
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

  // Initialize and fetch all alerts - with singleton pattern and caching
  async initialize(): Promise<void> {
    // If already initializing, return the existing promise
    if (this.initializationPromise) {
      return this.initializationPromise;
    }

    // If currently fetching or cache is still valid, don't fetch again
    if (this.isCurrentlyFetching || this.isCacheValid()) {
      console.log("📦 Using cached alert data");
      return Promise.resolve();
    }

    // Create initialization promise
    this.initializationPromise = this.performInitialization();

    try {
      await this.initializationPromise;
    } finally {
      // Clear the promise so future calls can create a new one
      this.initializationPromise = null;
    }
  }

  private async performInitialization(): Promise<void> {
    try {
      console.log("🚀 Initializing alert service...");
      this.isCurrentlyFetching = true;

      // Clear existing alerts only if we're doing a fresh fetch
      this.clearAlerts();

      // Test connectivity first
      const isConnected = await this.testConnectivity();

      if (!isConnected && __DEV__) {
        console.log(
          "📡 API not ready yet - will retry when data becomes available"
        );
        this.addAlert({
          text: "🔧 Development mode: API endpoints not ready yet",
          color: "#2196F3",
          icon: "general",
          type: "general",
          severity: "low",
        });
        this.isInitialized = true; // Mark as initialized even with mock data
        return;
      }

      // Fetch data from APIs
      await Promise.all([this.fetchActuatorAlerts(), this.fetchSensorAlerts()]);

      // Update cache timestamp
      this.lastFetchTime = Date.now();
      this.isInitialized = true;

      console.log(
        `✅ Alert service initialized with ${this.alerts.length} alerts`
      );
    } catch (error) {
      console.error("Error initializing alert service:", error);

      if (!__DEV__) {
        this.addAlert({
          text: "Monitoring system temporarily unavailable",
          color: "#FF9800",
          icon: "general",
          type: "general",
          severity: "low",
        });
      }
      this.isInitialized = true; // Mark as initialized even with errors
    } finally {
      this.isCurrentlyFetching = false;
    }
  }

  // Refresh alerts - unchanged method signature
  async refresh(): Promise<void> {
    await this.initialize();
  }

  // Test API connectivity
  async testConnectivity(): Promise<boolean> {
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

  // Get cache status for debugging
  getCacheStatus() {
    return {
      lastFetch: new Date(this.lastFetchTime),
      cacheValid: this.isCacheValid(),
      isCurrentlyFetching: this.isCurrentlyFetching,
      isInitialized: this.isInitialized,
      alertCount: this.alerts.length,
    };
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
