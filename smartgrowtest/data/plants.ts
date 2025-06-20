// data/plants.ts (for future use)
export type Plant = {
  id: string;
  name: string;
  type: "chili" | "eggplant";
  zoneId: string;
  status: "Optimal" | "Warning" | "Critical";
  waterLevel: number;
  lightLevel: number;
  temperature?: number;
  humidity?: number;
  plantedDate: Date;
  lastWatered?: Date;
  notes?: string;
};

export const mockPlants: Plant[] = [
  // Zone A - Chili Plants
  {
    id: "CP-1",
    name: "Chili Plant 1",
    type: "chili",
    zoneId: "zone-a",
    status: "Optimal",
    waterLevel: 75,
    lightLevel: 65,
    temperature: 28,
    humidity: 60,
    plantedDate: new Date("2024-05-23"),
    lastWatered: new Date(Date.now() - 8 * 60 * 60 * 1000), // 8 hours ago
  },
  {
    id: "CP-2",
    name: "Chili Plant 2",
    type: "chili",
    zoneId: "zone-a",
    status: "Optimal",
    waterLevel: 80,
    lightLevel: 70,
    temperature: 27,
    humidity: 62,
    plantedDate: new Date("2024-05-24"),
    lastWatered: new Date(Date.now() - 6 * 60 * 60 * 1000),
  },
  {
    id: "CP-3",
    name: "Chili Plant 3",
    type: "chili",
    zoneId: "zone-a",
    status: "Critical",
    waterLevel: 45,
    lightLevel: 85,
    temperature: 29,
    humidity: 58,
    plantedDate: new Date("2024-05-25"),
    lastWatered: new Date(Date.now() - 12 * 60 * 60 * 1000),
  },
  {
    id: "CP-4",
    name: "Chili Plant 4",
    type: "chili",
    zoneId: "zone-a",
    status: "Optimal",
    waterLevel: 78,
    lightLevel: 68,
    temperature: 28,
    humidity: 60,
    plantedDate: new Date("2024-05-26"),
    lastWatered: new Date(Date.now() - 4 * 60 * 60 * 1000),
  },
  // Zone B - Chili Plants
  {
    id: "CP-5",
    name: "Chili Plant 5",
    type: "chili",
    zoneId: "zone-b",
    status: "Critical",
    waterLevel: 40,
    lightLevel: 90,
    temperature: 30,
    humidity: 55,
    plantedDate: new Date("2024-05-27"),
    lastWatered: new Date(Date.now() - 16 * 60 * 60 * 1000),
  },
  {
    id: "CP-6",
    name: "Chili Plant 6",
    type: "chili",
    zoneId: "zone-b",
    status: "Optimal",
    waterLevel: 82,
    lightLevel: 72,
    temperature: 27,
    humidity: 63,
    plantedDate: new Date("2024-05-28"),
    lastWatered: new Date(Date.now() - 5 * 60 * 60 * 1000),
  },
  {
    id: "CP-7",
    name: "Chili Plant 7",
    type: "chili",
    zoneId: "zone-b",
    status: "Optimal",
    waterLevel: 76,
    lightLevel: 67,
    temperature: 28,
    humidity: 60,
    plantedDate: new Date("2024-05-29"),
    lastWatered: new Date(Date.now() - 7 * 60 * 60 * 1000),
  },
  {
    id: "CP-8",
    name: "Chili Plant 8",
    type: "chili",
    zoneId: "zone-b",
    status: "Optimal",
    waterLevel: 79,
    lightLevel: 69,
    temperature: 27,
    humidity: 62,
    plantedDate: new Date("2024-05-30"),
    lastWatered: new Date(Date.now() - 3 * 60 * 60 * 1000),
  },
  // Zone C - Eggplants
  {
    id: "EP-1",
    name: "Eggplant 1",
    type: "eggplant",
    zoneId: "zone-c",
    status: "Optimal",
    waterLevel: 77,
    lightLevel: 66,
    temperature: 25,
    humidity: 65,
    plantedDate: new Date("2024-05-23"),
    lastWatered: new Date(Date.now() - 6 * 60 * 60 * 1000),
  },
  {
    id: "EP-2",
    name: "Eggplant 2",
    type: "eggplant",
    zoneId: "zone-c",
    status: "Optimal",
    waterLevel: 81,
    lightLevel: 71,
    temperature: 24,
    humidity: 68,
    plantedDate: new Date("2024-05-24"),
    lastWatered: new Date(Date.now() - 4 * 60 * 60 * 1000),
  },
  {
    id: "EP-3",
    name: "Eggplant 3",
    type: "eggplant",
    zoneId: "zone-c",
    status: "Optimal",
    waterLevel: 74,
    lightLevel: 64,
    temperature: 26,
    humidity: 60,
    plantedDate: new Date("2024-05-25"),
    lastWatered: new Date(Date.now() - 8 * 60 * 60 * 1000),
  },
  {
    id: "EP-4",
    name: "Eggplant 4",
    type: "eggplant",
    zoneId: "zone-c",
    status: "Optimal",
    waterLevel: 83,
    lightLevel: 73,
    temperature: 25,
    humidity: 67,
    plantedDate: new Date("2024-05-26"),
    lastWatered: new Date(Date.now() - 5 * 60 * 60 * 1000),
  },
  // Zone D - Eggplants
  {
    id: "EP-5",
    name: "Eggplant 5",
    type: "eggplant",
    zoneId: "zone-d",
    status: "Optimal",
    waterLevel: 76,
    lightLevel: 65,
    temperature: 24,
    humidity: 68,
    plantedDate: new Date("2024-05-27"),
    lastWatered: new Date(Date.now() - 6 * 60 * 60 * 1000),
  },
  {
    id: "EP-6",
    name: "Eggplant 6",
    type: "eggplant",
    zoneId: "zone-d",
    status: "Optimal",
    waterLevel: 79,
    lightLevel: 68,
    temperature: 25,
    humidity: 65,
    plantedDate: new Date("2024-05-28"),
    lastWatered: new Date(Date.now() - 4 * 60 * 60 * 1000),
  },
  {
    id: "EP-7",
    name: "Eggplant 7",
    type: "eggplant",
    zoneId: "zone-d",
    status: "Warning",
    waterLevel: 78,
    lightLevel: 67,
    temperature: 25,
    humidity: 67,
    plantedDate: new Date("2024-05-29"),
    lastWatered: new Date(Date.now() - 10 * 60 * 60 * 1000),
    notes: "Showing signs of stress, monitor closely",
  },
  {
    id: "EP-8",
    name: "Eggplant 8",
    type: "eggplant",
    zoneId: "zone-d",
    status: "Optimal",
    waterLevel: 80,
    lightLevel: 70,
    temperature: 24,
    humidity: 68,
    plantedDate: new Date("2024-05-30"),
    lastWatered: new Date(Date.now() - 3 * 60 * 60 * 1000),
  },
];

// Helper functions for data access
export const getPlantsByZone = (zoneId: string): Plant[] => {
  return mockPlants.filter((plant) => plant.zoneId === zoneId);
};

export const getPlantById = (plantId: string): Plant | undefined => {
  return mockPlants.find((plant) => plant.id === plantId);
};

export const getCriticalPlants = (): Plant[] => {
  return mockPlants.filter((plant) => plant.status === "Critical");
};

export const getPlantsByType = (type: "chili" | "eggplant"): Plant[] => {
  return mockPlants.filter((plant) => plant.type === type);
};
