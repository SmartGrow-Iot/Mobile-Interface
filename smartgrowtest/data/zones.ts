// data/zones.ts - Updated with direct zone access
import { Zone, ZoneCategory } from "../types/Zone";

// Direct zones data for homepage (4 zones without categories)
export const mockZonesDirect: Zone[] = [
  {
    id: "zone1",
    name: "Zone 1",
    icon: "🌱",
    status: "Optimal",
    plantCount: 4,
    plantType: "chili",
    averageWaterLevel: 75,
    averageLightLevel: 82,
    temperature: 26,
    humidity: 65,
    lastUpdated: new Date(),
  },
  {
    id: "zone2",
    name: "Zone 2",
    icon: "🌱",
    status: "Warning",
    plantCount: 3,
    plantType: "chili",
    averageWaterLevel: 45,
    averageLightLevel: 78,
    temperature: 28,
    humidity: 58,
    lastUpdated: new Date(),
  },
  {
    id: "zone3",
    name: "Zone 3",
    icon: "🌱",
    status: "Optimal",
    plantCount: 4,
    plantType: "eggplant",
    averageWaterLevel: 68,
    averageLightLevel: 74,
    temperature: 25,
    humidity: 72,
    lastUpdated: new Date(),
  },
  {
    id: "zone4",
    name: "Zone 4",
    icon: "🌱",
    status: "Critical",
    plantCount: 2,
    plantType: "eggplant",
    averageWaterLevel: 25,
    averageLightLevel: 45,
    temperature: 32,
    humidity: 40,
    lastUpdated: new Date(),
  },
];

// Keep original category-based data for other parts of the app that might need it
export const mockZoneCategories: ZoneCategory[] = [
  {
    id: "chili",
    name: "Chili Trees",
    color: "#e74c3c",
    icon: "🌶️",
    zones: [
      {
        id: "zone1",
        name: "Zone 1",
        icon: "🌶️",
        status: "Optimal",
        plantCount: 4,
        plantType: "chili",
        averageWaterLevel: 75,
        averageLightLevel: 82,
        temperature: 26,
        humidity: 65,
        lastUpdated: new Date(),
      },
      {
        id: "zone2",
        name: "Zone 2",
        icon: "🌶️",
        status: "Warning",
        plantCount: 3,
        plantType: "chili",
        averageWaterLevel: 45,
        averageLightLevel: 78,
        temperature: 28,
        humidity: 58,
        lastUpdated: new Date(),
      },
    ],
  },
  {
    id: "eggplant",
    name: "Eggplant Trees",
    color: "#9b59b6",
    icon: "🍆",
    zones: [
      {
        id: "zone3",
        name: "Zone 3",
        icon: "🍆",
        status: "Optimal",
        plantCount: 4,
        plantType: "eggplant",
        averageWaterLevel: 68,
        averageLightLevel: 74,
        temperature: 25,
        humidity: 72,
        lastUpdated: new Date(),
      },
      {
        id: "zone4",
        name: "Zone 4",
        icon: "🍆",
        status: "Critical",
        plantCount: 2,
        plantType: "eggplant",
        averageWaterLevel: 25,
        averageLightLevel: 45,
        temperature: 32,
        humidity: 40,
        lastUpdated: new Date(),
      },
    ],
  },
];

// Helper function to get zone by ID from direct zones
export const getZoneById = (zoneId: string): Zone | undefined => {
  return mockZonesDirect.find((zone) => zone.id === zoneId);
};

// Helper function to get all zones
export const getAllZones = (): Zone[] => {
  return mockZonesDirect;
};

// Helper function to get zones by plant type (if needed)
export const getZonesByPlantType = (
  plantType: "chili" | "eggplant"
): Zone[] => {
  return mockZonesDirect.filter((zone) => zone.plantType === plantType);
};

// Helper function to get zone statistics
export const getZoneStats = () => {
  const totalZones = mockZonesDirect.length;
  const optimalZones = mockZonesDirect.filter(
    (zone) => zone.status === "Optimal"
  ).length;
  const warningZones = mockZonesDirect.filter(
    (zone) => zone.status === "Warning"
  ).length;
  const criticalZones = mockZonesDirect.filter(
    (zone) => zone.status === "Critical"
  ).length;
  const totalPlants = mockZonesDirect.reduce(
    (sum, zone) => sum + zone.plantCount,
    0
  );

  return {
    totalZones,
    optimalZones,
    warningZones,
    criticalZones,
    totalPlants,
  };
};
