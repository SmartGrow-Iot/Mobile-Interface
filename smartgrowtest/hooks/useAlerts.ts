// hooks/useAlerts.ts - Dedicated hook for alerts
import { useState, useEffect, useCallback } from "react";
import { alertService } from "../services/alertService";
import { Alert } from "../types/Alert";

export function useAlerts() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Calculate different alert counts
  const totalCount = alerts.length;
  const criticalCount = alerts.filter((a) => a.severity === "critical").length;
  const highCount = alerts.filter((a) => a.severity === "high").length;
  const mediumCount = alerts.filter((a) => a.severity === "medium").length;
  const lowCount = alerts.filter((a) => a.severity === "low").length;

  // Initialize alerts
  useEffect(() => {
    const initializeAlerts = async () => {
      setIsLoading(true);
      try {
        // Subscribe to alert updates
        const unsubscribe = alertService.subscribe((newAlerts) => {
          setAlerts(newAlerts);
        });

        // Initialize alert service
        await alertService.initialize();

        return unsubscribe;
      } catch (error) {
        console.error("Error initializing alerts:", error);
      } finally {
        setIsLoading(false);
      }
    };

    const cleanup = initializeAlerts();

    // Cleanup on unmount
    return () => {
      cleanup.then((cleanupFn) => cleanupFn?.());
    };
  }, []);

  // Alert actions
  const dismissAlert = useCallback((alertId: string) => {
    alertService.dismissAlert(alertId);
  }, []);

  const clearAllAlerts = useCallback(() => {
    alertService.clearAlerts();
  }, []);

  const refreshAlerts = useCallback(async () => {
    setIsLoading(true);
    try {
      await alertService.refresh();
    } catch (error) {
      console.error("Error refreshing alerts:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Filter alerts by type
  const getAlertsByType = useCallback(
    (type: Alert["type"]) => {
      return alerts.filter((alert) => alert.type === type);
    },
    [alerts]
  );

  // Filter alerts by severity
  const getAlertsBySeverity = useCallback(
    (severity: Alert["severity"]) => {
      return alerts.filter((alert) => alert.severity === severity);
    },
    [alerts]
  );

  // Filter alerts by zone
  const getAlertsByZone = useCallback(
    (zoneId: string) => {
      return alerts.filter((alert) => alert.zoneId === zoneId);
    },
    [alerts]
  );

  // Get recent alerts (last 24 hours)
  const getRecentAlerts = useCallback(() => {
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
    return alerts.filter(
      (alert) => alert.timestamp && alert.timestamp > yesterday
    );
  }, [alerts]);

  // Test API connectivity
  const testConnectivity = useCallback(async () => {
    return await alertService.testConnectivity();
  }, []);

  return {
    // Alert data
    alerts,
    isLoading,

    // Counts
    totalCount,
    criticalCount,
    highCount,
    mediumCount,
    lowCount,

    // Actions
    dismissAlert,
    clearAllAlerts,
    refreshAlerts,

    // Filters
    getAlertsByType,
    getAlertsBySeverity,
    getAlertsByZone,
    getRecentAlerts,

    // Testing
    testConnectivity,
  };
}
