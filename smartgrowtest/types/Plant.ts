export type PlantStatus = "Optimal" | "Warning" | "Critical";

export type PlantThreshold = {
  label: string;
  value: string;
  color: string;
  bg: string;
  icon: string;
};

export type PlantReading = {
  label: string;
  value: string;
};

export type PlantDetail = {
  plantId: string;
  name: string;
  image: string;
  zone: string;
  datePlanted: string;
  optimalMoisture: string;
  optimalLight: string;
  optimalTemp: string;
  type: string;
  growthTime: string;
  notes: string;
  description: string;
  thresholds: PlantThreshold[];
  actuator: string;
  readings: PlantReading[];
};
