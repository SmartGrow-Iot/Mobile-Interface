// types/Notification.ts - Updated for real API integration
export type NotificationType =
  | "sensor_alert"
  | "threshold_exceeded"
  | "actuator_action"
  | "system_update"
  | "maintenance";

export type NotificationPriority = "low" | "medium" | "high" | "critical";

export type NotificationStatus = "unread" | "read" | "dismissed";

export type Notification = {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  priority: NotificationPriority;
  status: NotificationStatus;
  timestamp: Date;
  sensorId?: string;
  sensorType?: string;
  zoneId?: string;
  plantId?: string;
  actionLogId?: string;
  metadata?: {
    currentValue?: number;
    thresholdValue?: number;
    unit?: string;
    actionTaken?: string;
    triggeredBy?: string;
  };
};

// API Response types based on your actual API documentation
export type ActionLog = {
  id: string;
  action: string;
  actuatorId: string;
  plantId: string;
  amount: number | null;
  trigger: string; // "manual" | "auto"
  triggerBy: string; // userId or "SYSTEM"
  timestamp: string; // ISO 8601 format
};

export type SensorResponse = {
  sensorId?: string;
  sensorModel: string;
  type: string;
  description: string;
};

// For testing with mock data
export const mockNotifications: Notification[] = [
  {
    id: "notif_001",
    title: "Welcome to SmartGrow",
    message:
      "Your plant monitoring system is now active and ready to help you grow healthy plants!",
    type: "system_update",
    priority: "low",
    status: "unread",
    timestamp: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
  },
  {
    id: "notif_002",
    title: "Sensors Connected",
    message: "All sensor types are active and monitoring your plants",
    type: "sensor_alert",
    priority: "low",
    status: "unread",
    timestamp: new Date(Date.now() - 10 * 60 * 1000), // 10 minutes ago
    metadata: {
      currentValue: 5,
      unit: "sensor types",
    },
  },
  {
    id: "notif_003",
    title: "Auto Watering System Ready",
    message:
      "Automatic watering system is configured and ready to maintain optimal soil moisture",
    type: "actuator_action",
    priority: "medium",
    status: "unread",
    timestamp: new Date(Date.now() - 15 * 60 * 1000), // 15 minutes ago
    metadata: {
      actionTaken: "system_ready",
      triggeredBy: "SYSTEM",
    },
  },
];

// Enhanced notification service with better API integration
// utils/notificationUtils.ts
export const NotificationUtils = {
  // Format sensor type for display
  formatSensorType: (type: string): string => {
    const typeMap: Record<string, string> = {
      temperature: "Temperature",
      humidity: "Humidity",
      soil_moisture: "Soil Moisture",
      light: "Light",
      air_quality: "Air Quality",
    };
    return typeMap[type] || type.charAt(0).toUpperCase() + type.slice(1);
  },

  // Format action name for display
  formatActionName: (action: string): string => {
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
  },

  // Get priority color for UI
  getPriorityColor: (priority: NotificationPriority): string => {
    switch (priority) {
      case "critical":
        return "#ff4444";
      case "high":
        return "#ff9800";
      case "medium":
        return "#2196f3";
      case "low":
        return "#4caf50";
      default:
        return "#666";
    }
  },

  // Get icon name for notification type
  getNotificationIcon: (type: NotificationType): string => {
    switch (type) {
      case "sensor_alert":
      case "threshold_exceeded":
        return "warning-outline";
      case "actuator_action":
        return "settings-outline";
      case "system_update":
        return "information-circle-outline";
      case "maintenance":
        return "build-outline";
      default:
        return "notifications-outline";
    }
  },

  // Check if notification should show badge
  shouldShowBadge: (notification: Notification): boolean => {
    return (
      notification.priority === "critical" ||
      notification.priority === "high" ||
      notification.status === "unread"
    );
  },

  // Get relative time string
  getTimeAgo: (timestamp: Date): string => {
    const now = new Date();
    const diffInMinutes = Math.floor(
      (now.getTime() - timestamp.getTime()) / (1000 * 60)
    );

    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;

    return timestamp.toLocaleDateString();
  },
};

// API endpoint constants for easy reference
export const API_ENDPOINTS = {
  ACTION_LOGS: "/logs/actions",
  SENSORS_BY_TYPE: (type: string) => `/sensors?sensor_type=${type}`,
  SENSOR_TYPES: [
    "temperature",
    "humidity",
    "light",
    "soil_moisture",
    "air_quality",
  ],
} as const;
