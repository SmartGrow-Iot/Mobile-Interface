// types/Sensor.ts
export type SensorType =
  | "light"
  | "soil"
  | "airquality"
  | "temperature"
  | "humidity";

export type SensorInfo = {
  id: string;
  type: SensorType;
  name: string;
  icon: string;
  description?: string;
  unit?: string;
  range?: {
    min: number;
    max: number;
  };
};

export type GroupData = {
  id: string;
  group: string;
  icon: string;
  value: string;
  critical: boolean;
  zone?: string;
  lastUpdated?: Date;
};
