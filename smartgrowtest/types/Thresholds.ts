// types/Thresholds.ts
export interface ThresholdRange {
  min: number;
  max: number;
}

export interface SystemThresholds {
  light: ThresholdRange;
  temperature: ThresholdRange;
  airQuality: ThresholdRange;
}

export interface ThresholdsResponse {
  thresholds: SystemThresholds;
  lastUpdated: string;
}

export interface ThresholdFormData {
  light: { min: string; max: string };
  temperature: { min: string; max: string };
  airQuality: { min: string; max: string };
}

export interface ThresholdUpdateRequest {
  light?: ThresholdRange;
  temperature?: ThresholdRange;
  airQuality?: ThresholdRange;
}

export interface ThresholdValidationResult {
  isValid: boolean;
  errors: string[];
}

// Validation helpers
export const ThresholdValidation = {
  validateRange: (min: number, max: number, fieldName: string): string[] => {
    const errors: string[] = [];

    if (typeof min !== "number" || typeof max !== "number") {
      errors.push(`${fieldName} thresholds must be valid numbers`);
    } else if (min >= max) {
      errors.push(`${fieldName} minimum must be less than maximum`);
    }

    return errors;
  },

  validateLight: (range: ThresholdRange): string[] => {
    const errors = ThresholdValidation.validateRange(
      range.min,
      range.max,
      "Light"
    );

    if (range.min < 0 || range.max < 0) {
      errors.push("Light thresholds cannot be negative");
    }

    return errors;
  },

  validateTemperature: (range: ThresholdRange): string[] => {
    const errors = ThresholdValidation.validateRange(
      range.min,
      range.max,
      "Temperature"
    );

    if (range.min < -50 || range.max > 100) {
      errors.push("Temperature thresholds must be between -50°C and 100°C");
    }

    return errors;
  },

  validateAirQuality: (range: ThresholdRange): string[] => {
    const errors = ThresholdValidation.validateRange(
      range.min,
      range.max,
      "Air quality"
    );

    if (range.min < 0 || range.max < 0) {
      errors.push("Air quality thresholds cannot be negative");
    }

    return errors;
  },
};

// Default values
export const ThresholdDefaults = {
  LIGHT: { min: 0, max: 200 },
  TEMPERATURE: { min: 20, max: 30 },
  AIR_QUALITY: { min: 0, max: 100 },
} as const;

// Threshold configuration for UI display
export const ThresholdConfig = {
  light: {
    label: "Light",
    icon: "☀️",
    unit: "",
    color: "#f39c12",
    description: "Light intensity thresholds for optimal plant growth",
  },
  temperature: {
    label: "Temperature",
    icon: "🌡️",
    unit: "°C",
    color: "#e74c3c",
    description: "Temperature range for optimal growing conditions",
  },
  airQuality: {
    label: "Air Quality",
    icon: "🌬️",
    unit: "ppm",
    color: "#95a5a6",
    description: "Air quality thresholds for healthy environment",
  },
} as const;
