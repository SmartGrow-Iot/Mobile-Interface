// hooks/useHomeData.ts - Updated for direct zone access
import { useMemo } from "react";
import { mockAlerts } from "../data/alerts";
import { mockZonesDirect, mockZoneCategories } from "../data/zones";
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

    // Use direct zones for optimal count
    const optimalZones = mockZonesDirect.filter(
      (zone) => zone.status === "Optimal"
    ).length;

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
    // Use direct zones for critical zones
    return mockZonesDirect.filter((zone) => zone.status === "Critical");
  }, []);

  // Zone statistics
  const zoneStats = useMemo(() => {
    const totalZones = mockZonesDirect.length;
    const optimalCount = mockZonesDirect.filter(
      (z) => z.status === "Optimal"
    ).length;
    const warningCount = mockZonesDirect.filter(
      (z) => z.status === "Warning"
    ).length;
    const criticalCount = mockZonesDirect.filter(
      (z) => z.status === "Critical"
    ).length;
    const totalPlantsInZones = mockZonesDirect.reduce(
      (sum, zone) => sum + zone.plantCount,
      0
    );

    return {
      totalZones,
      optimalCount,
      warningCount,
      criticalCount,
      totalPlantsInZones,
    };
  }, []);

  return {
    stats,
    alerts: recentAlerts,
    criticalZones,
    zoneCategories: mockZoneCategories, // Keep for backward compatibility
    zones: mockZonesDirect, // Direct zones access
    zoneStats,
  };
}
