// app/notifications.tsx - Complete notifications implementation
import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  Text,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import Header from "../components/Header";
import { Card } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { apiRequest } from "../services/api";
import {
  Notification,
  SystemThresholds,
  PlantData,
  EnvironmentalData,
  NotificationStats,
  NotificationHelpers,
} from "../types/Notification";

export default function NotificationsScreen() {
  const router = useRouter();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [systemThresholds, setSystemThresholds] =
    useState<SystemThresholds | null>(null);
  const [stats, setStats] = useState<NotificationStats>({
    total: 0,
    critical: 0,
    warning: 0,
    unread: 0,
  });

  const customBreadcrumbs = [
    { label: "Home", route: "/" },
    { label: "Notifications" },
  ];

  // Fetch system thresholds
  const fetchSystemThresholds = async (): Promise<SystemThresholds | null> => {
    try {
      console.log("Fetching system thresholds...");
      const response = await apiRequest("/system/thresholds");
      console.log("System thresholds fetched:", response);
      return response.thresholds;
    } catch (error) {
      console.error("Error fetching system thresholds:", error);
      // Return default thresholds if API fails
      return {
        light: { min: 0, max: 200 },
        temperature: { min: 20, max: 30 },
        airQuality: { min: 0, max: 100 },
      };
    }
  };

  // Create environmental notification
  const createEnvironmentalNotification = (
    sensor: string,
    value: number,
    threshold: { min: number; max: number },
    zone: string,
    plantId: string,
    plantName: string,
    timestamp: string
  ): Notification => {
    const isBelow = value < threshold.min;
    const isAbove = value > threshold.max;
    const severity =
      (sensor === "temperature" && (value < 15 || value > 35)) ||
      (sensor === "light" && value < 10) ||
      (sensor === "humidity" && (value < 20 || value > 90)) ||
      (sensor === "airQuality" && value > 500)
        ? "critical"
        : "warning";

    const sensorInfo = NotificationHelpers.getSensorInfo(sensor);
    const direction = isBelow ? "below" : "above";
    const limitValue = isBelow ? threshold.min : threshold.max;

    return {
      id: `env-${zone}-${plantId}-${sensor}-${Date.now()}`,
      type: "environmental",
      severity,
      title: `${sensorInfo.name} ${
        severity === "critical" ? "Critical" : "Warning"
      }`,
      message: `${plantName} in ${NotificationHelpers.getZoneDisplayName(
        zone
      )}: ${sensorInfo.name} is ${direction} threshold (${value}${
        sensorInfo.unit
      } vs ${limitValue}${sensorInfo.unit})`,
      sensor,
      value,
      threshold,
      zone,
      plantId,
      plantName,
      timestamp: new Date(timestamp),
      isRead: false,
    };
  };

  // Create moisture notification
  const createMoistureNotification = (
    value: number,
    threshold: { min: number; max: number },
    zone: string,
    plantId: string,
    plantName: string,
    pin: number,
    timestamp: string
  ): Notification => {
    const isBelow = value < threshold.min;
    const severity =
      (isBelow && value < 10) || (!isBelow && value > 90)
        ? "critical"
        : "warning";
    const direction = isBelow ? "below" : "above";
    const limitValue = isBelow ? threshold.min : threshold.max;

    return {
      id: `moisture-${zone}-${plantId}-${pin}-${Date.now()}`,
      type: "moisture",
      severity,
      title: `Soil Moisture ${
        severity === "critical" ? "Critical" : "Warning"
      }`,
      message: `${plantName} (Pin ${pin}): Soil moisture is ${direction} threshold (${value}% vs ${limitValue}%)`,
      sensor: "soilMoisture",
      value,
      threshold,
      zone,
      plantId,
      plantName,
      pin,
      timestamp: new Date(timestamp),
      isRead: false,
    };
  };

  // Create no data notification
  const createNoDataNotification = (
    zone: string,
    plantId: string,
    plantName: string,
    pin: number,
    timestamp: string
  ): Notification => {
    return {
      id: `nodata-${zone}-${plantId}-${pin}-${Date.now()}`,
      type: "moisture",
      severity: "warning",
      title: "No Soil Moisture Data",
      message: `${plantName} (Pin ${pin}): No moisture sensor data available`,
      sensor: "soilMoisture",
      value: 0,
      threshold: { min: 0, max: 100 },
      zone,
      plantId,
      plantName,
      pin,
      timestamp: new Date(timestamp),
      isRead: false,
    };
  };

  // Create no sensor data notification
  const createNoSensorDataNotification = (
    zone: string,
    plantId: string,
    plantName: string,
    timestamp: string
  ): Notification => {
    return {
      id: `nosensor-${zone}-${plantId}-${Date.now()}`,
      type: "environmental",
      severity: "warning",
      title: "No Sensor Data",
      message: `${plantName} in ${NotificationHelpers.getZoneDisplayName(
        zone
      )}: No environmental sensor data available`,
      sensor: "environmental",
      value: 0,
      threshold: { min: 0, max: 100 },
      zone,
      plantId,
      plantName,
      timestamp: new Date(timestamp),
      isRead: false,
    };
  };

  // Fetch notifications data
  const fetchNotifications = async () => {
    try {
      console.log("Starting notification fetch process...");

      // First, fetch system thresholds
      const thresholds = await fetchSystemThresholds();
      if (!thresholds) {
        console.error("Failed to fetch system thresholds");
        return;
      }
      setSystemThresholds(thresholds);
      console.log("Using system thresholds:", thresholds);

      const zones = ["zone1", "zone2", "zone3", "zone4"];
      const allNotifications: Notification[] = [];

      // For each zone, fetch plants and check thresholds
      for (const zone of zones) {
        try {
          console.log(`Processing zone: ${zone}`);

          // Get plants in this zone
          const plantsResponse = await apiRequest(`/zones/${zone}/plants`);
          const plants: PlantData[] = plantsResponse?.plants || [];

          if (plants.length === 0) {
            console.log(`No plants found in ${zone}`);
            continue;
          }

          console.log(`Found ${plants.length} plants in ${zone}`);

          // Get latest sensor data for this zone
          const sensorResponse: EnvironmentalData[] = await apiRequest(
            `/logs/sensors?zoneId=${zone}&latest=true&limit=1`
          );

          if (sensorResponse.length === 0) {
            console.log(`No sensor data found for ${zone}`);
            // Create notifications for missing sensor data
            for (const plant of plants) {
              allNotifications.push(
                createNoSensorDataNotification(
                  zone,
                  plant.plantId,
                  plant.name,
                  new Date().toISOString()
                )
              );
            }
            continue;
          }

          const latestData = sensorResponse[0];
          console.log(`Latest sensor data for ${zone}:`, latestData);

          // Check environmental sensors for each plant
          for (const plant of plants) {
            console.log(`Checking thresholds for plant: ${plant.name}`);

            // Use plant-specific thresholds (these override system thresholds)
            const plantThresholds = plant.thresholds;

            // Check light threshold using plant-specific threshold
            const lightValue = latestData.zoneSensors.light;
            console.log(
              `Light: ${lightValue} vs threshold ${plantThresholds.light.min}-${plantThresholds.light.max}`
            );
            if (
              lightValue < plantThresholds.light.min ||
              lightValue > plantThresholds.light.max
            ) {
              allNotifications.push(
                createEnvironmentalNotification(
                  "light",
                  lightValue,
                  plantThresholds.light,
                  zone,
                  plant.plantId,
                  plant.name,
                  latestData.timestamp
                )
              );
            }

            // Check temperature threshold using plant-specific threshold
            const tempValue = latestData.zoneSensors.temp;
            console.log(
              `Temperature: ${tempValue} vs threshold ${plantThresholds.temperature.min}-${plantThresholds.temperature.max}`
            );
            if (
              tempValue < plantThresholds.temperature.min ||
              tempValue > plantThresholds.temperature.max
            ) {
              allNotifications.push(
                createEnvironmentalNotification(
                  "temperature",
                  tempValue,
                  plantThresholds.temperature,
                  zone,
                  plant.plantId,
                  plant.name,
                  latestData.timestamp
                )
              );
            }

            // Check humidity threshold (use system threshold as fallback since plants don't have humidity thresholds)
            const humidityValue = latestData.zoneSensors.humidity;
            const humidityThreshold = { min: 40, max: 80 }; // Default humidity range since not in plant thresholds
            console.log(
              `Humidity: ${humidityValue} vs threshold ${humidityThreshold.min}-${humidityThreshold.max}`
            );
            if (
              humidityValue < humidityThreshold.min ||
              humidityValue > humidityThreshold.max
            ) {
              allNotifications.push(
                createEnvironmentalNotification(
                  "humidity",
                  humidityValue,
                  humidityThreshold,
                  zone,
                  plant.plantId,
                  plant.name,
                  latestData.timestamp
                )
              );
            }

            // Check air quality threshold using plant-specific threshold
            const airQualityValue = latestData.zoneSensors.airQuality;
            console.log(
              `Air Quality: ${airQualityValue} vs threshold ${plantThresholds.airQuality.min}-${plantThresholds.airQuality.max}`
            );
            if (
              airQualityValue < plantThresholds.airQuality.min ||
              airQualityValue > plantThresholds.airQuality.max
            ) {
              allNotifications.push(
                createEnvironmentalNotification(
                  "airQuality",
                  airQualityValue,
                  plantThresholds.airQuality,
                  zone,
                  plant.plantId,
                  plant.name,
                  latestData.timestamp
                )
              );
            }

            // Check soil moisture threshold for this specific plant using plant-specific threshold
            const moistureReading = latestData.soilMoistureByPin.find(
              (reading) => reading.pin === plant.moisturePin
            );

            if (moistureReading) {
              const moistureValue = moistureReading.soilMoisture;
              console.log(
                `Soil Moisture (Pin ${plant.moisturePin}): ${moistureValue} vs threshold ${plantThresholds.moisture.min}-${plantThresholds.moisture.max}`
              );
              if (
                moistureValue < plantThresholds.moisture.min ||
                moistureValue > plantThresholds.moisture.max
              ) {
                allNotifications.push(
                  createMoistureNotification(
                    moistureValue,
                    plantThresholds.moisture,
                    zone,
                    plant.plantId,
                    plant.name,
                    plant.moisturePin,
                    latestData.timestamp
                  )
                );
              }
            } else {
              // No moisture data available - create warning notification
              console.log(
                `No moisture data for plant ${plant.name} on pin ${plant.moisturePin}`
              );
              allNotifications.push(
                createNoDataNotification(
                  zone,
                  plant.plantId,
                  plant.name,
                  plant.moisturePin,
                  latestData.timestamp
                )
              );
            }
          }
        } catch (error) {
          console.error(`Error processing zone ${zone}:`, error);
        }
      }

      console.log(`Total notifications generated: ${allNotifications.length}`);

      // Sort notifications by timestamp (newest first) and remove duplicates
      const uniqueNotifications =
        NotificationHelpers.removeDuplicateNotifications(allNotifications);
      const sortedNotifications = uniqueNotifications.sort(
        (a, b) => b.timestamp.getTime() - a.timestamp.getTime()
      );

      console.log(
        `Final notifications after deduplication: ${sortedNotifications.length}`
      );
      setNotifications(sortedNotifications);

      // Calculate stats
      const notificationStats = {
        total: sortedNotifications.length,
        critical: sortedNotifications.filter((n) => n.severity === "critical")
          .length,
        warning: sortedNotifications.filter((n) => n.severity === "warning")
          .length,
        unread: sortedNotifications.filter((n) => !n.isRead).length,
      };
      setStats(notificationStats);
      console.log("Notification stats:", notificationStats);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      Alert.alert("Error", "Failed to fetch notifications");
    }
  };

  // Handle notification press
  const handleNotificationPress = (notification: Notification) => {
    if (notification.plantId) {
      router.push(`/plants/${notification.plantId}`);
    } else if (notification.zone) {
      router.push(`/plants/zone/${notification.zone}`);
    }
  };

  // Mark notification as read
  const markAsRead = (notificationId: string) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === notificationId
          ? { ...notification, isRead: true }
          : notification
      )
    );
  };

  // Mark all as read
  const markAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((notification) => ({ ...notification, isRead: true }))
    );
    setStats((prev) => ({ ...prev, unread: 0 }));
  };

  // Handle refresh
  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await fetchNotifications();
    } finally {
      setRefreshing(false);
    }
  };

  // Initial data fetch
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        await fetchNotifications();
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Auto-refresh every 2 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      if (!loading && !refreshing) {
        fetchNotifications();
      }
    }, 10 * 60 * 1000); // 2 minutes

    return () => clearInterval(interval);
  }, [loading, refreshing]);

  if (loading) {
    return (
      <View style={styles.container}>
        <Header
          title="Notifications"
          showBackButton={true}
          customBreadcrumbs={customBreadcrumbs}
        />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#174d3c" />
          <Text style={styles.loadingText}>Loading notifications...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header
        title="Notifications"
        showBackButton={true}
        customBreadcrumbs={customBreadcrumbs}
      />

      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={["#174d3c"]}
            tintColor="#174d3c"
          />
        }
      >
        {/* Current Thresholds Card */}
        {systemThresholds && (
          <Card style={styles.thresholdsCard}>
            <View style={styles.thresholdsHeader}>
              <Text style={styles.thresholdsTitle}>
                Current System Thresholds
              </Text>
              <TouchableOpacity
                style={styles.editThresholdsButton}
                onPress={() => router.push("/")}
              >
                <Ionicons name="settings-outline" size={16} color="#174d3c" />
                <Text style={styles.editThresholdsText}>Edit</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.thresholdsGrid}>
              <View style={styles.thresholdItem}>
                <Text style={styles.thresholdIcon}>☀️</Text>
                <Text style={styles.thresholdLabel}>Light</Text>
                <Text style={styles.thresholdValue}>
                  {systemThresholds.light.min} - {systemThresholds.light.max}
                </Text>
              </View>
              <View style={styles.thresholdItem}>
                <Text style={styles.thresholdIcon}>🌡️</Text>
                <Text style={styles.thresholdLabel}>Temperature</Text>
                <Text style={styles.thresholdValue}>
                  {systemThresholds.temperature.min}°C -{" "}
                  {systemThresholds.temperature.max}°C
                </Text>
              </View>
              <View style={styles.thresholdItem}>
                <Text style={styles.thresholdIcon}>🌬️</Text>
                <Text style={styles.thresholdLabel}>Air Quality</Text>
                <Text style={styles.thresholdValue}>
                  {systemThresholds.airQuality.min} -{" "}
                  {systemThresholds.airQuality.max} ppm
                </Text>
              </View>
              <View style={styles.thresholdItem}>
                <Text style={styles.thresholdIcon}>💧</Text>
                <Text style={styles.thresholdLabel}>Soil Moisture</Text>
                <Text style={styles.thresholdValue}>Per Plant</Text>
              </View>
            </View>
            <Text style={styles.thresholdsNote}>
              💡 Note: Environmental sensors use plant-specific thresholds. Soil
              moisture uses individual plant settings.
            </Text>
          </Card>
        )}

        {/* Statistics Card */}
        <Card style={styles.statsCard}>
          <View style={styles.statsHeader}>
            <Text style={styles.statsTitle}>Notification Summary</Text>
            {stats.unread > 0 && (
              <TouchableOpacity
                style={styles.markAllButton}
                onPress={markAllAsRead}
              >
                <Text style={styles.markAllButtonText}>Mark All Read</Text>
              </TouchableOpacity>
            )}
          </View>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{stats.total}</Text>
              <Text style={styles.statLabel}>Total</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: "#e74c3c" }]}>
                {stats.critical}
              </Text>
              <Text style={styles.statLabel}>Critical</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: "#f39c12" }]}>
                {stats.warning}
              </Text>
              <Text style={styles.statLabel}>Warning</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: "#174d3c" }]}>
                {stats.unread}
              </Text>
              <Text style={styles.statLabel}>Unread</Text>
            </View>
          </View>
        </Card>

        {/* Notifications List */}
        <View style={styles.notificationsSection}>
          <Text style={styles.sectionTitle}>Recent Notifications</Text>

          {notifications.length === 0 ? (
            <Card style={styles.emptyCard}>
              <View style={styles.emptyState}>
                <Ionicons name="checkmark-circle" size={64} color="#27ae60" />
                <Text style={styles.emptyTitle}>All Clear!</Text>
                <Text style={styles.emptySubtitle}>
                  No threshold violations detected. All sensors are within
                  optimal ranges.
                </Text>
              </View>
            </Card>
          ) : (
            notifications.map((notification) => (
              <TouchableOpacity
                key={notification.id}
                onPress={() => handleNotificationPress(notification)}
              >
                <Card
                  style={[
                    styles.notificationCard,
                    !notification.isRead && styles.unreadCard,
                  ]}
                >
                  <View style={styles.notificationHeader}>
                    <View style={styles.notificationLeft}>
                      <View
                        style={[
                          styles.severityIconContainer,
                          {
                            backgroundColor:
                              notification.severity === "critical"
                                ? "#ffebee"
                                : notification.severity === "warning"
                                ? "#fff8e1"
                                : "#e3f2fd",
                          },
                        ]}
                      >
                        <Ionicons
                          name={
                            NotificationHelpers.getSeverityIcon(
                              notification.severity
                            ) as any
                          }
                          size={20}
                          color={
                            notification.severity === "critical"
                              ? "#e74c3c"
                              : notification.severity === "warning"
                              ? "#f39c12"
                              : "#3498db"
                          }
                        />
                      </View>
                      <View style={styles.notificationContent}>
                        <View style={styles.notificationTitleRow}>
                          <Text style={styles.notificationTitle}>
                            {notification.title}
                          </Text>
                          <Badge
                            variant={
                              notification.severity === "critical"
                                ? "error"
                                : notification.severity === "warning"
                                ? "warning"
                                : "info"
                            }
                            size="small"
                          >
                            {notification.severity.toUpperCase()}
                          </Badge>
                        </View>
                        <Text style={styles.notificationMessage}>
                          {notification.message}
                        </Text>
                        <View style={styles.notificationMeta}>
                          <View style={styles.sensorInfo}>
                            <Ionicons
                              name={
                                NotificationHelpers.getSensorIcon(
                                  notification.sensor
                                ) as any
                              }
                              size={12}
                              color="#666"
                            />
                            <Text style={styles.sensorText}>
                              {
                                NotificationHelpers.getSensorInfo(
                                  notification.sensor
                                ).name
                              }
                            </Text>
                          </View>
                          <Text style={styles.timestamp}>
                            {notification.timestamp.toLocaleString()}
                          </Text>
                        </View>
                      </View>
                    </View>
                    {!notification.isRead && (
                      <TouchableOpacity
                        style={styles.markReadButton}
                        onPress={(e) => {
                          e.stopPropagation();
                          markAsRead(notification.id);
                        }}
                      >
                        <Ionicons name="checkmark" size={16} color="#666" />
                      </TouchableOpacity>
                    )}
                  </View>
                </Card>
              </TouchableOpacity>
            ))
          )}
        </View>

        {/* Legend */}
        <Card style={styles.legendCard}>
          <Text style={styles.legendTitle}>Notification Types</Text>
          <View style={styles.legendRow}>
            <View style={styles.legendItem}>
              <Ionicons name="alert-circle" size={16} color="#e74c3c" />
              <Text style={styles.legendText}>
                Critical - Immediate attention required
              </Text>
            </View>
            <View style={styles.legendItem}>
              <Ionicons name="warning" size={16} color="#f39c12" />
              <Text style={styles.legendText}>Warning - Monitor closely</Text>
            </View>
            <View style={styles.legendItem}>
              <Ionicons name="information-circle" size={16} color="#3498db" />
              <Text style={styles.legendText}>Info - General information</Text>
            </View>
          </View>
        </Card>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f8f8",
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#666",
  },
  thresholdsCard: {
    marginBottom: 20,
  },
  thresholdsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  thresholdsTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#174d3c",
  },
  editThresholdsButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  editThresholdsText: {
    fontSize: 12,
    color: "#174d3c",
    marginLeft: 4,
    fontWeight: "600",
  },
  thresholdsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  thresholdItem: {
    width: "48%",
    alignItems: "center",
    marginBottom: 12,
    backgroundColor: "#f8f9fa",
    borderRadius: 8,
    paddingVertical: 12,
  },
  thresholdIcon: {
    fontSize: 20,
    marginBottom: 4,
  },
  thresholdLabel: {
    fontSize: 12,
    color: "#666",
    fontWeight: "500",
    marginBottom: 2,
  },
  thresholdValue: {
    fontSize: 11,
    color: "#333",
    fontWeight: "600",
    textAlign: "center",
  },
  thresholdsNote: {
    fontSize: 11,
    color: "#666",
    fontStyle: "italic",
    textAlign: "center",
    lineHeight: 14,
  },
  statsCard: {
    marginBottom: 20,
  },
  statsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#174d3c",
  },
  markAllButton: {
    backgroundColor: "#174d3c",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  markAllButtonText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  statItem: {
    alignItems: "center",
  },
  statValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: "#666",
    fontWeight: "500",
  },
  notificationsSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#174d3c",
    marginBottom: 16,
  },
  emptyCard: {
    paddingVertical: 40,
  },
  emptyState: {
    alignItems: "center",
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#27ae60",
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    lineHeight: 20,
  },
  notificationCard: {
    marginBottom: 12,
  },
  unreadCard: {
    borderLeftWidth: 4,
    borderLeftColor: "#174d3c",
  },
  notificationHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  notificationLeft: {
    flexDirection: "row",
    flex: 1,
  },
  severityIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    flex: 1,
    marginRight: 8,
  },
  notificationMessage: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
    marginBottom: 8,
  },
  notificationMeta: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  sensorInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  sensorText: {
    fontSize: 12,
    color: "#666",
    marginLeft: 4,
  },
  timestamp: {
    fontSize: 12,
    color: "#999",
  },
  markReadButton: {
    padding: 8,
    borderRadius: 4,
    backgroundColor: "#f0f0f0",
  },
  legendCard: {
    marginBottom: 32,
  },
  legendTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 12,
  },
  legendRow: {
    gap: 8,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  legendText: {
    fontSize: 12,
    color: "#666",
    marginLeft: 8,
  },
});
