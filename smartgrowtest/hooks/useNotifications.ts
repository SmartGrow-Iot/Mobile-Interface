// hooks/useNotifications.ts - Complete implementation with force refresh capability
import { useState, useEffect, useCallback } from "react";
import { notificationService } from "../services/notificationService";
import { alertService } from "../services/alertService";
import { Notification } from "../types/Notification";
import { Alert } from "../types/Alert";

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Calculate unread count (notifications + critical alerts)
  const unreadCount =
    notifications.filter((n) => n.status === "unread").length +
    alerts.filter((a) => a.severity === "critical").length;

  // Initialize services only once on mount
  useEffect(() => {
    let notificationUnsubscribe: (() => void) | null = null;
    let alertUnsubscribe: (() => void) | null = null;

    const initializeServices = async () => {
      try {
        setIsLoading(true);

        // Subscribe to notifications first to get immediate updates
        notificationUnsubscribe = notificationService.subscribe(
          (newNotifications) => {
            setNotifications(newNotifications);
          }
        );

        // Subscribe to alerts
        alertUnsubscribe = alertService.subscribe((newAlerts) => {
          setAlerts(newAlerts);
        });

        // Initialize both services (will use cache if available)
        await Promise.all([
          notificationService.initialize(),
          alertService.initialize(),
        ]);
      } catch (error) {
        console.error("Error initializing notification services:", error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeServices();

    // Cleanup subscriptions on unmount
    return () => {
      if (notificationUnsubscribe) {
        notificationUnsubscribe();
      }
      if (alertUnsubscribe) {
        alertUnsubscribe();
      }
    };
  }, []); // Empty dependency array - only run once

  // Notification actions
  const markAsRead = useCallback((notificationId: string) => {
    notificationService.markAsRead(notificationId);
  }, []);

  const dismissNotification = useCallback((notificationId: string) => {
    notificationService.dismissNotification(notificationId);
  }, []);

  const markAllAsRead = useCallback(() => {
    notificationService.markAllAsRead();
  }, []);

  const clearAll = useCallback(() => {
    notificationService.clearAll();
    alertService.clearAlerts();
  }, []);

  // Alert actions
  const dismissAlert = useCallback((alertId: string) => {
    alertService.dismissAlert(alertId);
  }, []);

  // ✨ Enhanced refresh function with force capability
  const refresh = useCallback(async () => {
    setIsLoading(true);
    try {
      console.log("🔄 Force refreshing notifications and alerts...");

      // Force clear cache for both services
      notificationService.forceClearCache();
      alertService.forceClearCache();

      // Now refresh both services which will fetch fresh data
      await Promise.all([
        notificationService.refresh(),
        alertService.refresh(),
      ]);

      console.log("✅ Force refresh completed");
    } catch (error) {
      console.error("Error force refreshing notifications and alerts:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Get cache status for debugging (development only)
  const getCacheStatus = useCallback(() => {
    if (__DEV__) {
      return {
        notifications: notificationService.getCacheStatus(),
        alerts: alertService.getCacheStatus(),
      };
    }
    return null;
  }, []);

  // Test connectivity for both services (development helper)
  const testConnectivity = useCallback(async () => {
    if (__DEV__) {
      console.log("🔍 Testing API connectivity...");
      await Promise.all([
        notificationService.testApiConnectivity(),
        alertService.testConnectivity(),
      ]);
    }
  }, []);

  return {
    // Data
    notifications,
    alerts,
    unreadCount,
    isLoading,

    // Notification actions
    markAsRead,
    dismissNotification,
    markAllAsRead,
    clearAll,

    // Alert actions
    dismissAlert,

    // Refresh action (now includes force clear)
    refresh,

    // Development helpers
    getCacheStatus,
    testConnectivity,
  };
}
