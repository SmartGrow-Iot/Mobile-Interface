// data/zones.ts
import { Zone, ZoneCategory } from "../types/Zone";

export const mockZones: Record<string, Zone[]> = {
  chili: [
    {
      id: "zone1",
      name: "Zone 1",
      icon: "🌶️",
      status: "Critical",
      plantCount: 4,
      plantType: "chili",
      averageWaterLevel: 75,
      averageLightLevel: 45, // Critical light level
      temperature: 28,
      humidity: 65,
      lastUpdated: new Date(),
    },
    {
      id: "zone2",
      name: "Zone 2",
      icon: "🌶️",
      status: "Critical",
      plantCount: 4,
      plantType: "chili",
      averageWaterLevel: 40, // Critical water level
      averageLightLevel: 75,
      temperature: 30,
      humidity: 55,
      lastUpdated: new Date(),
    },
  ],
  eggplant: [
    {
      id: "zone3",
      name: "Zone 3",
      icon: "🍆",
      status: "Optimal",
      plantCount: 4,
      plantType: "eggplant",
      averageWaterLevel: 78,
      averageLightLevel: 68,
      temperature: 25,
      humidity: 70,
      lastUpdated: new Date(),
    },
    {
      id: "zone4",
      name: "Zone 4",
      icon: "🍆",
      status: "Optimal",
      plantCount: 4,
      plantType: "eggplant",
      averageWaterLevel: 82,
      averageLightLevel: 72,
      temperature: 24,
      humidity: 68,
      lastUpdated: new Date(),
    },
  ],
};

export const mockZoneCategories: ZoneCategory[] = [
  {
    id: "chili",
    name: "Chili Trees",
    zones: mockZones.chili,
    color: "#e74c3c",
    icon: "🌶️",
  },
  {
    id: "eggplant",
    name: "Eggplant Trees",
    zones: mockZones.eggplant,
    color: "#8e44ad",
    icon: "🍆",
  },
];
