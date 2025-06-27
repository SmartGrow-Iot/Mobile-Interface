// utils/plantUtils.ts
import { Plant } from "../data/plants";
import { Zone } from "../types/Zone";

export const calculateZoneAverages = (plants: Plant[]) => {
  if (plants.length === 0) {
    return { waterLevel: 0, lightLevel: 0, temperature: 0, humidity: 0 };
  }

  const totals = plants.reduce(
    (acc, plant) => ({
      waterLevel: acc.waterLevel + plant.waterLevel,
      lightLevel: acc.lightLevel + plant.lightLevel,
      temperature: acc.temperature + (plant.temperature || 0),
      humidity: acc.humidity + (plant.humidity || 0),
    }),
    { waterLevel: 0, lightLevel: 0, temperature: 0, humidity: 0 }
  );

  return {
    waterLevel: Math.round(totals.waterLevel / plants.length),
    lightLevel: Math.round(totals.lightLevel / plants.length),
    temperature: Math.round(totals.temperature / plants.length),
    humidity: Math.round(totals.humidity / plants.length),
  };
};

export const getZoneStatus = (plants: Plant[]): Zone["status"] => {
  if (plants.length === 0) return "Optimal";

  const criticalCount = plants.filter((p) => p.status === "Critical").length;
  const warningCount = plants.filter((p) => p.status === "Warning").length;

  if (criticalCount > 0) return "Critical";
  if (warningCount > plants.length / 2) return "Warning";
  return "Optimal";
};

export const needsWatering = (
  plant: Plant,
  hoursThreshold: number = 12
): boolean => {
  if (!plant.lastWatered) return true;

  const now = new Date();
  const diffInHours =
    (now.getTime() - plant.lastWatered.getTime()) / (1000 * 60 * 60);

  return diffInHours >= hoursThreshold || plant.waterLevel < 50;
};
