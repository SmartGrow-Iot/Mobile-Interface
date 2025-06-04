import { PlantDetail } from "../types/Plant";

export const mockPlantDetails: Record<string, PlantDetail> = {
  "CP-1": {
    id: "CP-1",
    name: "Chili Plant 1",
    image: "🌶️",
    zone: "Zone A",
    datePlanted: "23/5/2024",
    optimalMoisture: "50% - 70%",
    optimalLight: "70% - 80%",
    optimalTemp: "25°C - 30°C",
    type: "Warm-season fruiting vegetable",
    growthTime: "60-90 days to maturity",
    notes:
      "Prefers well-drained soil and benefits from regular feeding during flowering and fruiting stages.",
    thresholds: [
      {
        label: "Light Threshold is",
        value: "Optimal",
        color: "#222",
        bg: "#f5f5f5",
        icon: "☀️",
      },
      {
        label: "Water Threshold is",
        value: "Critical",
        color: "red",
        bg: "#fff",
        icon: "💧",
      },
    ],
    actuator: "Override Actuator",
    readings: [
      { label: "Temp", value: "28°C" },
      { label: "Humidity", value: "60%" },
      { label: "Moisture", value: "40%" },
      { label: "Light", value: "70%" },
      { label: "Wind", value: "5 m/s" },
    ],
  },
  // Add more plant details here...
  "EP-1": {
    id: "EP-1",
    name: "Eggplant 1",
    image: "🍆",
    zone: "Zone C",
    datePlanted: "23/5/2024",
    optimalMoisture: "60% - 80%",
    optimalLight: "60% - 75%",
    optimalTemp: "22°C - 28°C",
    type: "Warm-season fruiting vegetable",
    growthTime: "70-100 days",
    notes:
      "Requires consistent moisture and warm temperatures for optimal growth.",
    thresholds: [
      {
        label: "Light Threshold is",
        value: "Optimal",
        color: "#222",
        bg: "#f5f5f5",
        icon: "☀️",
      },
      {
        label: "Water Threshold is",
        value: "Optimal",
        color: "#222",
        bg: "#fff",
        icon: "💧",
      },
    ],
    actuator: "Override Actuator",
    readings: [
      { label: "Temp", value: "25°C" },
      { label: "Humidity", value: "65%" },
      { label: "Moisture", value: "70%" },
      { label: "Light", value: "65%" },
      { label: "Wind", value: "3 m/s" },
    ],
  },
};

// Helper function to get plant details
export const getPlantDetails = (plantId: string): PlantDetail | undefined => {
  return mockPlantDetails[plantId.trim().toUpperCase()];
};
