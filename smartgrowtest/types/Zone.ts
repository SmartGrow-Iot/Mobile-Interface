// types/Zone.ts - Updated with actuator data
export type ZoneStatus = "Optimal" | "Warning" | "Critical";

export type ActuatorType = "watering" | "light" | "fan";

export type Actuator = {
  actuatorId: string;
  description: string;
  type: ActuatorType;
  createdAt: string;
  actuatorModel: string;
  zone: string;
};

export type ActuatorsByZone = {
  count: number;
  actuators: Actuator[];
};

export type Zone = {
  id: string;
  name: string;
  icon: string;
  status: ZoneStatus;
  plantCount: number;
  plantType: "chili" | "eggplant" | "mixed";
  averageWaterLevel: number;
  averageLightLevel: number;
  temperature?: number;
  humidity?: number;
  lastUpdated?: Date;
  // New actuator data
  actuators?: {
    watering: Actuator[];
    light: Actuator[];
    fan: Actuator[];
  };
  plants?: any[]; // Will store plant data
};

export type ZoneCategory = {
  id: string;
  name: string;
  zones: Zone[];
  color: string;
  icon: string;
};
