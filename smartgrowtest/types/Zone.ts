// types/Zone.ts
export type ZoneStatus = "Optimal" | "Warning" | "Critical";

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
};

export type ZoneCategory = {
  id: string;
  name: string;
  zones: Zone[];
  color: string;
  icon: string;
};
