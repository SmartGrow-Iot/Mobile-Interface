export type Alert = {
  id: string;
  text: string;
  color: string;
  icon: string;
  type: "light" | "water" | "temperature" | "humidity" | "general";
  severity: "low" | "medium" | "high" | "critical";
  timestamp?: Date;
  plantId?: string;
  zoneId?: string;
};
