// services/sensorService.ts - Fixed to handle actual API response
import { apiRequest } from "./api";
import {
  EnvironmentalDataResponse,
  PlantData,
  SoilMoistureData,
  SensorType,
  sensorConfigs,
} from "../types/Sensor";

export const sensorService = {
  // Fetch environmental data from Zone 2 (shared for humidity, light, temp, airQuality)
  fetchEnvironmentalData:
    async (): Promise<EnvironmentalDataResponse | null> => {
      try {
        console.log("Fetching environmental data from Zone 2...");

        // Fetch specifically from zone2 for environmental data
        const response: EnvironmentalDataResponse[] = await apiRequest(
          `/logs/sensors?zoneId=zone2&latest=true&limit=1`
        );

        console.log("Raw API response:", response);

        if (response && response.length > 0) {
          const data = response[0];
          console.log("Environmental data fetched from Zone 2:", data);
          console.log("Zone sensors:", data.zoneSensors);

          // Log individual sensor values for debugging
          console.log("Temperature:", data.zoneSensors.temp);
          console.log("Humidity:", data.zoneSensors.humidity);
          console.log("Light:", data.zoneSensors.light);
          console.log("Air Quality:", data.zoneSensors.airQuality);

          return data;
        }

        console.log("No environmental data found for Zone 2");
        return null;
      } catch (error) {
        console.error("Error fetching environmental data from Zone 2:", error);
        throw error;
      }
    },

  // Fetch soil moisture data for all zones (plant-specific by pin)
  fetchSoilMoistureData: async (): Promise<{
    soilData: SoilMoistureData[];
    availableZones: string[];
  }> => {
    try {
      const zones = ["zone1", "zone2", "zone3", "zone4"];
      const allSoilData: SoilMoistureData[] = [];
      const availableZones: string[] = [];

      console.log("Starting to fetch soil moisture data for all zones...");

      for (const zone of zones) {
        try {
          console.log(`Fetching plants for ${zone}...`);

          // Get all plants in this zone
          const zoneResponse = await apiRequest(`/zones/${zone}/plants`);
          const plants: PlantData[] = zoneResponse.plants || [];

          console.log(
            `Found ${plants.length} plants in ${zone}:`,
            plants.map((p) => p.name)
          );

          if (plants.length === 0) {
            console.log(`No plants found in ${zone}, skipping...`);
            continue;
          }

          // Add this zone to available zones if it has plants
          availableZones.push(zone);

          // Get latest sensor data for this specific zone (for soil moisture only)
          console.log(`Fetching soil moisture sensor data for ${zone}...`);
          const sensorResponse: EnvironmentalDataResponse[] = await apiRequest(
            `/logs/sensors?zoneId=${zone}&latest=true&limit=1`
          );

          console.log(`Sensor response for ${zone}:`, sensorResponse);

          if (sensorResponse.length === 0) {
            console.log(
              `No sensor data found for ${zone}, adding plants with no data...`
            );
            // Add plants with no moisture data
            for (const plant of plants) {
              const plantData: SoilMoistureData = {
                plantId: plant.plantId,
                plantName: plant.name,
                zone: plant.zone,
                pin: plant.moisturePin,
                moisture: 0, // No data
                critical: true, // Mark as critical if no data
                timestamp: new Date(),
                icon: sensorService.getPlantIcon(plant.zone),
                thresholds: plant.thresholds.moisture,
              };
              allSoilData.push(plantData);
            }
            continue;
          }

          const latestData = sensorResponse[0];
          console.log(`Latest sensor data for ${zone}:`, latestData);
          console.log(`Soil moisture readings:`, latestData.soilMoistureByPin);

          // Process each plant in this zone for soil moisture only
          for (const plant of plants) {
            try {
              console.log(
                `Processing plant: ${plant.name}, pin: ${plant.moisturePin}`
              );

              // Find the moisture data for this plant's specific pin
              const moistureReading = latestData.soilMoistureByPin.find(
                (reading) => reading.pin === plant.moisturePin
              );

              console.log(
                `Moisture reading for pin ${plant.moisturePin}:`,
                moistureReading
              );

              // Always add the plant, even if no moisture reading is available
              const moisture = moistureReading
                ? moistureReading.soilMoisture
                : 0;
              const critical = moistureReading
                ? sensorService.isCriticalValue(
                    moisture,
                    "soil",
                    plant.thresholds.moisture
                  )
                : true; // Mark as critical if no data

              const plantData: SoilMoistureData = {
                plantId: plant.plantId,
                plantName: plant.name,
                zone: plant.zone,
                pin: plant.moisturePin,
                moisture: moisture,
                critical: critical,
                timestamp: new Date(latestData.timestamp),
                icon: sensorService.getPlantIcon(plant.zone),
                thresholds: plant.thresholds.moisture,
              };

              console.log(`Adding plant data:`, plantData);
              allSoilData.push(plantData);

              if (!moistureReading) {
                console.warn(
                  `No moisture reading found for plant ${plant.name} with pin ${plant.moisturePin}. Available pins:`,
                  latestData.soilMoistureByPin.map((r) => r.pin)
                );
              }
            } catch (error) {
              console.error(`Error processing plant ${plant.plantId}:`, error);
            }
          }
        } catch (error) {
          console.error(`Error fetching data for ${zone}:`, error);
        }
      }

      console.log(`Total soil data collected:`, allSoilData);

      return {
        soilData: allSoilData,
        availableZones: availableZones, // Only zones with plants
      };
    } catch (error) {
      console.error("Error fetching soil moisture data:", error);
      throw error;
    }
  },

  // Helper functions
  getZoneDisplayName: (zoneId: string): string => {
    const zoneMap: Record<string, string> = {
      zone1: "Zone 1",
      zone2: "Zone 2",
      zone3: "Zone 3",
      zone4: "Zone 4",
    };
    return zoneMap[zoneId] || zoneId;
  },

  getPlantIcon: (zone: string): string => {
    return zone === "zone1" || zone === "zone2"
      ? "🌶️"
      : zone === "zone3" || zone === "zone4"
      ? "🍆"
      : "🌱";
  },

  isCriticalValue: (
    value: number,
    sensorType: SensorType,
    customThresholds?: { min: number; max: number }
  ): boolean => {
    if (sensorType === "soil" && customThresholds) {
      // For soil moisture, use plant-specific thresholds
      return value < customThresholds.min || value > customThresholds.max;
    }

    const cfg = sensorConfigs[sensorType];
    if (!cfg) return false;
    return (
      value <= cfg.thresholds.critical ||
      value < cfg.thresholds.min ||
      value > cfg.thresholds.max
    );
  },

  getSensorIconName: (sensorType: SensorType): string => {
    switch (sensorType) {
      case "temp":
        return "thermometer-outline";
      case "humidity":
        return "water-outline";
      case "light":
        return "sunny-outline";
      case "airQuality":
        return "cloud-outline";
      default:
        return "hardware-chip-outline";
    }
  },

  getSensorColor: (sensorType: SensorType): string => {
    switch (sensorType) {
      case "temp":
        return "#e74c3c";
      case "humidity":
        return "#3498db";
      case "light":
        return "#f39c12";
      case "airQuality":
        return "#95a5a6";
      default:
        return "#666";
    }
  },
};
