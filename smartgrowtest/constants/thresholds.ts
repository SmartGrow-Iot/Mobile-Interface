export const PLANT_THRESHOLDS = {
  chili: {
    water: { min: 50, max: 70, critical: 40 },
    light: { min: 70, max: 80, critical: 50 },
    temperature: { min: 25, max: 30, critical: 35 },
    humidity: { min: 55, max: 75, critical: 40 },
  },
  eggplant: {
    water: { min: 60, max: 80, critical: 45 },
    light: { min: 60, max: 75, critical: 45 },
    temperature: { min: 22, max: 28, critical: 32 },
    humidity: { min: 60, max: 80, critical: 45 },
  },
} as const;

export const getThresholdStatus = (
  value: number,
  plantType: "chili" | "eggplant",
  metric: "water" | "light" | "temperature" | "humidity"
): "optimal" | "warning" | "critical" => {
  const thresholds = PLANT_THRESHOLDS[plantType][metric];

  if (value <= thresholds.critical) return "critical";
  if (value < thresholds.min || value > thresholds.max) return "warning";
  return "optimal";
};
