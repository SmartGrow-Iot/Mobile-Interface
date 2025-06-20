// data/alerts.ts
import { Alert } from "../types/Alert";

export const mockAlerts: Alert[] = [
  {
    id: "alert-1",
    text: "Light threshold for Zone A is Critical!",
    color: "#FFD580",
    icon: "light",
    type: "light",
    severity: "critical",
    timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
    zoneId: "zone-a",
  },
  {
    id: "alert-2",
    text: "Water threshold for Zone B is Critical!",
    color: "#AEE2FF",
    icon: "water",
    type: "water",
    severity: "critical",
    timestamp: new Date(Date.now() - 45 * 60 * 1000), // 45 minutes ago
    zoneId: "zone-b",
  },
  {
    id: "alert-3",
    text: "Temperature rising in Zone C",
    color: "#FFB3BA",
    icon: "temperature",
    type: "temperature",
    severity: "medium",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    zoneId: "zone-c",
  },
];
