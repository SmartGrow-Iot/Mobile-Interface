// hooks/useNotifications.ts - Updated to include alerts
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

  // Initialize services
  useEffect(() => {
    const initializeServices = async () => {
      setIsLoading(true);
      try {
        // Subscribe to notifications
        const unsubscribeNotifications = notificationService.subscribe(
          (newNotifications) => {
            setNotifications(newNotifications);
          }
        );

        // Subscribe to alerts
        const unsubscribeAlerts = alertService.subscribe((newAlerts) => {
          setAlerts(newAlerts);
        });

        // Initialize both services
        await Promise.all([
          notificationService.initialize(),
          alertService.initialize(),
        ]);

        // Store cleanup functions
        return () => {
          unsubscribeNotifications();
          unsubscribeAlerts();
        };
      } catch (error) {
        console.error("Error initializing notification services:", error);
      } finally {
        setIsLoading(false);
      }
    };

    const cleanup = initializeServices();

    // Cleanup on unmount
    return () => {
      cleanup.then((cleanupFn) => cleanupFn?.());
    };
  }, []);

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

  // Refresh both services
  const refresh = useCallback(async () => {
    setIsLoading(true);
    try {
      await Promise.all([
        notificationService.refresh(),
        alertService.refresh(),
      ]);
    } catch (error) {
      console.error("Error refreshing notifications and alerts:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    // Notifications
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

    // Common actions
    refresh,
  };
}
