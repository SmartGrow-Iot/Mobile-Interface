// hooks/useNotifications.ts
import { useState, useEffect } from "react";
import { notificationService } from "../services/notificationService";
import { Notification } from "../types/Notification";

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Subscribe to notifications
    const unsubscribe = notificationService.subscribe((newNotifications) => {
      setNotifications(newNotifications);
      setUnreadCount(notificationService.getUnreadCount());
    });

    // Initialize notifications
    const initialize = async () => {
      setIsLoading(true);
      try {
        await notificationService.initialize();
      } finally {
        setIsLoading(false);
      }
    };

    initialize();

    return unsubscribe;
  }, []);

  const markAsRead = (notificationId: string) => {
    notificationService.markAsRead(notificationId);
  };

  const dismissNotification = (notificationId: string) => {
    notificationService.dismissNotification(notificationId);
  };

  const markAllAsRead = () => {
    notificationService.markAllAsRead();
  };

  const clearAll = () => {
    notificationService.clearAll();
  };

  const refresh = async () => {
    setIsLoading(true);
    try {
      await notificationService.refresh();
    } finally {
      setIsLoading(false);
    }
  };

  return {
    notifications,
    unreadCount,
    isLoading,
    markAsRead,
    dismissNotification,
    markAllAsRead,
    clearAll,
    refresh,
  };
}
