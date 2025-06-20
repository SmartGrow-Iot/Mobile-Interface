// app/sensors/[sensor].tsx - Updated with real API data
import React, { useState, useEffect } from "react";
import { View, StyleSheet, Alert, RefreshControl } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import Header from "../../components/Header";
import { apiRequest } from "@/services/api";

// Import components
import { SensorHeader } from "../../components/features/sensors/SensorHeader";
import { SensorStats } from "../../components/features/sensors/SensorStats";
import { PlantSensorsList } from "../../components/features/sensors/PlantSensorsList";
import { EmptyState } from "../../components/ui/EmptyState";
import { LoadingSpinner } from "../../components/LoadingSpinner";

// Types based on API responses
interface SensorData {
    sensorId: string;
    sensorModel: string;
    type: string;
    description: string;
    esp32Id: string;
    pinId: number;
    boardNumber: number;
    plantIds: string[];
    userId: string;
    createdAt: string;
    lastUpdated: string;
}

interface PlantData {
    plantId: string;
    name: string;
    zone: string;
    status: string;
    // Add other plant fields as needed
}

interface SensorLogData {
    logId: string;
    sensorId: string;
    plantId: string;
    value: number;
    timestamp: string;
}

interface ProcessedSensorGroup {
    id: string;
    plantId: string;
    plantName: string;
    sensorId: string;
    zone: string;
    value: string;
    rawValue: number;
    critical: boolean;
    icon: string;
    lastUpdated: Date;
    esp32Id?: string;
    pinId?: number;
    boardNumber?: number;
}

// Sensor configuration mapping
const sensorConfigs: Record<
    string,
    {
        name: string;
        icon: string;
        description: string;
        unit: string;
        thresholds: { min: number; max: number; critical: number };
    }
