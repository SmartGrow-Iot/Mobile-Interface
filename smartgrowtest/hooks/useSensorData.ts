// hooks/useSensorData.ts - Custom hook for sensor data management
import { useState, useEffect, useMemo } from "react";
import {
  getSensorInfo,
  getGroupDataBySensor,
  calculateSensorStats,
} from "../data/sensors";
import { SensorInfo, GroupData } from "../types/Sensor";

export function useSensorData(sensorType: string) {
  const [isLoading, setIsLoading] = useState(false);
  const [lastRefresh, setLastRefresh] = useState(new Date());

  const sensorInfo = useMemo(() => getSensorInfo(sensorType), [sensorType]);
  const groupData = useMemo(
    () => getGroupDataBySensor(sensorType),
    [sensorType]
  );
  const stats = useMemo(() => calculateSensorStats(groupData), [groupData]);

  const refresh = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setLastRefresh(new Date());
    } finally {
      setIsLoading(false);
    }
  };

  // Auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isLoading) {
        setLastRefresh(new Date());
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [isLoading]);

  return {
    sensorInfo,
    groupData,
    stats,
    isLoading,
    lastRefresh,
    refresh,
  };
}
