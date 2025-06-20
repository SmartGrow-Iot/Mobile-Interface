// services/notificationService.ts - Updated with real API integration
import { apiRequest } from "./api";
import {
  Notification,
  ActionLog,
  NotificationPriority,
} from "../types/Notification";

// API Response types based on your documentation
interface SensorResponse {
  sensorId?: string;
  sensorModel: string;
  type: string;
  description: string;
}

interface ActionLogResponse {
  id: string;
  action: string;
  actuatorId: string;
  plantId: string;
  amount: number | null;
  trigger: string;
  triggerBy: string;
  timestamp: string; // ISO 8601 format
}

class NotificationService {
  private notifications: Notification[] = [];
  private listeners: ((notifications: Notification[]) => void)[] = [];
  private sensorTypes = [
    "temperature",
    "humidity",
    "light",
    "soil_moisture",
    "air_quality",
  ];

  // Subscribe to notification updates
  subscribe(callback: (notifications: Notification[]) => void) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(
        (listener) => listener !== callback
      );
    };
  }

  // Notify all listeners
  private notify() {
    this.listeners.forEach((listener) => listener(this.notifications));
  }

  // Get all notifications
  getNotifications(): Notification[] {
    return this.notifications.sort(
      (a, b) => b.timestamp.getTime() - a.timestamp.getTime()
    );
  }

  // Get unread notifications count
  getUnreadCount(): number {
    return this.notifications.filter((n) => n.status === "unread").length;
  }

  // Mark notification as read
  markAsRead(notificationId: string) {
    const notification = this.notifications.find(
      (n) => n.id === notificationId
    );
    if (notification) {
      notification.status = "read";
      this.notify();
    }
  }

  // Mark notification as dismissed
  dismissNotification(notificationId: string) {
    const notification = this.notifications.find(
      (n) => n.id === notificationId
    );
    if (notification) {
      notification.status = "dismissed";
      this.notify();
    }
  }

  // Mark all as read
  markAllAsRead() {
    this.notifications.forEach((n) => {
      if (n.status === "unread") {
        n.status = "read";
      }
    });
    this.notify();
  }

  // Clear all notifications
  clearAll() {
    this.notifications = [];
    this.notify();
  }

  // Add notification
  private addNotification(notification: Omit<Notification, "id">) {
    const newNotification: Notification = {
      ...notification,
      id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    };

    this.notifications.unshift(newNotification);

    // Keep only last 100 notifications
    if (this.notifications.length > 100) {
      this.notifications = this.notifications.slice(0, 100);
    }

    this.notify();
    return newNotification;
  }

  // 1. Fetch all action logs (API: get_all_action_logs)
  async fetchActionLogNotifications() {
    try {
      console.log("Fetching action logs from API...");
      const actionLogs: ActionLogResponse[] = await apiRequest("/logs/actions");

      console.log(`Received ${actionLogs.length} action logs`);

      // Process recent action logs (last 24 hours)
      const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
      const recentLogs = actionLogs.filter(
        (log) => new Date(log.timestamp) > yesterday
      );

      console.log(`Processing ${recentLogs.length} recent action logs`);

      recentLogs.forEach((log) => {
        this.processActionLog(log);
      });

      // Create a summary notification if there are action logs
      if (recentLogs.length > 0) {
        this.addNotification({
          title: "System Activity Summary",
          message: `${recentLogs.length} actions performed in the last 24 hours`,
          type: "system_update",
          priority: "low",
          status: "unread",
          timestamp: new Date(),
        });
      }
    } catch (error) {
      console.error("Error fetching action log notifications:", error);
      this.addNotification({
        title: "Action Log Error",
        message: "Failed to fetch latest system activities",
        type: "system_update",
        priority: "medium",
        status: "unread",
        timestamp: new Date(),
      });
    }
  }

  // 2. Fetch all sensors by type (API: get_all_sensors)
  async fetchSensorStatusNotifications() {
    try {
      console.log("Fetching sensor data from API...");
      const allSensorData: { [key: string]: SensorResponse[] } = {};

      // Fetch sensors for each type
      for (const sensorType of this.sensorTypes) {
        try {
          console.log(`Fetching ${sensorType} sensors...`);
          const sensors: SensorResponse[] = await apiRequest(
            `/sensors?sensor_type=${sensorType}`
          );
          allSensorData[sensorType] = sensors;
          console.log(`Found ${sensors.length} ${sensorType} sensors`);
        } catch (error) {
          console.error(`Error fetching ${sensorType} sensors:`, error);
          allSensorData[sensorType] = [];
        }
      }

      // Process sensor data and create notifications
      this.processSensorData(allSensorData);
    } catch (error) {
      console.error("Error fetching sensor notifications:", error);
      this.addNotification({
        title: "Sensor Status Error",
        message: "Failed to fetch sensor status information",
        type: "system_update",
        priority: "medium",
        status: "unread",
        timestamp: new Date(),
      });
    }
  }

  // Process sensor data and create notifications
  private processSensorData(sensorData: { [key: string]: SensorResponse[] }) {
    let totalSensors = 0;
    let activeSensorTypes = 0;

    // Count sensors and create notifications for each type
    for (const [sensorType, sensors] of Object.entries(sensorData)) {
      if (sensors.length > 0) {
        totalSensors += sensors.length;
        activeSensorTypes++;

        // Create notification for each sensor type with active sensors
        this.addNotification({
          title: `${this.formatSensorType(sensorType)} Sensors Active`,
          message: `${sensors.length} ${this.formatSensorType(
            sensorType
          )} sensor(s) are currently monitoring your plants`,
          type: "sensor_alert",
          priority: "low",
          status: "unread",
          timestamp: new Date(),
          sensorType: sensorType,
          metadata: {
            currentValue: sensors.length,
            unit: "sensors",
          },
        });

        // Check for sensor-specific issues (example: missing sensors for critical types)
        if (sensorType === "soil_moisture" && sensors.length === 0) {
          this.addNotification({
            title: "Critical: No Soil Moisture Sensors",
            message:
              "No soil moisture sensors found. This is critical for plant health monitoring.",
            type: "sensor_alert",
            priority: "critical",
            status: "unread",
            timestamp: new Date(),
            sensorType: sensorType,
          });
        }
      }
    }

    // Create summary notification
    if (totalSensors > 0) {
      this.addNotification({
        title: "Sensor Network Status",
        message: `${totalSensors} sensors across ${activeSensorTypes} types are monitoring your plants`,
        type: "system_update",
        priority: "low",
        status: "unread",
        timestamp: new Date(),
        metadata: {
          currentValue: totalSensors,
          unit: "total sensors",
        },
      });
    } else {
      this.addNotification({
        title: "No Sensors Detected",
        message:
          "No active sensors found. Please check your sensor connections.",
        type: "system_update",
        priority: "high",
        status: "unread",
        timestamp: new Date(),
      });
    }
  }

  // Process action log and create notification
  private processActionLog(log: ActionLogResponse) {
    const actionName = this.formatActionName(log.action);
    const triggerType = log.trigger === "auto" ? "automatically" : "manually";
    const triggerBy = log.triggerBy === "SYSTEM" ? "system" : "user";

    // Determine priority based on action type and trigger
    let priority: NotificationPriority = "low";
    if (log.trigger === "auto") {
      priority = "medium"; // Auto actions are more important
    }
    if (log.action === "watering" && log.trigger === "auto") {
      priority = "high"; // Auto watering is high priority
    }

    this.addNotification({
      title: `${actionName} Activated`,
      message: `${actionName} was ${triggerType} triggered by ${triggerBy}${
        log.amount ? ` (${log.amount}ml dispensed)` : ""
      }`,
      type: "actuator_action",
      priority: priority,
      status: "unread",
      timestamp: new Date(log.timestamp),
      plantId: log.plantId,
      actionLogId: log.id,
      metadata: {
        actionTaken: log.action,
        triggeredBy: log.triggerBy,
        ...(log.amount && { currentValue: log.amount, unit: "ml" }),
      },
    });
  }

  // Helper methods
  private formatSensorType(type: string): string {
    const typeMap: Record<string, string> = {
      temperature: "Temperature",
      humidity: "Humidity",
      soil_moisture: "Soil Moisture",
      light: "Light",
      air_quality: "Air Quality",
    };
    return typeMap[type] || type.charAt(0).toUpperCase() + type.slice(1);
  }

  private formatActionName(action: string): string {
    const actionMap: Record<string, string> = {
      watering: "Watering System",
      light_on: "Grow Light On",
      light_off: "Grow Light Off",
      fan_on: "Ventilation Fan On",
      fan_off: "Ventilation Fan Off",
    };
    return (
      actionMap[action] || action.charAt(0).toUpperCase() + action.slice(1)
    );
  }

  // Initialize notifications (call this on app start)
  async initialize() {
    try {
      console.log("Initializing notification service...");

      // Add initial startup notification
      this.addNotification({
        title: "SmartGrow System Started",
        message: "Notification system is now monitoring your plants",
        type: "system_update",
        priority: "low",
        status: "unread",
        timestamp: new Date(),
      });

      // Fetch data from both APIs
      await Promise.all([
        this.fetchActionLogNotifications(),
        this.fetchSensorStatusNotifications(),
      ]);

      console.log("Notification service initialized successfully");
    } catch (error) {
      console.error("Error initializing notifications:", error);
      this.addNotification({
        title: "Initialization Error",
        message: "Failed to initialize notification system",
        type: "system_update",
        priority: "high",
        status: "unread",
        timestamp: new Date(),
      });
    }
  }

  // Refresh notifications
  async refresh() {
    console.log("Refreshing notifications...");
    await Promise.all([
      this.fetchActionLogNotifications(),
      this.fetchSensorStatusNotifications(),
    ]);
  }

  // Test API connectivity
  async testApiConnectivity() {
    try {
      // Test action logs API
      const actionLogsTest = await apiRequest("/logs/actions");
      console.log(
        "✅ Action logs API working",
        actionLogsTest.length,
        "logs found"
      );

      // Test sensors API for each type
      for (const sensorType of this.sensorTypes) {
        try {
          const sensorsTest = await apiRequest(
            `/sensors?sensor_type=${sensorType}`
          );
          console.log(
            `✅ ${sensorType} sensors API working`,
            sensorsTest.length,
            "sensors found"
          );
        } catch (error) {
          console.log(`❌ ${sensorType} sensors API failed:`, error);
        }
      }

      this.addNotification({
        title: "API Connectivity Test",
        message: "API connectivity test completed. Check console for details.",
        type: "system_update",
        priority: "low",
        status: "unread",
        timestamp: new Date(),
      });
    } catch (error) {
      console.error("❌ API connectivity test failed:", error);
      this.addNotification({
        title: "API Connectivity Failed",
        message: "Cannot connect to SmartGrow backend services",
        type: "system_update",
        priority: "critical",
        status: "unread",
        timestamp: new Date(),
      });
    }
  }
}

export const notificationService = new NotificationService();

// For debugging - expose service to global scope in development
if (__DEV__) {
  (global as any).notificationService = notificationService;
}