> = {
    temperature: {
        name: "Temperature Sensor",
        icon: "🌡️",
        description: "Monitor ambient temperature for optimal plant growth",
        unit: "°C",
        thresholds: { min: 18, max: 30, critical: 35 },
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
    soilMoisture: {
        name: "Soil Moisture Sensor",
        icon: "🟫",
        description: "Track soil moisture levels for irrigation management",
        unit: "%",
        thresholds: { min: 30, max: 80, critical: 20 },
    },
    airQuality: {
        name: "Air Quality Sensor",
        icon: "🌬️",
        description: "Monitor air quality and CO2 levels",
        unit: "ppm",
        thresholds: { min: 300, max: 600, critical: 1000 },
    },
};

// Helper function to get plant icon based on zone or plant type
const getPlantIcon = (zone: string, plantName?: string): string => {
    if (
        plantName?.toLowerCase().includes("chili") ||
        zone?.toLowerCase().includes("a") ||
        zone?.toLowerCase().includes("b")
    ) {
        return "🌶️";
    }
    if (
        plantName?.toLowerCase().includes("eggplant") ||
        zone?.toLowerCase().includes("c") ||
        zone?.toLowerCase().includes("d")
    ) {
        return "🍆";
    }
    return "🌱"; // Default plant icon
};

// Helper function to determine if value is critical
const isCriticalValue = (value: number, sensorType: string): boolean => {
    const config = sensorConfigs[sensorType];
    if (!config) return false;

    return (
        value <= config.thresholds.critical ||
        value < config.thresholds.min ||
        value > config.thresholds.max
    );
};

export default function SensorDetail() {
    const { sensor } = useLocalSearchParams();
    const router = useRouter();

    // State
    const [sensors, setSensors] = useState<SensorData[]>([]);
    const [sensorGroups, setSensorGroups] = useState<ProcessedSensorGroup[]>(
        []
    );
    const [isLoading, setIsLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);

    const sensorType = typeof sensor === "string" ? sensor : "";
    const sensorConfig = sensorConfigs[sensorType];

    // Fetch all data
    const fetchSensorData = async (showLoading = true) => {
        if (showLoading) setIsLoading(true);

        try {
            console.log(`Fetching sensors for type: ${sensorType}`);

            // 1. Fetch sensors of this type
            // Note: API expects exact parameter names from documentation
            const sensorResponse = await apiRequest(
                `/sensors?sensorType=${sensorType}`
            );
            const sensorsData: SensorData[] = Array.isArray(sensorResponse)
                ? sensorResponse
                : sensorResponse?.sensors || [];
            setSensors(sensorsData);

            console.log(
                `Found ${sensorsData.length} sensors of type ${sensorType}`
            );

            if (sensorsData.length === 0) {
                setSensorGroups([]);
                return;
            }

            // 2. Fetch latest sensor logs for all sensors
            const sensorLogs: { [sensorId: string]: SensorLogData[] } = {};
            const plantDataCache: { [plantId: string]: PlantData } = {};

            await Promise.all(
                sensorsData.map(async (sensorData) => {
                    try {
                        // Get recent logs for this sensor (last 10 readings)
                        // API: get_sensor_logs with parameters
                        const logsResponse = await apiRequest(
                            `/logs/sensor-data?sensorId=${sensorData.sensorId}&limit=10`
                        );
                        sensorLogs[sensorData.sensorId] = Array.isArray(
                            logsResponse
                        )
                            ? logsResponse
                            : [];

                        // Fetch plant data for each plant connected to this sensor
                        await Promise.all(
                            sensorData.plantIds.map(async (plantId) => {
                                if (!plantDataCache[plantId]) {
                                    try {
                                        const plantResponse = await apiRequest(
                                            `/plants/${plantId}`
                                        );
                                        plantDataCache[plantId] = plantResponse;
                                    } catch (error) {
                                        console.error(
                                            `Error fetching plant ${plantId}:`,
                                            error
                                        );
                                        // Create fallback plant data
                                        plantDataCache[plantId] = {
                                            plantId,
                                            name: `Plant ${plantId.slice(-4)}`,
                                            zone: "Unknown",
                                            status: "unknown",
                                        };
                                    }
                                }
                            })
                        );
                    } catch (error) {
                        console.error(
                            `Error fetching data for sensor ${sensorData.sensorId}:`,
                            error
                        );
                        sensorLogs[sensorData.sensorId] = [];
                    }
                })
            );

            // 3. Process data and create sensor groups by plant
            const processedGroups: ProcessedSensorGroup[] = [];

            sensorsData.forEach((sensorData) => {
                sensorData.plantIds.forEach((plantId) => {
                    const plantData = plantDataCache[plantId];
                    const logs = sensorLogs[sensorData.sensorId] || [];

                    // Get the latest reading for this plant
                    const latestLog = logs
                        .filter((log) => log.plantId === plantId)
                        .sort(
                            (a, b) =>
                                new Date(b.timestamp).getTime() -
                                new Date(a.timestamp).getTime()
                        )[0];

                    const value = latestLog?.value ?? 0;
                    const isCritical = isCriticalValue(value, sensorType);

                    processedGroups.push({
                        id: `${sensorData.sensorId}-${plantId}`,
                        plantId: plantId,
                        plantName:
                            plantData?.name || `Plant ${plantId.slice(-4)}`,
                        sensorId: sensorData.sensorId,
                        zone: plantData?.zone || "Unknown Zone",
                        value: `${value}${sensorConfig?.unit || ""}`,
                        rawValue: value,
                        critical: isCritical,
                        icon: getPlantIcon(
                            plantData?.zone || "",
                            plantData?.name
                        ),
                        lastUpdated: latestLog
                            ? new Date(latestLog.timestamp)
                            : new Date(),
                        esp32Id: sensorData.esp32Id,
                        pinId: sensorData.pinId,
                        boardNumber: sensorData.boardNumber,
                    });
                });
            });

            // Sort by critical status first, then by latest update
            processedGroups.sort((a, b) => {
                if (a.critical && !b.critical) return -1;
                if (!a.critical && b.critical) return 1;
                return b.lastUpdated.getTime() - a.lastUpdated.getTime();
            });

            setSensorGroups(processedGroups);
            console.log(
                `Processed ${processedGroups.length} sensor-plant combinations`
            );
        } catch (error) {
            console.error("Error fetching sensor data:", error);
            Alert.alert(
                "Error",
                "Failed to fetch sensor data. Please check your connection and try again."
            );
        } finally {
            setIsLoading(false);
            setIsRefreshing(false);
        }
    };

    // Initial load
    useEffect(() => {
        if (sensorType && sensorConfig) {
            fetchSensorData();
        }
    }, [sensorType]);

    // Handle refresh
    const handleRefresh = async () => {
        setIsRefreshing(true);
        await fetchSensorData(false);
    };

    // Handle plant/sensor group press
    const handleGroupPress = (group: ProcessedSensorGroup) => {
        Alert.alert(
            `${group.plantName} - ${sensorConfig?.name}`,
            `Zone: ${group.zone}\nValue: ${group.value}\nStatus: ${
                group.critical ? "Critical" : "Normal"
            }\nSensor ID: ${group.sensorId}\nESP32: ${group.esp32Id}\nPin: ${
                group.pinId
            }`,
            [
                {
                    text: "View Plant",
                    onPress: () => router.push(`/plants/${group.plantId}`),
                },
                {
                    text: "View Zone",
                    onPress: () => {
                        // Map zone names to API format
                        const zoneMapping: { [key: string]: string } = {
                            "Zone A": "zone1",
                            "Zone B": "zone2",
                            "Zone C": "zone3",
                            "Zone D": "zone4",
                            zone1: "zone1",
                            zone2: "zone2",
                            zone3: "zone3",
                            zone4: "zone4",
                        };
                        const mappedZone =
                            zoneMapping[group.zone] || group.zone.toLowerCase();
                        router.push(`/plants/zone/${mappedZone}`);
                    },
                },
                {
                    text: "Cancel",
                    style: "cancel",
                },
            ]
        );
    };

    // Calculate stats
    const stats = {
        totalGroups: sensorGroups.length,
        criticalGroups: sensorGroups.filter((g) => g.critical).length,
        averageValue:
            sensorGroups.length > 0
                ? sensorGroups.reduce((sum, g) => sum + g.rawValue, 0) /
                  sensorGroups.length
                : undefined,
        unit: sensorConfig?.unit,
    };

    // Error state - sensor type not found
    if (!sensorConfig) {
        return (
            <View style={styles.container}>
                <Header title="Sensor Not Found" showBackButton={true} />
                <View style={styles.content}>
                    <EmptyState
                        icon="hardware-chip-outline"
                        title="Sensor type not found"
                        subtitle={`The sensor type "${sensorType}" is not supported.`}
                    />
                </View>
            </View>
        );
    }

    // Custom breadcrumbs
    const customBreadcrumbs = [
        { label: "Home", route: "/" },
        { label: "Sensors", route: "/(tabs)/sensors" },
        { label: sensorConfig.name },
    ];

    // Loading state
    if (isLoading) {
        return (
            <View style={styles.container}>
                <Header
                    title={sensorConfig.name}
                    showBackButton={true}
                    customBreadcrumbs={customBreadcrumbs}
                />
                <LoadingSpinner
                    text={`Loading ${sensorConfig.name.toLowerCase()} data...`}
                />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Header
                title={sensorConfig.name}
                showBackButton={true}
                customBreadcrumbs={customBreadcrumbs}
            />

            <View style={styles.content}>
                {/* Sensor Header */}
                <SensorHeader
                    icon={sensorConfig.icon}
                    name={sensorConfig.name}
                    description={sensorConfig.description}
                />

                {/* Stats */}
                <SensorStats stats={stats} />

                {/* Plant Sensors List */}
                <PlantSensorsList
                    sensorGroups={sensorGroups}
                    onGroupPress={handleGroupPress}
                    sensorType={sensorType}
                    refreshControl={
                        <RefreshControl
                            refreshing={isRefreshing}
                            onRefresh={handleRefresh}
                            colors={["#174d3c"]}
                            tintColor="#174d3c"
                        />
                    }
                />
            </View>
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
    },
});
