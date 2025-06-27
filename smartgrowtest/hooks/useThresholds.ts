// hooks/useThresholds.ts
import { useState, useEffect, useCallback } from "react";
import { thresholdsService } from "../services/thresholdsService";
import {
  SystemThresholds,
  ThresholdsResponse,
  ThresholdUpdateRequest,
} from "../types/Thresholds";

interface UseThresholdsReturn {
  thresholds: SystemThresholds | null;
  lastUpdated: string;
  loading: boolean;
  error: string | null;
  refreshThresholds: () => Promise<void>;
  updateThresholds: (data: ThresholdUpdateRequest) => Promise<boolean>;
  updating: boolean;
}

export function useThresholds(): UseThresholdsReturn {
  const [thresholds, setThresholds] = useState<SystemThresholds | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch thresholds from API
  const fetchThresholds = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response: ThresholdsResponse =
        await thresholdsService.getSystemThresholds();
      setThresholds(response.thresholds);
      setLastUpdated(response.lastUpdated);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch thresholds";
      setError(errorMessage);
      console.error("Error fetching thresholds:", err);

      // Set default values on error
      const defaultThresholds = thresholdsService.getDefaultThresholds();
      setThresholds(defaultThresholds);
    } finally {
      setLoading(false);
    }
  }, []);

  // Update thresholds
  const updateThresholds = useCallback(
    async (data: ThresholdUpdateRequest): Promise<boolean> => {
      try {
        setUpdating(true);
        setError(null);

        await thresholdsService.updateSystemThresholds(data);

        // Update local state
        setThresholds(data as SystemThresholds);
        setLastUpdated(new Date().toISOString());

        // Refresh from server to ensure consistency
        await fetchThresholds();

        return true;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to update thresholds";
        setError(errorMessage);
        console.error("Error updating thresholds:", err);
        return false;
      } finally {
        setUpdating(false);
      }
    },
    [fetchThresholds]
  );

  // Refresh thresholds manually
  const refreshThresholds = useCallback(async () => {
    await fetchThresholds();
  }, [fetchThresholds]);

  // Initial fetch on mount
  useEffect(() => {
    fetchThresholds();
  }, [fetchThresholds]);

  // Auto-refresh every 5 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      if (!loading && !updating) {
        fetchThresholds();
      }
    }, 5 * 60 * 1000); // 5 minutes

    return () => clearInterval(interval);
  }, [loading, updating, fetchThresholds]);

  return {
    thresholds,
    lastUpdated,
    loading,
    error,
    refreshThresholds,
    updateThresholds,
    updating,
  };
}
