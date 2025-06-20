// hooks/useHomeData.ts - Custom hook for data management
import { useMemo } from "react";
import { mockAlerts } from "../data/alerts";
import { mockZoneCategories } from "../data/zones";
import { mockPlants } from "../data/plants";
import { Zone } from "@/types/Zone";

export function useHomeData() {
  const stats = useMemo(() => {
    const totalPlants = mockPlants.length;
    const healthyPlants = mockPlants.filter(
      (plant) => plant.status === "Optimal"
    ).length;
    const criticalAlerts = mockAlerts.filter(
      (alert) => alert.severity === "critical"
    ).length;
    const optimalZones = mockZoneCategories.reduce((count, category) => {
      return (
        count +
        category.zones.filter((zone) => zone.status === "Optimal").length
      );
    }, 0);

    return {
      totalPlants,
      healthyPlants,
      criticalAlerts,
      optimalZones,
    };
  }, []);

  const recentAlerts = useMemo(() => {
    return mockAlerts
      .sort(
        (a, b) => (b.timestamp?.getTime() || 0) - (a.timestamp?.getTime() || 0)
      )
      .slice(0, 5);
  }, []);

  const criticalZones = useMemo(() => {
    return mockZoneCategories.reduce((zones, category) => {
      const critical = category.zones.filter(
        (zone) => zone.status === "Critical"
      );
      return [...zones, ...critical];
    }, [] as Zone[]);
  }, []);

  return {
    stats,
    alerts: recentAlerts,
    criticalZones,
    zoneCategories: mockZoneCategories,
  };
}
